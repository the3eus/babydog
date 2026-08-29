const { execFileSync } = require("child_process");
const path = require("path");

const SRC_DIR = path.resolve(__dirname, "..", "..", "imagens clinica babydog");
const PUBLIC = path.resolve(__dirname, "..", "public");

// Vídeo vertical (720x1280/9:16) enviado pela clínica especificamente para
// o fundo da Hero no mobile — ao contrário do vídeo widescreen original,
// já nasce no formato certo pra seção retrato do celular, então não
// precisa de corte nenhum.
//
// Recodifica (não é um remux) por dois motivos: o arquivo bruto vem com o
// `moov atom` (índice de amostras) no FIM do arquivo — o navegador não
// consegue tocar nem um frame sem baixar o arquivo quase inteiro primeiro,
// travando o autoplay no mobile. `-movflags +faststart` move o índice pro
// início. De quebra, `-crf 20 -preset slow` também encolhe bastante o
// arquivo (o bruto vem em ~1,56Mbps, bem acima do necessário pra uma
// animação de logo).
const SRC = path.join(SRC_DIR, "video para cell - hero web mobile.mp4");

execFileSync("ffmpeg", [
  "-y",
  "-i", SRC,
  "-an",
  "-c:v", "libx264",
  "-crf", "20",
  "-preset", "slow",
  "-movflags", "+faststart",
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
