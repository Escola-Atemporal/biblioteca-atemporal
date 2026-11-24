type StudyResource = {
  url: string;
  title: string;
  kind: string;
  host: string;
};

// Keep lesson references curated. Use the same policy for text and resource cards.
// Video sources remain disabled until the audiovisual material is approved.
const allowedHosts = new Set([
  "drive.google.com", "docs.google.com",
  "escolaatemporal.com.br", "www.escolaatemporal.com.br",
  "plato.stanford.edu", "dash.harvard.edu",
  "support.google.com", "developers.google.com", "skillshop.withgoogle.com",
  "learn.wordpress.org", "elementor.com", "www.ramper.com.br",
  "github.com", "docs.github.com", "render.com", "neon.com", "nextjs.org",
  "circulo-atemporal-api.onrender.com",
]);

const sourceNames: Record<string, string> = {
  "drive.google.com": "Material no Google Drive",
  "docs.google.com": "Documento de apoio",
  "escolaatemporal.com.br": "Escola Atemporal",
  "www.escolaatemporal.com.br": "Escola Atemporal",
  "plato.stanford.edu": "Stanford Encyclopedia of Philosophy",
  "dash.harvard.edu": "Repositório de pesquisa de Harvard",
  "support.google.com": "Central de Ajuda do Google",
  "developers.google.com": "Documentação Google Developers",
  "skillshop.withgoogle.com": "Google Skillshop",
  "learn.wordpress.org": "Learn WordPress",
  "elementor.com": "Elementor",
  "www.ramper.com.br": "Ramper",
  "github.com": "GitHub",
  "docs.github.com": "Documentação do GitHub",
  "render.com": "Render",
  "neon.com": "Neon",
  "nextjs.org": "Next.js",
  "circulo-atemporal-api.onrender.com": "Círculo Atemporal",
};

const publicPageNames: Record<string, string> = {
  "https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/principios-norteadores/": "Princípios norteadores — Escola Atemporal",
  "https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-historia/": "Nossa história — Escola Atemporal",
  "https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/desenvolvemos-lideres/": "Desenvolvemos líderes — Escola Atemporal",
  "https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/": "Nossa metodologia — Escola Atemporal",
  "https://plato.stanford.edu/entries/ethics-virtue/": "Ética das virtudes — Stanford",
  "https://dash.harvard.edu/entities/publication/13a7b031-0fdd-45ec-a7e0-2b80e2bc679f": "Segurança psicológica e aprendizagem em equipes — Amy Edmondson",
};

function trimUrlPunctuation(value: string): string {
  let result = value.replace(/[.,;:!?]+$/, "");
  // Preserve balanced parentheses inside a URL, while removing prose delimiters.
  const pairs = [["(", ")"], ["[", "]"], ["{", "}"]];
  let changed = true;
  while (changed) {
    changed = false;
    for (const [open, close] of pairs) {
      if (result.endsWith(close) &&
          result.split(close).length > result.split(open).length) {
        result = result.slice(0, -1).replace(/[.,;:!?]+$/, "");
        changed = true;
      }
    }
  }
  return result;
}

export function studyResource(raw: string): StudyResource | null {
  try {
    const url = new URL(trimUrlPunctuation(raw.trim()));
    if (url.protocol !== "https:" || url.username || url.password || url.port ||
        !allowedHosts.has(url.hostname)) return null;
    const institutional = ["drive.google.com", "docs.google.com",
      "escolaatemporal.com.br", "www.escolaatemporal.com.br",
      "circulo-atemporal-api.onrender.com"].includes(url.hostname);
    return {
      url: url.href,
      host: url.hostname,
      title: publicPageNames[url.href] ?? sourceNames[url.hostname],
      kind: url.pathname.toLowerCase().endsWith(".pdf") ? "PDF" :
        institutional ? "Fonte institucional" : "Leitura complementar",
    };
  } catch {
    return null;
  }
}

// Plain text stays plain text. React renders each accepted URL as an escaped anchor.
export function studyLinkParts(text: string): (string | StudyResource)[] {
  const parts: (string | StudyResource)[] = [];
  const matches = text.matchAll(/https:\/\/[^\s<>"'“”‘’]+/gi);
  let end = 0;
  for (const match of matches) {
    const start = match.index!;
    const clean = trimUrlPunctuation(match[0]);
    const resource = studyResource(clean);
    if (!resource) continue;
    parts.push(text.slice(end, start), resource);
    end = start + clean.length;
  }
  parts.push(text.slice(end));
  return parts;
}

export function resourcesFor(lesson: {
  source_url: string | null;
  body: string;
  practice: string;
  reflection: string;
}): StudyResource[] {
  const result: StudyResource[] = [];
  const seen = new Set<string>();
  const primary = lesson.source_url ? studyResource(lesson.source_url) : null;
  const candidates = [
    primary,
    ...studyLinkParts([lesson.body, lesson.practice, lesson.reflection].join("\n")),
  ];
  for (const resource of candidates) {
    if (!resource || typeof resource === "string" || seen.has(resource.url)) continue;
    seen.add(resource.url);
    result.push(primary?.url === resource.url
      ? { ...resource, title: "Fonte principal da aula" }
      : resource);
  }
  return result;
}
