"use client";

import { useState } from "react";
import type { FileEntry, DriveCatalog } from "../../lib/drive-catalog";

const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const volumeTitles = ["Princípios e Discernimento", "Emoções e Autoconsciência", "Autoconhecimento e Hábitos", "Confiança e Colaboração", "Paradoxos da Liderança", "Resultados e Legado", "Escuta que Abre Caminhos", "Inteligência Coletiva e Cultura Viva", "Presença e Discernimento na Mudança"];
function format(file: FileEntry) {
  if (file.mimeType === "application/pdf") return "PDF";
  if (file.mimeType === "application/vnd.google-apps.document") return "GOOGLE DOCS";
  return "WORD";
}
function downloadUrl(file: FileEntry) {
  return file.mimeType === "application/vnd.google-apps.document"
    ? `https://docs.google.com/document/d/${file.id}/export?format=pdf`
    : `https://drive.google.com/uc?export=download&id=${file.id}`;
}
function displayName(file: FileEntry) {
  const volume = file.name.match(/^Escola_Atemporal_Vol(\d+)_/);
  if (volume && volumeTitles[Number(volume[1]) - 1]) return `Volume ${volume[1]} · ${volumeTitles[Number(volume[1]) - 1]}`;
  return file.name.replace(/^Escola_Atemporal_Vol(\d+)_/, "Volume $1 · ")
    .replace(/^Biblioteca_Atemporal_(\d+)_/, "$1 · ")
    .replace(/_MINUTA_v\d+\.pdf$/i, "").replace(/\.docx$/i, "").replaceAll("_", " ");
}

export default function ArquivosCatalogo({ index }: { index: DriveCatalog }) {
  const [folder, setFolder] = useState("all");
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const files = index.files.filter(file =>
    (folder === "all" || file.parent === folder)
    && (type === "all" || format(file) === type)
    && normalize(`${file.name} ${displayName(file)}`).includes(normalize(query.trim()))
  ).sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { numeric: true }));
  const current = index.folders.find(item => item.id === folder);
  const folderUrl = current?.url || index.folderUrl;

  return (
    <section aria-labelledby="arquivos-title">
      <div className="arquivos-heading">
        <div><span className="dashboard-atm-eyebrow dark">ACERVO DA ESCOLA</span><h2 id="arquivos-title">Arquivos da <em>Biblioteca.</em></h2></div>
        <a className="arquivos-drive" href={folderUrl} target="_blank" rel="noopener noreferrer">Abrir pasta no Drive ↗</a>
      </div>
      <p className="arquivos-intro">Consulte os materiais na fonte original ou baixe uma cópia para estudar. O Google Drive pode solicitar sua conta e a permissão de acesso.</p>
      <div className="arquivos-notice" role="note"><strong>Acervo interno em revisão.</strong><p>Os nove e-books são minutas editoriais. A consulta a esta seção é reservada à administração e à curadoria; os arquivos mantêm as permissões da Escola.</p></div>
      <form className="arquivos-filters" onSubmit={event => event.preventDefault()} role="search" aria-label="Buscar arquivos">
        <div><label htmlFor="arquivo-search">O que você quer encontrar?</label><input id="arquivo-search" type="search" placeholder="Buscar por título ou tema…" value={query} onChange={event => setQuery(event.target.value)} /></div>
        <div><label htmlFor="arquivo-folder">Pasta</label><select id="arquivo-folder" value={folder} onChange={event => setFolder(event.target.value)}><option value="all">Todas as pastas</option><option value="root">E-books e documentos gerais</option>{index.folders.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select></div>
        <div><label htmlFor="arquivo-type">Formato</label><select id="arquivo-type" value={type} onChange={event => setType(event.target.value)}><option value="all">Todos os formatos</option><option value="PDF">PDF</option><option value="GOOGLE DOCS">Google Docs</option><option value="WORD">Word</option></select></div>
      </form>
      <div className="arquivos-results"><p role="status" aria-live="polite">{files.length} {files.length === 1 ? "arquivo encontrado" : "arquivos encontrados"}{current ? ` · ${current.name}` : ""}</p><span>Catálogo conferido em {index.updatedAt.split("-").reverse().join("/")}</span></div>
      {files.length ? <ul className="arquivos-list">{files.map(file => <li key={file.id}>
        <article className="arquivo-row">
          <span className={`arquivo-format${format(file) === "PDF" ? " is-pdf" : ""}`}>{format(file) === "GOOGLE DOCS" ? "DOC" : format(file)}</span>
          <div className="arquivo-copy"><span className="arquivo-category">{index.folders.find(item => item.id === file.parent)?.name || (format(file) === "PDF" ? "Coleção autoral · Minuta" : "Documentos da Biblioteca")}</span><h3>{displayName(file)}</h3><p>{file.name}</p></div>
          <div className="arquivo-actions"><a href={file.url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir ${displayName(file)} no Drive`}>Abrir ↗</a><a href={downloadUrl(file)} target="_blank" rel="noopener noreferrer" aria-label={`Baixar ${displayName(file)}${format(file) === "GOOGLE DOCS" ? " em PDF" : ""}`}>{format(file) === "GOOGLE DOCS" ? "Baixar PDF ↓" : "Baixar ↓"}</a></div>
        </article>
      </li>)}</ul> : <div className="arquivos-empty"><h3>Nenhum arquivo encontrado.</h3><p>Experimente outro termo ou remova os filtros.</p><button type="button" onClick={() => { setQuery(""); setFolder("all"); setType("all"); }}>Limpar busca e filtros</button></div>}
      <div className="arquivos-source"><strong>O acervo continua em movimento.</strong><p>Esta lista registra os materiais conferidos em {index.updatedAt.split("-").reverse().join("/")}. Para consultar novos arquivos e alterações na pasta original, abra o Drive.</p><a href={folderUrl} target="_blank" rel="noopener noreferrer">Consultar pasta atualizada ↗</a></div>
    </section>
  );
}
