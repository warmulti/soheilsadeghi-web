import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Don't advertise the framework, and never ship browser source maps (they would expose the
  // original source). Client JavaScript is still minified by the production build.
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compiler: {
    // Strip console.* from the shipped code in production, but keep error/warn for diagnostics.
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

// withPayload keeps the CMS's native/server-only packages (libsql, drizzle-kit, sharp…) out of the bundle.
export default withPayload(nextConfig);
