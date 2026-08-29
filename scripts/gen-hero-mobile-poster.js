const { execFileSync } = require("child_process");
const path = require("path");

const SRC_DIR = path.resolve(__dirname, "..", "..", "imagens clinica babydog");
const PUBLIC = path.resolve(__dirname, "..", "public");

// Vídeo vertical (720x1280/9:16) enviado pela clínica especificamente para
// o fundo da Hero no mobile — ao contrário do vídeo widescreen original,
// já nasce no formato certo pra seção retrato do celular, então não
// precisa de corte nenhum, só remux (tira o áudio, que o <video> nunca
// toca) e a extração do poster estático.
const SRC = path.join(SRC_DIR, "video para cell - hero web mobile.mp4");

execFileSync("ffmpeg", [
  "-y",
  "-i", SRC,
  "-an",
  "-c:v", "copy",
  path.join(PUBLIC, "hero-video-mobile.mp4"),
], { stdio: "inherit" });

execFileSync("ffmpeg", [
  "-y",
  "-sseof", "-0.5",
  "-i", SRC,
  "-frames:v", "1",
  "-update", "1",
  path.join(PUBLIC, "hero-video-poster-mobile.webp"),
], { stdio: "inherit" });

console.log("wrote public/hero-video-mobile.mp4 and public/hero-video-poster-mobile.webp");
