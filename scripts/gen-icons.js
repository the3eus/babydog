const sharp = require("sharp");
const path = require("path");

const PUBLIC = path.resolve(__dirname, "..", "public");
const APP = path.resolve(__dirname, "..", "app");
const MARCA = path.join(PUBLIC, "marca-babydog.png");
const BRAND = "#076589";

async function makeIcon(size, radiusRatio, outPath) {
  const r = Math.round(size * radiusRatio);
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="${BRAND}"/></svg>`
  );
  const markW = Math.round(size * 0.72);
  const mark = await sharp(MARCA).resize({ width: markW }).toBuffer();
  const markMeta = await sharp(mark).metadata();

  await sharp(bg)
    .png()
    .composite([
      {
        input: mark,
        left: Math.round((size - markMeta.width) / 2),
        top: Math.round((size - markMeta.height) / 2),
      },
    ])
    .toFile(outPath);
  console.log("wrote", outPath);
}

async function main() {
  await makeIcon(512, 0.22, path.join(APP, "icon.png"));
  await makeIcon(180, 0.22, path.join(APP, "apple-icon.png"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
