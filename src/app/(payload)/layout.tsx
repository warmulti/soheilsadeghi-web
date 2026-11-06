/* Payload admin root layout (separate from the public site's layout). */
import config from "@payload-config";
import "@payloadcms/next/css";
import "vazirmatn/Vazirmatn-Variable-font-face.css";
import type { ServerFunctionClient } from "payload";
import { handleServerFunctions, RootLayout } from "@payloadcms/next/layouts";
import type React from "react";
import { importMap } from "./admin/importMap.js";
import "./custom.css";

const serverFunction: ServerFunctionClient = async function (args) {
  "use server";
  return handleServerFunctions({ ...args, config, importMap });
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
      {children}
    </RootLayout>
  );
}
