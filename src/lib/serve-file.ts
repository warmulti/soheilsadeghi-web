import fs from "fs";
import path from "path";
import { Readable } from "stream";
import type { File as FileDoc } from "@/payload-types";

/** Folder of the private `files` upload collection (see payload/collections/Files.ts). */
export const FILES_DIR = path.resolve(process.cwd(), "files");

/**
 * Streams a private upload from disk with HTTP Range support (needed to seek in video/audio).
 * `attachment` forces a download dialog; `inline` lets the browser play/show it.
 */
export async function serveFile(req: Request, file: FileDoc, disposition: "inline" | "attachment"): Promise<Response> {
  if (!file.filename) return new Response("Not found", { status: 404 });
  const filePath = path.join(FILES_DIR, path.basename(file.filename));
  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const headers = new Headers({
    "content-type": file.mimeType || "application/octet-stream",
    "accept-ranges": "bytes",
    "cache-control": "private, no-store",
    "x-content-type-options": "nosniff",
    "content-disposition": `${disposition}; filename*=UTF-8''${encodeURIComponent(file.filename)}`,
  });

  const range = req.headers.get("range");
  const match = range ? /^bytes=(\d*)-(\d*)$/.exec(range) : null;
  if (match) {
    let start = match[1] ? Number(match[1]) : NaN;
    let end = match[2] ? Number(match[2]) : NaN;
    if (Number.isNaN(start)) {
      // suffix range: last N bytes
      start = Math.max(0, stat.size - end);
      end = stat.size - 1;
    } else if (Number.isNaN(end) || end >= stat.size) {
      end = stat.size - 1;
    }
    if (start > end || start >= stat.size) {
      return new Response(null, { status: 416, headers: { "content-range": `bytes */${stat.size}` } });
    }
    headers.set("content-range", `bytes ${start}-${end}/${stat.size}`);
    headers.set("content-length", String(end - start + 1));
    const stream = Readable.toWeb(fs.createReadStream(filePath, { start, end })) as ReadableStream;
    return new Response(stream, { status: 206, headers });
  }

  headers.set("content-length", String(stat.size));
  const stream = Readable.toWeb(fs.createReadStream(filePath)) as ReadableStream;
  return new Response(stream, { status: 200, headers });
}

/** True when this request starts a new download (not a later Range chunk of the same one). */
export const isFirstChunk = (req: Request) => {
  const range = req.headers.get("range");
  return !range || /^bytes=0-/.test(range);
};
