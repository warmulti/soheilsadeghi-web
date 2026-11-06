import { getPayload } from "payload";
import config from "@payload-config";
import { isStaffUser } from "@/payload/access";
import type { File as FileDoc } from "@/payload-types";
import { serveFile } from "@/lib/serve-file";

/**
 * GET /api/file/:id — course-material files (lesson videos and attachments).
 * Allowed when the visitor can read at least one material that uses this file
 * (materials' read access already limits that to the student's groups).
 */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = await getPayload({ config });
  const { user } = await payload.auth({ headers: req.headers });
  if (!user) return new Response("Unauthorized", { status: 401 });

  const fileId = Number(id);
  if (!Number.isFinite(fileId)) return new Response("Not found", { status: 404 });

  if (!isStaffUser(user)) {
    const used = await payload.find({
      collection: "materials",
      where: { or: [{ video: { equals: fileId } }, { attachments: { in: [fileId] } }] },
      user,
      overrideAccess: false,
      depth: 0,
      limit: 1,
    });
    if (used.totalDocs === 0) return new Response("Forbidden", { status: 403 });
  }

  const file = (await payload.findByID({ collection: "files", id: fileId, overrideAccess: true, depth: 0 }).catch(() => null)) as FileDoc | null;
  if (!file) return new Response("Not found", { status: 404 });
  const playable = /^(video|audio)\//.test(file.mimeType ?? "");
  return serveFile(req, file, playable ? "inline" : "attachment");
}
