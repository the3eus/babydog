/**
 * Gera versoes de arquivo unico do CRM, sem dependencia externa.
 *   node build.js
 * Saidas em dist/:
 *   crm-consorcio.html — documento completo, abre direto no celular (file:// ou hospedado)
 *   artefato.html      — so o conteudo do body, para publicar como Artifact do Claude
 */
const fs = require("fs");
const path = require("path");

const raiz = __dirname;
const ler = (p) => fs.readFileSync(path.join(raiz, p), "utf8");

const css = ler("css/estilo.css");
const js = ["js/dados.js", "js/dashboard.js", "js/app.js"].map(ler).join("\n\n");

let html = ler("index.html");
html = html
  .replace('<link rel="stylesheet" href="css/estilo.css" />', `<style>\n${css}\n</style>`)
  .replace(/\s*<script src="js\/(dados|dashboard)\.js"><\/script>/g, "")
  .replace('<script src="js/app.js"></script>', `<script>\n${js}\n</script>`);

const saida = path.join(raiz, "dist");
fs.mkdirSync(saida, { recursive: true });
fs.writeFileSync(path.join(saida, "crm-consorcio.html"), html);

// Versao para Artifact: sem doctype/html/head/body, com <title> e <style> no topo.
const corpo = html.slice(html.indexOf("<body>") + 6, html.lastIndexOf("</body>")).trim();
const titulo = (html.match(/<title>([^<]*)<\/title>/) || [, "CRM"])[1];
const artefato = `<title>${titulo}</title>\n<style>\n${css}\n</style>\n${corpo}`;
fs.writeFileSync(path.join(saida, "artefato.html"), artefato);

console.log("dist/crm-consorcio.html e dist/artefato.html gerados.");
