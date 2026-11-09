/**
 * On-demand backups, downloaded as a .zip from the admin dashboard (admin only).
 *
 *   scope "db"    → just the database (a consistent snapshot of the SQLite file)
 *   scope "full"  → the database plus the uploaded media/ and files/ folders
 *
 * The database snapshot is taken with `VACUUM INTO`, which merges the write-ahead log, so the copy
 * is always consistent even while the site is running. The zip is produced as a stream, one file at
 * a time, so even a large media library doesn't have to fit in memory.
 *
 * These downloads are in addition to the server's nightly `soheil-backup` cron job.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import zlib from "node:zlib";
import { getPayloadClient } from "@/lib/cms";

export type BackupScope = "db" | "full";

const dataRoot = () => process.cwd();

function dbFilePath(): string {
  const uri = process.env.DATABASE_URI || "file:./data/soheil.db";
  const rel = uri.startsWith("file:") ? uri.slice("file:".length) : uri;
  return path.resolve(dataRoot(), rel);
}

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

export const backupFilename = (scope: BackupScope) => `soheil-${scope}-${stamp()}.zip`;

/** Consistent snapshot of the database into a temp file. The caller must delete it afterwards. */
async function snapshotDb(): Promise<string> {
  const tmp = path.join(os.tmpdir(), `soheil-db-${Date.now()}-${Math.random().toString(36).slice(2)}.db`);
  const payload = await getPayloadClient();
  // At runtime the sqlite adapter holds a connected libsql client with `.execute`; its published
  // type still shows the pre-connect Config, so narrow through `unknown`.
  const client = (payload.db as unknown as { client?: { execute?: (sql: string) => Promise<unknown> } }).client;
  try {
    if (!client?.execute) throw new Error("no sqlite client");
    const target = tmp.replace(/\\/g, "/").replace(/'/g, "''"); // SQLite accepts forward slashes on Windows
    await client.execute(`VACUUM INTO '${target}'`);
  } catch {
    // Fallback: checkpoint the WAL, then copy the file directly.
    try {
      await client?.execute?.("PRAGMA wal_checkpoint(TRUNCATE)");
    } catch {
      // ignore — a plain copy is still a reasonable backup
    }
    fs.copyFileSync(dbFilePath(), tmp);
  }
  return tmp;
}

type ZipEntry = { name: string; file?: string; data?: Buffer; mtime?: Date };

function* walkDir(absDir: string, prefix: string): Generator<ZipEntry> {
  if (!fs.existsSync(absDir)) return;
  for (const name of fs.readdirSync(absDir).sort()) {
    const abs = path.join(absDir, name);
    const st = fs.statSync(abs);
    if (st.isDirectory()) yield* walkDir(abs, `${prefix}${name}/`);
    else yield { name: `${prefix}${name}`, file: abs, mtime: st.mtime };
  }
}

/** The files that make up a backup, in order. Deletes the temp DB snapshot when iteration ends. */
async function* backupEntries(scope: BackupScope): AsyncGenerator<ZipEntry> {
  const snap = await snapshotDb();
  try {
    yield { name: `database/soheil-${stamp()}.db`, file: snap };
    if (scope === "full") {
      yield* walkDir(path.join(dataRoot(), "media"), "media/");
      yield* walkDir(path.join(dataRoot(), "files"), "files/");
      const readme =
        "پشتیبان سایت soheilsadeghi.com\n\n" +
        "database/  نسخه پایگاه داده (SQLite)\n" +
        "media/     تصاویر بارگذاری‌شده\n" +
        "files/     فایل‌های دانلودی خصوصی\n\n" +
        "بازگردانی: راهنمای بخش «بازگردانی پشتیبان» در DEPLOY.md\n";
      yield { name: "README.txt", data: Buffer.from(readme, "utf8") };
    }
  } finally {
    fs.rm(snap, { force: true }, () => {});
  }
}

const dosTime = (d: Date) => ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xffff;
const dosDate = (d: Date) => (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff;

/** Streams a ZIP (deflate, store-only when that's smaller) built from the given entries. */
async function* zipStream(entries: AsyncIterable<ZipEntry>): AsyncGenerator<Buffer> {
  const central: Buffer[] = [];
  let offset = 0;
  let count = 0;

  for await (const entry of entries) {
    const data = entry.data ?? fs.readFileSync(entry.file as string);
    const mtime = entry.mtime ?? new Date();
    const name = Buffer.from(entry.name, "utf8");
    const deflated = zlib.deflateRawSync(data, { level: 6 });
    const useDeflate = deflated.length < data.length;
    const body = useDeflate ? deflated : data;
    const crc = zlib.crc32(data) >>> 0;
    const method = useDeflate ? 8 : 0;

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6); // UTF-8 names
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(dosTime(mtime), 10);
    local.writeUInt16LE(dosDate(mtime), 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    yield Buffer.concat([local, name, body]);

    const cen = Buffer.alloc(46);
    cen.writeUInt32LE(0x02014b50, 0);
    cen.writeUInt16LE(20, 4);
    cen.writeUInt16LE(20, 6);
    cen.writeUInt16LE(0x0800, 8);
    cen.writeUInt16LE(method, 10);
    cen.writeUInt16LE(dosTime(mtime), 12);
    cen.writeUInt16LE(dosDate(mtime), 14);
    cen.writeUInt32LE(crc, 16);
    cen.writeUInt32LE(body.length, 20);
    cen.writeUInt32LE(data.length, 24);
    cen.writeUInt16LE(name.length, 28);
    cen.writeUInt32LE(offset, 42);
    central.push(Buffer.concat([cen, name]));

    offset += 30 + name.length + body.length;
    count++;
  }

  const cat = Buffer.concat(central);
  if (cat.length) yield cat;
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(count, 8);
  end.writeUInt16LE(count, 10);
  end.writeUInt32LE(cat.length, 12);
  end.writeUInt32LE(offset, 16);
  yield end;
}

/** A web ReadableStream of the backup zip, for a Route Handler Response body. */
export function backupResponseStream(scope: BackupScope): ReadableStream<Uint8Array> {
  const gen = zipStream(backupEntries(scope));
  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { value, done } = await gen.next();
      if (done) controller.close();
      else controller.enqueue(new Uint8Array(value));
    },
    async cancel() {
      await gen.return?.(undefined);
    },
  });
}
