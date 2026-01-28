import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, "package.json");

try {
  const contents = fs.readFileSync(packagePath, "utf8");
  JSON.parse(contents);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Invalid package.json: ${message}`);
  process.exit(1);
}
