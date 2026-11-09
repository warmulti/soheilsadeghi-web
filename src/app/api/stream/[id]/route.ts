import { getPayload } from "payload";
import config from "@payload-config";
import { isStaffUser } from "@/payload/access";
import type { Download, File as FileDoc } from "@/payload-types";
import { serveFile } from "@/lib/serve-file";

/**
 * GET /api/stream/:id — streams a download's audio/video file INLINE for the on-site player
 * (podcasts, videos). Same visibility rules as /api/download/:id, enforced by the collection's
 * read access, but served inline (not as a download) and without counting as a download.
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isFinite(id)) return new Response("Not found", { status: 404 });

  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: req.headers });

  const result = await payload.find({
    collection: "downloads",
    where: { id: { equals: id } },
    user,
    overrideAccess: false,
    depth: 0,
    limit: 1,
  });
  const doc = result.docs[0] as Download | undefined;
  if (!doc) return new Response("Not found", { status: 404 });

  // Members/groups items need a logged-in viewer; the read access above already hid ones they can't see.
  if (doc.visibility !== "public" && !user && !isStaffUser(user)) {
    return new Response("Unauthorized", { status: 401 });
  }
  // Only uploaded files can be streamed inline; external links aren't proxied.
  if (doc.source !== "file") return new Response("Not found", { status: 404 });

  const fileId = typeof doc.file === "object" && doc.file ? doc.file.id : doc.file;
  if (!fileId) return new Response("Not found", { status: 404 });
  const file = (await payload.findByID({ collection: "files", id: fileId, overrideAccess: true, depth: 0 }).catch(() => null)) as FileDoc | null;
  if (!file) return new Response("Not found", { status: 404 });
  if (!/^(audio|video)\//.test(file.mimeType ?? "")) return new Response("Not playable", { status: 415 });

  return serveFile(req, file, "inline");
}
