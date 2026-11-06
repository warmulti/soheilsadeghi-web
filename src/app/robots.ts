import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/", "/account", "/en/account", "/login", "/en/login", "/register", "/en/register", "/verify-email", "/en/verify-email", "/reset-password", "/en/reset-password", "/search", "/en/search"] }],
    sitemap: `${siteUrl()}/sitemap.xml`,
    host: siteUrl(),
  };
}
