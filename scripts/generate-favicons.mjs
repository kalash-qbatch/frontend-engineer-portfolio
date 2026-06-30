import { execSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const source = join(root, "public/photos/portrait-professional.png");
const square = join(root, ".tmp-favicon-square.png");

if (!existsSync(source)) {
  console.error("Profile image not found:", source);
  process.exit(1);
}

mkdirSync(join(root, "app"), { recursive: true });
mkdirSync(join(root, "public"), { recursive: true });

// Face-focused square crop from the top of the portrait
execSync(
  `sips --cropToHeightWidth 769 769 --cropOffset 0 0 "${source}" --out "${square}"`,
  { stdio: "inherit" }
);

const outputs = [
  { size: 32, out: join(root, "app/icon.png") },
  { size: 48, out: join(root, "public/icon-48.png") },
  { size: 180, out: join(root, "app/apple-icon.png") },
  { size: 192, out: join(root, "public/icon-192.png") },
  { size: 512, out: join(root, "public/icon-512.png") },
];

for (const { size, out } of outputs) {
  execSync(`sips -z ${size} ${size} "${square}" --out "${out}"`, { stdio: "inherit" });
}

copyFileSync(join(root, "app/icon.png"), join(root, "public/favicon.png"));

console.log("Favicons generated from profile image.");
