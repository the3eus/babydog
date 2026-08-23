const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const SRC_DIR = path.resolve(__dirname, "..", "..", "imagens clinica babydog");
const OUT_DIR = path.resolve(__dirname, "..", "public", "estrutura");

const itens = [
  { src: "WhatsApp Image 2026-08-22 at 21.22.11.jpeg", out: "consultorio.webp" },
  { src: "WhatsApp Image 2026-08-22 at 21.22.11 (1).jpeg", out: "ambulatorio.webp" },
  { src: "WhatsApp Image 2026-08-22 at 21.22.11 (2).jpeg", out: "farmacia.webp" },
  { src: "WhatsApp Image 2026-08-22 at 21.23.43.jpeg", out: "sala-imagem.webp" },
  { src: "WhatsApp Image 2026-08-22 at 21.24.17.jpeg", out: "espera.webp" },
];

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  for (const item of itens) {
    const src = path.join(SRC_DIR, item.src);
    const out = path.join(OUT_DIR, item.out);
    await sharp(src)
      .rotate() // aplica orientação EXIF antes de qualquer resize
      .resize({ width: 900, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out);
    const meta = await sharp(out).metadata();
    console.log(item.out, meta.width + "x" + meta.height, (fs.statSync(out).size / 1024).toFixed(0) + "KB");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
