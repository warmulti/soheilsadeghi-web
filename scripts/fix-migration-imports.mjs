// Payload's generated migrations are written for a bundler. The CLI runs our config with Node's native
// TypeScript support, which needs (1) explicit `.ts` extensions in src/migrations/index.ts and
// (2) type-only imports marked with `type`. This script fixes both after `payload migrate:create`.
import fs from "node:fs";
import path from "node:path";

const dir = new URL("../src/migrations/", import.meta.url);
for (const name of fs.readdirSync(dir)) {
  if (!name.endsWith(".ts")) continue;
  const file = new URL(name, dir);
  const src = fs.readFileSync(file, "utf8");
  let out = src;
  if (name === "index.ts") out = out.replace(/from '(\.\/[^'.]+)'/g, "from '$1.ts'");
  out = out.replace(/import \{([^}]*)\} from '@payloadcms\/db-sqlite'/, (_m, list) => {
    const items = list
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => (/^Migrate(Up|Down)Args$/.test(s) ? `type ${s}` : s));
    return `import { ${items.join(", ")} } from '@payloadcms/db-sqlite'`;
  });
  if (out !== src) fs.writeFileSync(file, out);
}
console.log("migrations fixed for native TypeScript:", path.basename(dir.pathname));
