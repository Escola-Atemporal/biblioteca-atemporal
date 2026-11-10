"use client";

import { useMemo, useState } from "react";
import { livrosTrilha02 } from "../../data/referencias-trilha-02";
import type { LeituraTrilha02 } from "../../data/referencias-trilha-02";

const idiomas = ["Todos", "Português", "Inglês"] as const;
const categorias = [...new Set(livrosTrilha02.map((livro) => livro.categoria))].sort((a, b) => a.localeCompare(b, "pt-BR"));

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function Livro({ livro, ordem }: { livro: LeituraTrilha02; ordem: number }) {
  return (
    <article className="book-reference-card" id={livro.id}>
      <div className={"book-reference-cover tone-" + livro.tom} aria-hidden="true">
        <span className="book-cover-mark">ESCOLA ATEMPORAL / TRILHA 02</span>
        <span className="book-cover-index">{String(ordem).padStart(2, "0")}</span>
        <strong>{livro.capa}</strong>
        <span className="book-cover-base">ACERVO DE LEITURAS ↗</span>
      </div>
      <div className="book-reference-info">
        <div className="book-reference-eyebrow">
          <span>{livro.tipo}</span><span>·</span><span>{livro.ano}</span><span>·</span><span>{livro.formato}</span>
        </div>
        <h4>{livro.titulo}</h4>
        <p className="book-reference-author">{livro.autor} <span>· {livro.instituicao}</span></p>
        <div className="book-reference-taxonomy"><span>{livro.categoria}</span><span>{livro.idioma}</span></div>
        <p className="book-reference-summary">{livro.resumo}</p>
        <p className="book-reference-guide"><strong>Por onde começar:</strong> {livro.recomendacao}</p>
        <p className="book-reference-question"><strong>Para refletir:</strong> {livro.pergunta}</p>
        <p className="book-reference-access">{livro.acesso}</p>
        <div className="book-reference-actions">
          {livro.urlDownload && <a className="book-download" href={livro.urlDownload} target="_blank" rel="noopener noreferrer" aria-label={"Abrir / baixar PDF: " + livro.titulo}>Abrir / baixar PDF <span aria-hidden="true">↗</span></a>}
          <a className="book-source" href={livro.urlFonte} target="_blank" rel="noopener noreferrer" aria-label={"Fonte e condições de uso: " + livro.titulo}>Fonte e condições de uso <span aria-hidden="true">↗</span></a>
        </div>
        <p className="book-reference-rights">{livro.direitos}</p>
      </div>
    </article>
  );
}

export default function BibliografiaTrilha02() {
  const [termo, setTermo] = useState("");
  const [idioma, setIdioma] = useState<(typeof idiomas)[number]>("Todos");
  const [categoria, setCategoria] = useState("Todos");

  const resultados = useMemo(() => {
    const busca = normalizar(termo.trim());
    return livrosTrilha02.filter((livro) => {
      if (idioma !== "Todos" && livro.idioma !== idioma) return false;
      if (categoria !== "Todos" && livro.categoria !== categoria) return false;
      if (!busca) return true;
      const texto = [livro.titulo, livro.autor, livro.instituicao, livro.categoria, livro.resumo].join(" ");
      return normalizar(texto).includes(busca);
    });
  }, [termo, idioma, categoria]);

  const portugueses = resultados.filter((livro) => livro.idioma === "Português");
  const ingleses = resultados.filter((livro) => livro.idioma === "Inglês");
  const alterado = Boolean(termo.trim()) || idioma !== "Todos" || categoria !== "Todos";
  const limpar = () => { setTermo(""); setIdioma("Todos"); setCategoria("Todos"); };

  return (
    <>
      <div className="learning-book-search" id="bibliografia-filtros" role="search" aria-label="Buscar livros e e-books da Trilha 02">
        <div className="learning-book-search-head">
          <div><span>ACERVO PARA INVESTIGAR</span><h3>Encontre uma leitura para o seu momento.</h3></div>
          <p><strong>{livrosTrilha02.filter((l) => l.idioma === "Português").length}</strong> títulos em português · <strong>{livrosTrilha02.filter((l) => l.idioma === "Inglês").length}</strong> em inglês</p>
        </div>
        <div className="learning-book-controls">
          <label className="learning-book-search-input">
            <span>Buscar por título, autor ou tema</span>
            <input type="search" value={termo} onChange={(event) => setTermo(event.target.value)} placeholder="Ex.: emoções, relações, presença…" />
          </label>
          <label>
            <span>Idioma</span>
            <select value={idioma} onChange={(event) => setIdioma(event.target.value as (typeof idiomas)[number])}>
              <option value="Todos">Todos os idiomas</option>
              <option value="Português">Português</option>
              <option value="Inglês">Inglês</option>
            </select>
          </label>
          <label>
            <span>Tema</span>
            <select value={categoria} onChange={(event) => setCategoria(event.target.value)}>
              <option value="Todos">Todos os temas</option>
              {categorias.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </label>
        </div>
        <div className="learning-book-search-footer">
          <p aria-live="polite"><strong>{resultados.length}</strong> {resultados.length === 1 ? "material encontrado" : "materiais encontrados"}</p>
          {alterado && <button type="button" onClick={limpar}>Limpar filtros ×</button>}
        </div>
      </div>

      {portugueses.length > 0 && (
        <div className="learning-book-group" id="livros-portugues">
          <div className="learning-book-group-head">
            <div><span className="learning-book-group-number">A / 01</span><h3>LEITURAS EM PORTUGUÊS</h3></div>
            <p>Reconhecimento emocional, convivência, educação socioemocional e exercícios para o cotidiano.</p>
          </div>
          <div className="learning-book-grid">{portugueses.map((livro, i) => <Livro key={livro.id} livro={livro} ordem={i + 1} />)}</div>
        </div>
      )}
      {ingleses.length > 0 && (
        <div className="learning-book-group" id="livros-ingles">
          <div className="learning-book-group-head">
            <div><span className="learning-book-group-number">B / 02</span><h3>REFERÊNCIAS EM INGLÊS</h3></div>
            <p>Psicologia e comportamento organizacional para compreender emoções, contextos e decisões.</p>
          </div>
          <div className="learning-book-grid">{ingleses.map((livro, i) => <Livro key={livro.id} livro={livro} ordem={portugueses.length + i + 1} />)}</div>
        </div>
      )}
      {resultados.length === 0 && (
        <div className="learning-book-empty" role="status">
          <strong>Nenhuma leitura encontrada.</strong>
          <p>Experimente outra palavra ou retire os filtros para voltar ao acervo completo.</p>
          <button type="button" onClick={limpar}>Mostrar todos os materiais ↗</button>
        </div>
      )}
    </>
  );
}
