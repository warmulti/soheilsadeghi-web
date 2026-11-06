import { NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";
import { isStaffUser } from "@/payload/access";
import type { Download, File as FileDoc } from "@/payload-types";
import { isFirstChunk, serveFile } from "@/lib/serve-file";

/**
 * GET /api/download/:id — the only way to fetch a download.
 * Visibility rules: public → anyone; members → logged in; groups → members of those groups
 * (enforced by the collection's read access, so a hidden item simply isn't found).
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

  if (doc.visibility !== "public" && !user && !isStaffUser(user)) {
    const back = req.headers.get("referer");
    const login = new URL("/login", req.url);
    if (back) login.searchParams.set("next", new URL(back).pathname);
    return NextResponse.redirect(login, 303);
  }

  // Straight to the database: a normal update would add a version to the item's history.
  const count = () => {
    if (!isFirstChunk(req)) return;
    void payload.db
      .updateOne({ collection: "downloads", id: doc.id, data: { downloadCount: (doc.downloadCount ?? 0) + 1 } })
      .catch(() => undefined);
  };

  if (doc.source === "link") {
    if (!doc.externalUrl || !/^https?:\/\//i.test(doc.externalUrl)) return new Response("Not found", { status: 404 });
    count();
    return NextResponse.redirect(doc.externalUrl, 302);
  }

  // The visitor may not read the private `files` collection itself, so the relation comes back as an
  // id — access was already checked on the download above, so load the file with server rights.
  const fileId = typeof doc.file === "object" && doc.file ? doc.file.id : doc.file;
  if (!fileId) return new Response("Not found", { status: 404 });
  const file = (await payload.findByID({ collection: "files", id: fileId, overrideAccess: true, depth: 0 }).catch(() => null)) as FileDoc | null;
  if (!file) return new Response("Not found", { status: 404 });
  const res = await serveFile(req, file, "attachment");
  if (res.ok) count();
  return res;
}
