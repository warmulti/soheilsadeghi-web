import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

// withPayload keeps the CMS's native/server-only packages (libsql, drizzle-kit, sharp…) out of the bundle.
export default withPayload(nextConfig);
