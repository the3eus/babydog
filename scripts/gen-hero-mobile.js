const { execFileSync } = require("child_process");
const path = require("path");

const PUBLIC = path.resolve(__dirname, "..", "public");

// A seção da Hero fica retrato (bem mais alta que larga) abaixo do
// breakpoint `sm`, mas a animação da marca é widescreen (1280x720) com a
// marca (cabeça do cachorro + "Baby Dog") ocupando só o centro, entre
// x=~415 e x=~855 — o resto é fundo vazio. Cobrindo a seção toda
// (`object-cover`), o corte automático ampliava demais e cortava o texto.
//
// Corta 370px de cada lado (fica 540x720, proporção 3:4), com margem de
// ~45-60px sobrando de cada lado da marca — cortando só o fundo vazio,
// nunca a logo. Ver bounding box em HeroVideoFundo.tsx.
const CROP = "crop=540:720:370:0";

function run(args) {
  execFileSync("ffmpeg", ["-y", ...args], { stdio: "inherit" });
}

run([
  "-i", path.join(PUBLIC, "hero-video.mp4"),
  "-vf", CROP,
  "-c:v", "libx264",
  "-crf", "20",
  "-preset", "slow",
  "-movflags", "+faststart",
  "-an",
  path.join(PUBLIC, "hero-video-mobile.mp4"),
]);

run([
  "-i", path.join(PUBLIC, "hero-video-poster.webp"),
  "-vf", CROP,
  path.join(PUBLIC, "hero-video-poster-mobile.webp"),
]);

console.log("wrote public/hero-video-mobile.mp4 and public/hero-video-poster-mobile.webp");
