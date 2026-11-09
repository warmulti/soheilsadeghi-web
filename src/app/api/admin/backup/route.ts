import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/cms";
import { backupFilename, backupResponseStream, type BackupScope } from "@/lib/backup";

export const dynamic = "force-dynamic";

/**
 * Admin-only backup download. Backups contain password hashes and every student's data, so only
 * full administrators may download them (not editors).
 *   GET /api/admin/backup?scope=db     → database only
 *   GET /api/admin/backup?scope=full   → database + media + files
 */
export async function GET(req: Request) {
  const user = await getCurrentUser();
  if (user?.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const scope: BackupScope = new URL(req.url).searchParams.get("scope") === "full" ? "full" : "db";
  return new Response(backupResponseStream(scope), {
    headers: {
      "content-type": "application/zip",
      "content-disposition": `attachment; filename="${backupFilename(scope)}"`,
      "cache-control": "no-store",
    },
  });
}
