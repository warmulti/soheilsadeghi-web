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
    await ensureModules(payload);
  } catch (err) {
    payload.logger.error({ err }, "Seeding failed");
  }
}

/** Default labels for the modules added after launch (Products, Bookings, Videos). */
const MODULE_CONTENT = {
  fa: {
    nav: { products: "محصولات", bookings: "رزرو اجرا", videos: { label: "ویدیوها", description: "ویدیوهای آموزشی و اجرا" } },
    productsPage: { kicker: "SHOP", title: "محصولات", lead: "مرچ، تجهیزات و پکیج‌هایی که سهیل ارائه می‌کند.", empty: "هنوز محصولی اضافه نشده است. به‌زودی!" },
    bookingPage: {
      kicker: "BOOKING",
      title: "رزرو اجرا",
      lead: "برای اجرای زنده در مراسم، کلاب یا رویداد شما.",
      eventTypes: [{ name: "عروسی" }, { name: "کلاب / پارتی" }, { name: "رویداد شرکتی" }, { name: "جشن خصوصی" }, { name: "سایر" }],
      success: { title: "درخواست رزرو شما ثبت شد", text: "به‌زودی برای هماهنگی با شما تماس می‌گیریم." },
    },
  },
  en: {
    nav: { products: "Products", bookings: "Bookings", videos: { label: "Videos", description: "Tutorials and performances" } },
    productsPage: { kicker: "SHOP", title: "Products", lead: "Merch, gear and packages offered by Soheil.", empty: "No products yet. Coming soon!" },
    bookingPage: {
      kicker: "BOOKING",
      title: "Book a performance",
      lead: "For a live set at your event, club or celebration.",
      eventTypes: [{ name: "Wedding" }, { name: "Club / party" }, { name: "Corporate event" }, { name: "Private celebration" }, { name: "Other" }],
      success: { title: "Your booking request was sent", text: "We'll get in touch soon to arrange the details." },
    },
  },
} as const;

type NavItem = { label: string; short?: string; href: string; description?: string; children?: NavItem[] };

/**
 * Adds the Products / Bookings menu items, the Videos download sub-item, and default content for the
 * new page globals — on every start, but only where they're missing, so admin edits are never undone.
 */
async function ensureModules(payload: Payload) {
  for (const locale of ["fa", "en"] as const) {
    const m = MODULE_CONTENT[locale];

    // Navigation: add the new top-level items and the Videos sub-item if absent.
    const nav = await payload.findGlobal({ slug: "navigation", locale, depth: 0, overrideAccess: true });
    const items: NavItem[] = Array.isArray(nav?.items) ? JSON.parse(JSON.stringify(nav.items)) : [];
    const hasHref = (href: string) => items.some((it) => it.href === href || (it.children ?? []).some((c) => c.href === href));
    let navChanged = false;

    const downloads = items.find((it) => it.href === "/downloads");
    if (downloads && !(downloads.children ?? []).some((c) => c.href === "/downloads/videos")) {
      const kids = downloads.children ?? (downloads.children = []);
      const trackIdx = kids.findIndex((c) => c.href === "/downloads/tracks");
      kids.splice(trackIdx >= 0 ? trackIdx + 1 : kids.length, 0, { label: m.nav.videos.label, href: "/downloads/videos", description: m.nav.videos.description });
      navChanged = true;
    }

    const anchor = items.findIndex((it) => it.href === "/biography" || it.href === "/contact");
    const insertAt = anchor >= 0 ? anchor : items.length;
    if (!hasHref("/bookings")) {
      items.splice(insertAt, 0, { label: m.nav.bookings, href: "/bookings" });
      navChanged = true;
    }
    if (!hasHref("/products")) {
      items.splice(anchor >= 0 ? anchor : items.length, 0, { label: m.nav.products, href: "/products" });
      navChanged = true;
    }
    if (navChanged) await payload.updateGlobal({ slug: "navigation", locale, data: { items } as never, overrideAccess: true });

    // Page globals: fill defaults only when still empty.
    const productsPage = await payload.findGlobal({ slug: "products-page", locale, depth: 0, overrideAccess: true, fallbackLocale: false });
    if (!productsPage?.title) await payload.updateGlobal({ slug: "products-page", locale, data: m.productsPage as never, overrideAccess: true });

    const bookingPage = await payload.findGlobal({ slug: "booking-page", locale, depth: 0, overrideAccess: true, fallbackLocale: false });
    if (!bookingPage?.title) await payload.updateGlobal({ slug: "booking-page", locale, data: m.bookingPage as never, overrideAccess: true });
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
