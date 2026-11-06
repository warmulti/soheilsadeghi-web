/**
 * Packs the built site into deploy/soheil-cpanel-<date>.zip for uploading to cPanel.
 * Run `npm run package:cpanel` (it builds first).
 *
 * Included: the production build (.next without caches), public/, package files, server.cjs, next.config.ts.
 * Not included: node_modules (install on the server — it needs Linux binaries) and your data
 * (data/, media/, files/ — those live on the server and must never be overwritten by an update).
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "deploy");
const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 13).replace("T", "-");
const outFile = path.join(outDir, `soheil-cpanel-${stamp}.zip`);

const include = ["package.json", "package-lock.json", "next.config.ts", "server.cjs", ".env.example", "public", ".next"];
const skip = [/^\.next[\\/](cache|dev|types|diagnostics)([\\/]|$)/, /^\.next[\\/]trace/, /\.map$/];

if (!fs.existsSync(path.join(root, ".next", "BUILD_ID"))) {
  console.error("No production build found. Run `npm run build` first (or use `npm run package:cpanel`).");
  process.exit(1);
}

/** Collects files (relative paths with forward slashes). */
function walk(rel, list) {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return;
  if (skip.some((re) => re.test(rel))) return;
  const stat = fs.statSync(abs);
  if (stat.isDirectory()) for (const name of fs.readdirSync(abs)) walk(path.join(rel, name), list);
  else list.push(rel.split(path.sep).join("/"));
}

const files = [];
for (const item of include) walk(item, files);

// ── Minimal ZIP writer (deflate, UTF-8 names) ──
const chunks = [];
const central = [];
let offset = 0;
const dosTime = (d) => ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xffff;
const dosDate = (d) => (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xffff;

for (const rel of files) {
  const data = fs.readFileSync(path.join(root, rel));
  const mtime = fs.statSync(path.join(root, rel)).mtime;
  const name = Buffer.from(rel, "utf8");
  const deflated = zlib.deflateRawSync(data, { level: 9 });
  const useDeflate = deflated.length < data.length;
  const body = useDeflate ? deflated : data;
  const crc = zlib.crc32(data);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6); // UTF-8 file names
  local.writeUInt16LE(useDeflate ? 8 : 0, 8);
  local.writeUInt16LE(dosTime(mtime), 10);
  local.writeUInt16LE(dosDate(mtime), 12);
  local.writeUInt32LE(crc >>> 0, 14);
  local.writeUInt32LE(body.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(name.length, 26);
  local.writeUInt16LE(0, 28);
  chunks.push(local, name, body);

  const cen = Buffer.alloc(46);
  cen.writeUInt32LE(0x02014b50, 0);
  cen.writeUInt16LE(20, 4);
  cen.writeUInt16LE(20, 6);
  cen.writeUInt16LE(0x0800, 8);
  cen.writeUInt16LE(useDeflate ? 8 : 0, 10);
  cen.writeUInt16LE(dosTime(mtime), 12);
  cen.writeUInt16LE(dosDate(mtime), 14);
  cen.writeUInt32LE(crc >>> 0, 16);
  cen.writeUInt32LE(body.length, 20);
  cen.writeUInt32LE(data.length, 24);
  cen.writeUInt16LE(name.length, 28);
  cen.writeUInt32LE(offset, 42);
  central.push(cen, name);

  offset += local.length + name.length + body.length;
}

const cenSize = central.reduce((n, b) => n + b.length, 0);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(cenSize, 12);
end.writeUInt32LE(offset, 16);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, Buffer.concat([...chunks, ...central, end]));
const mb = (fs.statSync(outFile).size / 1024 / 1024).toFixed(1);
console.log(`✓ ${files.length} files → ${path.relative(root, outFile)} (${mb} MB)`);
console.log("Upload it to the app folder on cPanel, extract, then click “Run NPM Install” and restart the app. See DEPLOY.md.");
