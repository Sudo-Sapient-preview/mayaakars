import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const standaloneDir = path.join(rootDir, ".next", "standalone");
const standaloneStaticDir = path.join(standaloneDir, ".next", "static");
const standalonePublicDir = path.join(standaloneDir, "public");
const staticDir = path.join(rootDir, ".next", "static");
const publicDir = path.join(rootDir, "public");

function assertExists(targetPath) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Missing required path: ${targetPath}`);
  }
}

function copyDir(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.cpSync(source, destination, { recursive: true, force: true });
}

assertExists(standaloneDir);
assertExists(staticDir);
assertExists(publicDir);

copyDir(staticDir, standaloneStaticDir);
copyDir(publicDir, standalonePublicDir);

console.log(`Standalone bundle prepared at ${standaloneDir}`);
console.log(`Start it with: node .next/standalone/server.js`);

