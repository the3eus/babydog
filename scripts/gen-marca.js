const sharp = require("sharp");
const path = require("path");

const SRC_DIR = path.resolve(__dirname, "..", "..", "imagens clinica babydog");
const PUBLIC = path.resolve(__dirname, "..", "public");

async function main() {
  const src = path.join(SRC_DIR, "ce3b2aa0-a460-454e-91f7-5ec14ef8489d.jpeg.jpg");
  const img = sharp(src);
  const meta = await img.metadata();
  console.log("src meta", meta.width, meta.height);

  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // Flood-fill a partir das bordas: só remove o fundo REALMENTE conectado à
  // moldura da imagem, então ruído de artefato JPEG isolado dentro da marca
  // não vira buraco, e o xadrez de fundo desaparece por completo mesmo com
  // variação de tom.
  const isBg = new Uint8Array(width * height);
  function px(x, y) {
    const i = (y * width + x) * channels;
    return [data[i], data[i + 1], data[i + 2]];
  }
  function bgLike(r, g, b) {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const sat = max - min;
    return sat <= 45 && max >= 165;
  }

  const stack = [];
  for (let x = 0; x < width; x++) {
    stack.push([x, 0], [x, height - 1]);
  }
  for (let y = 0; y < height; y++) {
    stack.push([0, y], [width - 1, y]);
  }

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= width || y >= height) continue;
    const idx = y * width + x;
    if (isBg[idx] !== 0) continue;
    const [r, g, b] = px(x, y);
    if (!bgLike(r, g, b)) continue;
    isBg[idx] = 1;
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i++) {
    const si = i * channels;
    const r = data[si];
    const g = data[si + 1];
    const b = data[si + 2];
    const oi = i * 4;
    if (isBg[i] === 1) {
      out[oi] = 255;
      out[oi + 1] = 255;
      out[oi + 2] = 255;
      out[oi + 3] = 0;
    } else {
      out[oi] = r;
      out[oi + 1] = g;
      out[oi + 2] = b;
      out[oi + 3] = 255;
    }
  }

  const trimmed = await sharp(out, { raw: { width, height, channels: 4 } })
    .png()
    .trim({ threshold: 10 })
    .toBuffer();
  const trimmedMeta = await sharp(trimmed).metadata();
  console.log("trimmed", trimmedMeta.width, trimmedMeta.height);

  await sharp(trimmed).toFile(path.join(PUBLIC, "marca-babydog.png"));
  console.log("wrote public/marca-babydog.png");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
