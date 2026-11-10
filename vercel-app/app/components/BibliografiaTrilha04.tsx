"use client";

import {useMemo,useState} from "react";
import {livrosTrilha04} from "../../data/referencias-trilha-04";

type Livro = (typeof livrosTrilha04)[number];
const categorias = [...new Set(livrosTrilha04.map(l=>l.categoria))].sort((a,b)=>a.localeCompare(b,"pt-BR"));
const normalizar=(s:string)=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleLowerCase("pt-BR");

function Ficha({livro,numero}:{livro:Livro;numero:number}){
 return <article className="book-reference-card colab-book-reference" id={livro.id}>
   <div className={"book-reference-cover tone-"+livro.cor} aria-hidden="true">
     <span className="book-cover-mark">ESCOLA ATEMPORAL / TRILHA 04</span>
     <span className="book-cover-index">{String(numero).padStart(2,"0")}</span>
     <strong>{livro.capa}</strong>
     <span className="book-cover-base">REFERÊNCIA PARA EXPLORAR ↗</span>
   </div>
   <div className="book-reference-info">
     <div className="book-reference-eyebrow"><span>{livro.tipo}</span><span>·</span><span>{livro.ano}</span><span>·</span><span>{livro.formato}</span></div>
     <h4>{livro.titulo}</h4>
     <p className="book-reference-author">{livro.autor} <span>· {livro.origem}</span></p>
     <div className="book-reference-taxonomy"><span>{livro.categoria}</span><span>{livro.idioma}</span></div>
     <p className="book-reference-summary">{livro.resumo}</p>
     <p className="book-reference-guide"><strong>Por onde começar:</strong> {livro.comoLer}</p>
     <p className="book-reference-question"><strong>Para refletir:</strong> {livro.pergunta}</p>
     <div className="book-reference-actions">
       {livro.urlArquivo
         ? <a className="book-download" href={livro.urlArquivo} target="_blank" rel="noopener noreferrer" aria-label={"Abrir PDF oficial de "+livro.titulo}>Abrir / baixar PDF <span aria-hidden="true">↗</span></a>
         : <a className="book-download" href={livro.urlFonte} target="_blank" rel="noopener noreferrer" aria-label={"Ler na fonte original: "+livro.titulo}>Ler na fonte <span aria-hidden="true">↗</span></a>}
       <a className="book-source" href={livro.urlFonte} target="_blank" rel="noopener noreferrer" aria-label={"Ver fonte e direitos de "+livro.titulo}>Fonte e direitos <span aria-hidden="true">↗</span></a>
     </div>
     <p className="book-reference-rights">{livro.licenca}</p>
   </div>
 </article>;
}

export default function BibliografiaTrilha04(){
 const [busca,setBusca]=useState("");
 const [idioma,setIdioma]=useState("Todos");
 const [tipo,setTipo]=useState("Todos");
 const resultados=useMemo(()=>{
  const termo=normalizar(busca.trim());
  return livrosTrilha04.filter(l=>{
   const ehPdf=Boolean(l.urlArquivo);
   return (idioma==="Todos"||l.idioma===idioma)
    && (tipo==="Todos"||(tipo==="PDF"&&ehPdf)||(tipo==="Online"&&!ehPdf))
    && (!termo||normalizar([l.titulo,l.autor,l.categoria,l.resumo,l.comoLer].join(" ")).includes(termo));
  });
 },[busca,idioma,tipo]);
 const reset=()=>{setBusca("");setIdioma("Todos");setTipo("Todos");};
 const filtrado=busca.trim()!==""||idioma!=="Todos"||tipo!=="Todos";
 const qtdPdf=livrosTrilha04.filter(l=>Boolean(l.urlArquivo)).length;
 return <div className="colab-bibliografia">
   <div className="learning-book-search" role="search" aria-label="Buscar livros e PDFs sobre confiança e colaboração">
     <div className="learning-book-search-head">
       <div><span>ESCOLHA SUA PRÓXIMA LEITURA</span><h3>Livros, guias e PDFs para explorar.</h3></div>
       <p><strong>{livrosTrilha04.length}</strong> referências · <strong>{qtdPdf}</strong> PDFs oficiais</p>
     </div>
     <div className="learning-book-controls">
       <label className="learning-book-search-input"><span>Palavra-chave</span><input type="search" value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Ex.: escuta, equipes, conflito..."/></label>
       <label><span>Idioma</span><select value={idioma} onChange={e=>setIdioma(e.target.value)}><option value="Todos">Todos</option><option value="Português">Português</option><option value="Inglês">Inglês</option></select></label>
       <label><span>Formato</span><select value={tipo} onChange={e=>setTipo(e.target.value)}><option value="Todos">Todos</option><option value="PDF">PDF para abrir</option><option value="Online">Leitura na fonte</option></select></label>
     </div>
     <div className="learning-book-search-footer"><p aria-live="polite"><strong>{resultados.length}</strong> {resultados.length===1?"referência encontrada":"referências encontradas"}</p>{filtrado&&<button type="button" onClick={reset}>Limpar filtros ×</button>}</div>
   </div>
   {resultados.length>0?<div className="learning-book-group" id="livros-referencias">
     <div className="learning-book-group-head"><div><span className="learning-book-group-number">04 / LEITURAS</span><h3>LIVROS, E-BOOKS E CAPÍTULOS</h3></div><p>Os botões de PDF abrem arquivos oficiais; os demais materiais abrem as páginas de leitura dos editores.</p></div>
     <div className="learning-book-grid">
       {resultados.map(l=><Ficha livro={l} numero={livrosTrilha04.indexOf(l)+1} key={l.id}/>)}
     </div>
   </div>:<div className="learning-book-empty" role="status"><strong>Nenhum resultado encontrado.</strong><p>Experimente outro termo ou consulte o acervo completo.</p><button type="button" onClick={reset}>Mostrar todas as referências ↗</button></div>}
 </div>;
}
