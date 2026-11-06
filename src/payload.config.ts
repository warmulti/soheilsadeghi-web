import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { fa } from "@payloadcms/translations/languages/fa";
import { en } from "@payloadcms/translations/languages/en";
import sharp from "sharp";

import { Users } from "./payload/collections/Users.ts";
import { Groups } from "./payload/collections/Groups.ts";
import { Media } from "./payload/collections/Media.ts";
import { Files } from "./payload/collections/Files.ts";
import { Downloads } from "./payload/collections/Downloads.ts";
import { Materials } from "./payload/collections/Materials.ts";
import { Pages } from "./payload/collections/Pages.ts";
import { Requests } from "./payload/collections/Requests.ts";
import { Navigation, Settings } from "./payload/globals/Settings.ts";
import { Home } from "./payload/globals/Home.ts";
import { AbletonCourse, DjingCourse } from "./payload/globals/Courses.ts";
import { Biography, BuyingGuide, ContactPage } from "./payload/globals/Pages.ts";
import { ChatSettings } from "./payload/globals/Chat.ts";
import { seed } from "./payload/seed/index.ts";
import { migrations } from "./migrations/index.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const serverURL = (process.env.SERVER_URL || "http://localhost:3000").replace(/\/$/, "");

/** The site address plus its www / non-www twin, so logins work on both. */
function siteOrigins(url: string): string[] {
  try {
    const u = new URL(url);
    const twin = u.hostname.startsWith("www.") ? u.hostname.slice(4) : `www.${u.hostname}`;
    return u.hostname === "localhost" ? [u.origin] : [u.origin, `${u.protocol}//${twin}${u.port ? `:${u.port}` : ""}`];
  } catch {
    return [url];
  }
}
const origins = siteOrigins(serverURL);

const secret = process.env.PAYLOAD_SECRET;
if (!secret && process.env.NODE_ENV === "production") {
  throw new Error("PAYLOAD_SECRET is not set. Add a long random value in the hosting environment variables.");
}

// SQLite creates the database file but not its folder — make sure data/ exists on a fresh server.
const databaseUri = process.env.DATABASE_URI || "file:./data/soheil.db";
if (databaseUri.startsWith("file:")) {
  fs.mkdirSync(path.dirname(path.resolve(process.cwd(), databaseUri.slice("file:".length))), { recursive: true });
}

/**
 * Outgoing email (sign-up confirmation, password reset, notifications).
 * On the server this is the local Postfix (SMTP_HOST=127.0.0.1, port 25, no login); an external
 * provider works too (port 465/587 with SMTP_USER / SMTP_PASS).
 */
const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || (smtpHost && isLoopback(smtpHost) ? 25 : 465));
function isLoopback(host: string) {
  return host === "localhost" || host === "::1" || host.startsWith("127.");
}
const smtp = smtpHost
  ? nodemailerAdapter({
      defaultFromAddress: process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@soheilsadeghi.com",
      defaultFromName: "DJ Soheil",
      transportOptions: {
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        // Mail to a server on this same machine never leaves it, so TLS adds nothing there.
        ignoreTLS: isLoopback(smtpHost),
        auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      },
    })
  : undefined;

export default buildConfig({
  serverURL,
  secret: secret || "dev-only-secret-change-me",
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: { titleSuffix: " | DJ Soheil", icons: [{ rel: "icon", type: "image/svg+xml", url: "/icon.svg" }] },
    components: {
      graphics: { Logo: "/payload/components/Brand#Logo", Icon: "/payload/components/Brand#Icon" },
      beforeDashboard: ["/payload/components/Welcome#Welcome"],
      // فارسی ⇄ English switch in the panel header and above the login form
      actions: ["/payload/components/LanguageToggle#LanguageToggle"],
      beforeLogin: ["/payload/components/LanguageToggle#LoginLanguageToggle"],
    },
    dateFormat: "yyyy/MM/dd HH:mm",
  },
  i18n: { supportedLanguages: { fa, en }, fallbackLanguage: "fa" },
  localization: {
    locales: [
      { code: "fa", label: "فارسی", rtl: true },
      { code: "en", label: "English" },
    ],
    defaultLocale: "fa",
    fallback: true,
  },
  collections: [Downloads, Materials, Pages, Media, Files, Users, Groups, Requests],
  globals: [Home, DjingCourse, AbletonCourse, BuyingGuide, Biography, ContactPage, Settings, Navigation, ChatSettings],
  editor: lexicalEditor(),
  db: sqliteAdapter({
    client: { url: databaseUri },
    // Schema changes always go through migrations (npm run migrate:create) — the same path in dev
    // and on the server. Dev auto-push is off: it can trip over SQLite table rebuilds.
    push: false,
    prodMigrations: migrations,
  }),
  email: smtp,
  sharp,
  upload: { limits: { fileSize: 1024 * 1024 * 1024 } },
  csrf: origins,
  cors: origins,
  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },
  onInit: seed,
});
