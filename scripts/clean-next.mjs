import fs from "node:fs";
import path from "node:path";

const nextDir = path.join(process.cwd(), ".next");

if (fs.existsSync(nextDir)) {
  fs.rmSync(nextDir, {
    recursive: true,
    force: true,
    maxRetries: 10,
    retryDelay: 150,
  });
  console.log(`Removed ${nextDir}`);
}
