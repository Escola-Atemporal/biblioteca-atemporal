"use client";

import { useMemo, useState } from "react";
import { livrosTrilha03 } from "../../data/referencias-trilha-03";
import type { LivroTrilha03 } from "../../data/referencias-trilha-03";

const categorias = [...new Set(livrosTrilha03.map((l) => l.categoria))].sort((a,b) => a.localeCompare(b,"pt-BR"));
const portugues = livrosTrilha03.filter((l) => l.idioma === "Português").length;
const normalizar = (s:string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");

function Livro({livro,numero}:{livro:LivroTrilha03,numero:number}) {
  return <article className="book-reference-card" id={livro.id}>
    <div className={"book-reference-cover tone-"+livro.cor} aria-hidden="true">
      <span className="book-cover-mark">ESCOLA ATEMPORAL / TRILHA 03</span>
      <span className="book-cover-index">{String(numero).padStart(2,"0")}</span>
      <strong>{livro.capa}</strong>
      <span className="book-cover-base">REFERÊNCIA PARA EXPLORAR ↗</span>
    </div>
    <div className="book-reference-info">
      <div className="book-reference-eyebrow"><span>{livro.tipo}</span><span>·</span><span>{livro.ano}</span><span>·</span><span>{livro.formato}</span></div>
      <h4>{livro.titulo}</h4>
      <p className="book-reference-author">{livro.autoria} <span>· {livro.origem}</span></p>
      <div className="book-reference-taxonomy"><span>{livro.categoria}</span><span>{livro.idioma}</span></div>
      <p className="book-reference-summary">{livro.resumo}</p>
      <p className="book-reference-guide"><strong>Por onde começar:</strong> {livro.comoLer}</p>
      <p className="book-reference-question"><strong>Para refletir:</strong> {livro.pergunta}</p>
      <div className="book-reference-actions">
        {livro.urlArquivo ? <a className="book-download" href={livro.urlArquivo} target="_blank" rel="noopener noreferrer" aria-label={(livro.formato === "PDF" ? "Abrir / baixar PDF: " : "Abrir EPUB: ")+livro.titulo}>{livro.formato==="PDF"?"Abrir / baixar PDF":"Abrir EPUB"} <span aria-hidden="true">↗</span></a> : <span className="book-record-only">Arquivo disponível na página da fonte</span>}
        <a className="book-source" href={livro.urlFonte} target="_blank" rel="noopener noreferrer" aria-label={"Ver fonte e direitos: "+livro.titulo}>Fonte e direitos <span aria-hidden="true">↗</span></a>
      </div>
      <p className="book-reference-rights">{livro.licenca}</p>
    </div>
  </article>;
}

export default function BibliografiaTrilha03() {
  const [busca,setBusca] = useState("");
  const [idioma,setIdioma] = useState("Todos");
  const [categoria,setCategoria] = useState("Todos");
  const resultados = useMemo(() => {
    const termo=normalizar(busca.trim());
    return livrosTrilha03.filter((l) => (
      (idioma==="Todos" || l.idioma===idioma)
      && (categoria==="Todos" || l.categoria===categoria)
      && (!termo || normalizar([l.titulo,l.autoria,l.origem,l.categoria,l.resumo].join(" ")).includes(termo))
    ));
  },[busca,idioma,categoria]);
  const pt=resultados.filter(l=>l.idioma==="Português"), en=resultados.filter(l=>l.idioma==="Inglês");
  const filtrado=Boolean(busca.trim())||idioma!=="Todos"||categoria!=="Todos";
  const limpar=()=>{setBusca("");setIdioma("Todos");setCategoria("Todos");};

  return <>
    <div className="learning-book-search" role="search" id="bibliografia-filtros" aria-label="Buscar livros e guias sobre autoconhecimento e hábitos">
      <div className="learning-book-search-head">
        <div><span>ESCOLHA SUA PRÓXIMA LEITURA</span><h3>Buscar por tema, autor ou título.</h3></div>
        <p><strong>{portugues}</strong> em português · <strong>{livrosTrilha03.length-portugues}</strong> em inglês</p>
      </div>
      <div className="learning-book-controls">
        <label className="learning-book-search-input"><span>Palavra-chave</span><input type="search" value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Ex.: hábitos, presença, foco, aprender…" /></label>
        <label><span>Idioma</span><select value={idioma} onChange={e=>setIdioma(e.target.value)}>
          <option value="Todos">Todos</option><option value="Português">Português</option><option value="Inglês">Inglês</option>
        </select></label>
        <label><span>Tema</span><select value={categoria} onChange={e=>setCategoria(e.target.value)}>
          <option value="Todos">Todos os temas</option>{categorias.map(x=><option value={x} key={x}>{x}</option>)}
        </select></label>
      </div>
      <div className="learning-book-search-footer">
        <p aria-live="polite"><strong>{resultados.length}</strong> {resultados.length===1?"referência encontrada":"referências encontradas"}</p>
        {filtrado&&<button type="button" onClick={limpar}>Limpar filtros ×</button>}
      </div>
    </div>
    {pt.length>0&&<div className="learning-book-group" id="livros-portugues">
      <div className="learning-book-group-head"><div><span className="learning-book-group-number">A / 01</span><h3>LEITURAS EM PORTUGUÊS</h3></div><p>Experiências formativas brasileiras sobre autoconhecimento, gestão do tempo, autorregulação e autocuidado.</p></div>
      <div className="learning-book-grid">{pt.map((l,i)=><Livro key={l.id} livro={l} numero={i+1}/>)}</div>
    </div>}
    {en.length>0&&<div className="learning-book-group" id="livros-ingles">
      <div className="learning-book-group-head"><div><span className="learning-book-group-number">B / 02</span><h3>FUNDAMENTOS EM INGLÊS</h3></div><p>Clássicos e livros universitários para contrastar experiências com pesquisas sobre aprendizagem e comportamento.</p></div>
      <div className="learning-book-grid">{en.map((l,i)=><Livro key={l.id} livro={l} numero={pt.length+i+1}/>)}</div>
    </div>}
    {resultados.length===0&&<div className="learning-book-empty" role="status"><strong>Nenhum material corresponde aos filtros.</strong><p>Experimente uma palavra mais ampla ou consulte o acervo completo.</p><button type="button" onClick={limpar}>Mostrar tudo ↗</button></div>}
  </>;
}
