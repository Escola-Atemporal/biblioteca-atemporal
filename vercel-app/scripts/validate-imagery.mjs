/**
 * Biblioteca Atemporal — checagem de proveniencia visual.
 *
 * Executada em prebuild pela CI e pelo Render. Apenas imagens oficiais
 * catalogadas em data/origens-visuais.json podem compor as paginas.
 * As miniaturas reais de videos do YouTube sao uma excecao explicita,
 * somente quando seu video esta citado no codigo.
 *
 * Este verificador nao faz scraping nem coleta fotos.
 * A curadoria humana deve verificar a fonte antes de aprovar novos arquivos.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const manifest = JSON.parse(readFileSync(join(root, "data", "origens-visuais.json"), "utf8"));
const approved = new Set(manifest.imagens.map((item) => item.url));
const files = [];

function scan(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      scan(full);
    } else if (/\.(?:tsx?|jsx?|css)$/.test(entry.name)) {
      files.push(full);
    }
  }
}

scan(join(root, "app"));
scan(join(root, "data"));

const documents = files.map((file) => ({
  path: relative(root, file),
  text: readFileSync(file, "utf8"),
}));
const allText = documents.map(({ text }) => text).join("\n");
const youtubeIds = new Set(
  [...allText.matchAll(/https?:\/\/(?:www\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/g)]
    .map((match) => match[1])
);
const violations = [];
let approvedCount = 0;
let previews = 0;

for (const document of documents) {
  const urls = [...document.text.matchAll(/https?:\/\/[^\s"'()<>\}\],;]+/g)].map((match) => match[0]);
  for (const raw of urls) {
    const url = raw.replace(/[.,;]+$/, "");
    if (!/\.(?:png|jpe?g|webp|gif|svg|avif)(?:[?#]|$)/i.test(url)) continue;
    if (approved.has(url)) {
      approvedCount += 1;
      continue;
    }

    const preview = url.match(/^https:\/\/img\.youtube\.com\/vi\/([A-Za-z0-9_-]{11})\/(?:hqdefault|mqdefault|sddefault|maxresdefault)\.jpg$/);
    if (preview && youtubeIds.has(preview[1])) {
      previews += 1;
      continue;
    }

    violations.push(document.path + ": imagem não cadastrada: " + url);
  }

  // Imagens relativas também precisam de origem conhecida. Adicionar foto
  // local sem documentação não pode contornar a política de proveniência.
  const relativeImages = [...document.text.matchAll(/\b(?:src|poster)\s*=\s*["'](\/[^"']+\.(?:png|jpe?g|webp|gif|svg|avif))(?:\?[^"']*)?["']/gi)];
  for (const match of relativeImages) {
    violations.push(document.path + ": arquivo de imagem local sem fonte oficial: " + match[1]);
  }
}

if (violations.length) {
  console.error("Política de imagens da Escola Atemporal: foram encontradas fontes não aprovadas.\n");
  for (const v of violations) console.error(" - " + v);
  console.error("\nConsultar data/origens-visuais.json e verificar a imagem diretamente no site da Escola.");
  process.exitCode = 1;
} else {
  console.log("✓ Proveniência visual aprovada: " + approvedCount + " referências institucionais, " + previews + " miniaturas de vídeos citados.");
  console.log("✓ Nenhuma fotografia não cadastrada foi detectada nos arquivos TSX/TS/CSS.");
}
