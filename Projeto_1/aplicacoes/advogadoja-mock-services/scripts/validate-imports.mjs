import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const sources = [];

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name === "dist") continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.(ts|tsx|mjs)$/.test(e.name)) sources.push(p);
  }
}

walk(path.join(root, "src"));
walk(path.join(root, "scripts"));

const missing = [];
const re = /(?:from\s+|import\s*\()(["'])(\.{1,2}\/[^"']+)\1/g;
for (const file of sources) {
  const text = fs.readFileSync(file, "utf8");
  for (const m of text.matchAll(re)) {
    const target = path.resolve(path.dirname(file), m[2]);
    const candidates = [
      target,
      target + ".ts",
      target + ".tsx",
      target + ".mjs",
      path.join(target, "index.ts"),
      path.join(target, "index.tsx"),
    ];
    if (!candidates.some(fs.existsSync)) missing.push(`${path.relative(root, file)} -> ${m[2]}`);
  }
}

if (missing.length) {
  console.error(`Imports relativos ausentes:\n${missing.join("\n")}`);
  process.exit(1);
}
console.log(`OK: ${sources.length} fontes verificadas; imports relativos resolvidos.`);
