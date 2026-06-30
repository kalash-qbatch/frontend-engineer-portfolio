import sharp from "sharp";
import { join } from "node:path";

const input = join(process.cwd(), "public/profile.jpg");
const output = join(process.cwd(), "public/profile-cutout.png");

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;
const pixels = new Uint8Array(data);

function sampleCornerColor() {
  const samples = [
    [2, 2],
    [width - 3, 2],
    [2, height - 3],
    [width - 3, height - 3],
  ];

  let r = 0;
  let g = 0;
  let b = 0;

  for (const [x, y] of samples) {
    const i = (y * width + x) * channels;
    r += pixels[i];
    g += pixels[i + 1];
    b += pixels[i + 2];
  }

  return [r / samples.length, g / samples.length, b / samples.length];
}

const [bgR, bgG, bgB] = sampleCornerColor();
const threshold = 42;
const feather = 28;

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels;
    const dr = pixels[i] - bgR;
    const dg = pixels[i + 1] - bgG;
    const db = pixels[i + 2] - bgB;
    const dist = Math.sqrt(dr * dr + dg * dg + db * db);

    if (dist <= threshold) {
      pixels[i + 3] = 0;
    } else if (dist <= threshold + feather) {
      const t = (dist - threshold) / feather;
      pixels[i + 3] = Math.round(255 * t);
    }
  }
}

await sharp(pixels, { raw: { width, height, channels } }).png().toFile(output);

console.log(`Saved transparent cutout to ${output}`);
