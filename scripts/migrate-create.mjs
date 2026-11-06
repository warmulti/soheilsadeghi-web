// npm run migrate:create -- <name>
// Creates a Payload migration, then makes it loadable by Node's native TypeScript (see fix-migration-imports.mjs).
import { spawnSync } from "node:child_process";

const name = process.argv[2];
const result = spawnSync("payload", ["migrate:create", "--disable-transpile", ...(name ? [name] : [])], {
  stdio: "inherit",
  shell: true,
});
if (result.status !== 0) process.exit(result.status ?? 1);
await import("./fix-migration-imports.mjs");
