import fs from "fs";
import path from "path";
import type { GlobalSlug, Payload } from "payload";
import { en } from "./en.ts";
import { fa } from "./fa.ts";

/**
 * Runs on every start but only does work on an empty database:
 *  1. fills every global in Persian and English,
 *  2. uploads the hero photo into the media library,
 *  3. creates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD (if set and no users exist).
 * Once seeded it never touches content again, so edits made in the admin are safe.
 */
export async function seed(payload: Payload) {
  try {
    await seedGlobals(payload);
    await seedAdmin(payload);
  } catch (err) {
    payload.logger.error({ err }, "Seeding failed");
  }
}

async function seedGlobals(payload: Payload) {
  const home = await payload.findGlobal({ slug: "home", locale: "fa", depth: 0, fallbackLocale: false });
  if (home?.heroPrimary) return;

  payload.logger.info("Seeding initial site content (fa + en)…");
  for (const [locale, data] of [
    ["fa", fa],
    ["en", en],
  ] as const) {
    for (const [slug, value] of Object.entries(data)) {
      await payload.updateGlobal({ slug: slug as GlobalSlug, data: value as never, locale, overrideAccess: true });
    }
  }

  const photoPath = path.resolve(process.cwd(), "public/images/soheil.webp");
  if (fs.existsSync(photoPath)) {
    const photo = await payload.create({
      collection: "media",
      data: { alt: "تصویر دی‌جی سهیل" },
      filePath: photoPath,
      locale: "fa",
      overrideAccess: true,
    });
    await payload.updateGlobal({ slug: "settings", data: { photo: photo.id }, locale: "fa", overrideAccess: true });
    await payload.update({ collection: "media", id: photo.id, data: { alt: "Portrait of DJ Soheil" }, locale: "en", overrideAccess: true });
  }
  payload.logger.info("Initial content seeded.");
}

async function seedAdmin(payload: Payload) {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) return;
  const { totalDocs } = await payload.count({ collection: "users", overrideAccess: true });
  if (totalDocs > 0) return;
  await payload.create({
    collection: "users",
    data: { email, password, name: process.env.ADMIN_NAME || "Soheil", role: "admin" },
    overrideAccess: true,
  });
  payload.logger.info(`Admin account created for ${email}.`);
}
