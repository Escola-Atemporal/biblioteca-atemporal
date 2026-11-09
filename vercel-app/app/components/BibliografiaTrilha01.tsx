"use client";

import { useMemo, useState } from "react";
import { livrosTrilha01 } from "../../data/referencias-trilha-01";
import type { LivroTrilha01 } from "../../data/referencias-trilha-01";

const temas = [...new Set(livrosTrilha01.map(livro => livro.categoria))].sort((a, b) => a.localeCompare(b, "pt-BR"));
const ptCount = livrosTrilha01.filter(livro => livro.idioma === "Português").length;
const enCount = livrosTrilha01.filter(livro => livro.idioma === "Inglês").length;

function normalized(text: string) {
  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function BookCard({ livro, index }: { livro: LivroTrilha01; index: number }) {
  return (
    <article className="book-reference-card" id={livro.id}>
      <div className={"book-reference-cover tone-" + livro.tom} aria-hidden="true">
        <span className="book-cover-mark">ESCOLA ATEMPORAL / TRILHA 01</span>
        <span className="book-cover-index">{String(index + 1).padStart(2, "0")}</span>
        <strong>{livro.capa}</strong>
        <span className="book-cover-base">REFERÊNCIA DE LEITURA ↗</span>
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
          {livro.urlDownload ? <a className="book-download" href={livro.urlDownload} target="_blank" rel="noopener noreferrer" aria-label={"Abrir ou baixar " + livro.formato + ": " + livro.titulo}>{livro.formato === "EPUB" ? "Abrir EPUB" : "Abrir / baixar PDF"} <span aria-hidden="true">↗</span></a> : <span className="book-record-only">Arquivo pelo site da fonte</span>}
          <a className="book-source" href={livro.urlFonte} target="_blank" rel="noopener noreferrer">Ver fonte e licença <span aria-hidden="true">↗</span></a>
        </div>
        <p className="book-reference-rights">{livro.direitos}</p>
      </div>
    </article>
  );
}

export default function BibliografiaTrilha01() {
  const [busca, setBusca] = useState("");
  const [idioma, setIdioma] = useState("Todos");
  const [tema, setTema] = useState("Todos");

  const selecionados = useMemo(() => {
    const termo = normalized(busca.trim());
    return livrosTrilha01.filter(livro => {
      if (idioma !== "Todos" && livro.idioma !== idioma) return false;
      if (tema !== "Todos" && livro.categoria !== tema) return false;
      if (!termo) return true;
      return normalized([livro.titulo, livro.autor, livro.instituicao, livro.categoria, livro.resumo].join(" ")).includes(termo);
    });
  }, [busca, idioma, tema]);

  const emPortugues = selecionados.filter(livro => livro.idioma === "Português");
  const emIngles = selecionados.filter(livro => livro.idioma === "Inglês");
  const filtersActive = !!busca || idioma !== "Todos" || tema !== "Todos";
  function limpar() {
    setBusca(""); setIdioma("Todos"); setTema("Todos");
  }

  return (
    <>
      <div className="learning-book-search" id="bibliografia-filtros" role="search" aria-label="Buscar referências bibliográficas">
        <div className="learning-book-search-head">
          <div><span>BUSQUE NO ACERVO</span><h3>Encontre sua próxima leitura.</h3></div>
          <p><strong>{ptCount}</strong> títulos em português e <strong>{enCount}</strong> em inglês</p>
        </div>
        <div className="learning-book-controls">
          <label className="learning-book-search-input"><span>Pesquisar por título, autor ou assunto</span>
            <input type="search" value={busca} onChange={e => setBusca(e.target.value)} placeholder="Ex.: ética, prudência, responsabilidade…" />
          </label>
          <label><span>Idioma</span>
            <select value={idioma} onChange={e => setIdioma(e.target.value)}>
              <option value="Todos">Todos os idiomas</option>
              <option value="Português">Português ({ptCount})</option>
              <option value="Inglês">Inglês ({enCount})</option>
            </select>
          </label>
          <label><span>Tema</span>
            <select value={tema} onChange={e => setTema(e.target.value)}>
              <option value="Todos">Todos os temas</option>
              {temas.map(categoria => <option key={categoria} value={categoria}>{categoria}</option>)}
            </select>
          </label>
        </div>
        <div className="learning-book-search-footer">
          <p aria-live="polite"><strong>{selecionados.length}</strong> {selecionados.length === 1 ? "material encontrado" : "materiais encontrados"}</p>
          {filtersActive && <button type="button" onClick={limpar}>Limpar filtros ×</button>}
        </div>
      </div>

      {emPortugues.length > 0 && <div className="learning-book-group" id="livros-portugues">
        <div className="learning-book-group-head">
          <div><span className="learning-book-group-number">A / 01</span><h3>LEITURAS EM PORTUGUÊS</h3></div>
          <p>De fundamentos filosóficos a dilemas de liderança, cultura de integridade e ética aplicada às novas tecnologias.</p>
        </div>
        <div className="learning-book-grid">{emPortugues.map((livro, index) => <BookCard livro={livro} index={index} key={livro.id}/>)}</div>
      </div>}

      {emIngles.length > 0 && <div className="learning-book-group" id="livros-ingles">
        <div className="learning-book-group-head">
          <div><span className="learning-book-group-number">B / 02</span><h3>CLÁSSICOS E LIVROS EM INGLÊS</h3></div>
          <p>Da ética das virtudes e do estoicismo à filosofia moral contemporânea e à ética empresarial.</p>
        </div>
        <div className="learning-book-grid">{emIngles.map((livro, index) => <BookCard livro={livro} index={index + emPortugues.length} key={livro.id}/>)}</div>
      </div>}

      {selecionados.length === 0 && <div className="learning-book-empty">
        <strong>Nenhum material corresponde aos filtros.</strong>
        <p>Tente um termo mais amplo ou volte a visualizar toda a coleção.</p>
        <button type="button" onClick={limpar}>Mostrar todos os materiais ↗</button>
      </div>}
    </>
  );
}
