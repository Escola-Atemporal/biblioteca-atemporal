import Link from "next/link";
import type { Metadata } from "next";
import BrandLogo from "../../components/BrandLogo";
import CadernoParadoxos from "../../components/CadernoParadoxos";
import BibliografiaEditorial from "../../components/BibliografiaEditorial";
import {artigosTrilha05, tensoesTrilha05, movimentosTrilha05, obrasTrilha05, videosTrilha05} from "../../../data/referencias-trilha-05";

export const metadata:Metadata = {
 title:"Trilha 05 — Paradoxos da Liderança | Biblioteca Atemporal",
 description:"Investigue tensões entre autonomia e alinhamento, firmeza e cuidado, resultados e bem-estar. Leituras, vídeos e um caderno de reflexão original."
};

const perguntas=[
 "Que problema estamos tratando como uma escolha entre lados opostos?",
 "O que cada valor protege e o que arriscamos perder ao ignorá-lo?",
 "Existe algum limite ético que não podemos ultrapassar em nome do equilíbrio?",
 "Que acordo permitiria combinar direção e liberdade na prática?",
 "Que indicador humano e organizacional nos ajudará a revisitar essa escolha?",
];

export default function Trilha05Page(){
 return <main className="learning-page paradox-page referencia-trilha01" id="topo">
  <a className="skip-to-content" href="#investigacao">Ir para a investigação</a>
  <header className="topbar"><BrandLogo/><nav aria-label="Navegação principal"><Link href="/">Todas as trilhas</Link><Link href="/entrar" className="nav-login">Área de acesso ↗</Link></nav></header>
  <section className="learning-hero paradox-hero" aria-labelledby="paradox-title">
   <div className="learning-wrap">
    <div className="learning-hero-copy">
     <div className="learning-crumb"><Link href="/">Biblioteca</Link><span>/</span>Trilha 05</div>
     <span className="eyebrow">JORNADA DE INVESTIGAÇÃO · 05 / 06</span>
     <h1 id="paradox-title">Paradoxos <em>da Liderança.</em></h1>
     <p className="learning-lead">Como encontrar direção sem escolher sempre um extremo?</p>
     <p className="learning-intro">Autonomia e alinhamento. Resultado e cuidado. Mudança e identidade. Algumas tensões não são falhas a eliminar: são convites a discernir, agir e revisitar o que importa.</p>
     <div className="learning-hero-links"><a className="primary" href="#investigacao">Iniciar percurso <span aria-hidden="true">↗</span></a><a className="outline" href="#leituras">Livros e referências <span aria-hidden="true">↓</span></a></div>
    </div>
    <div className="learning-hero-picture paradox-hero-picture">
     <img src="https://escolaatemporal.com.br/wp-content/uploads/2026/10/Principios-na-lideranca-etica-confianca-e-coerencia-nas-decisoes.png" width="1200" height="800" loading="eager" decoding="async" fetchPriority="high" alt="Arte editorial oficial da Escola Atemporal para o artigo sobre princípios, ética e coerência nas decisões" />
     <a href="https://escolaatemporal.com.br/blog/principios-lideranca-preco-coerencia/" target="_blank" rel="noopener noreferrer" className="paradox-photo-source">ARTE ORIGINAL · ESCOLA ATEMPORAL ↗</a>
    </div>
    <div className="learning-facts"><span>{artigosTrilha05.length} fontes da Escola</span><span>{obrasTrilha05.length} leituras abertas</span><span>{videosTrilha05.length} palestras</span><span>05 tensões</span><span>01 caderno reflexivo</span></div>
   </div>
  </section>

  <nav className="learning-nav paradox-nav" aria-label="Seções da Trilha 05"><div className="learning-wrap">
   <a href="#investigacao">Ponto de partida</a><a href="#movimentos">Movimentos</a><a href="#tensoes">Entre os extremos</a><a href="#escola">A Escola</a><a href="#leituras">Livros e estudos</a><a href="#videos">Vídeos</a><a href="#pratica">Prática</a><a href="#mapa-de-tensoes">Meu mapa</a>
  </div></nav>

  <section id="investigacao" className="learning-section learning-wrap paradox-intro">
   <div className="learning-two-col">
    <div><span className="eyebrow dark">O PONTO DE PARTIDA</span><h2>Liderar é <em>sustentar tensões.</em></h2></div>
    <div className="reading-copy">
     <p>Quando duas necessidades são legítimas, escolher apenas uma pode resolver a urgência e criar outro problema adiante. Controlar tudo reduz a iniciativa; delegar sem contexto pode fragilizar compromissos.</p>
     <p><strong>Um paradoxo não é uma desculpa para a indecisão.</strong> É uma forma de perceber que algumas forças precisam ser consideradas em conjunto. O discernimento começa por reconhecer os valores, os limites e as consequências de cada escolha.</p>
     <p>A Escola Atemporal explora essa perspectiva em <strong>Entre os Extremos</strong>, ao convidar lideranças a integrar autonomia e alinhamento, resultados e bem-estar, inovação e identidade. Não se trata de encontrar uma fórmula única, mas de agir com princípios e ajustar a prática.</p>
     <p className="source-note">Síntese editorial original baseada em <a href="https://escolaatemporal.com.br/limiar-6a-edicao/" target="_blank" rel="noopener noreferrer">Entre os Extremos ↗</a>, <a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/" target="_blank" rel="noopener noreferrer">Nossa Metodologia ↗</a> e <a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/desenvolvemos-lideres/" target="_blank" rel="noopener noreferrer">Desenvolvemos Líderes ↗</a>.</p>
    </div>
   </div>
   <div className="learning-quote paradox-quote"><span>UMA PERGUNTA QUE MUDA O ENQUADRAMENTO</span><p>Como honrar dois valores importantes sem fingir que a tensão desapareceu?</p></div>
  </section>

  <section className="learning-section learning-muted paradox-movements" id="movimentos">
   <div className="learning-wrap">
    <div className="learning-section-header"><div><span className="eyebrow dark">QUATRO MOVIMENTOS</span><h2>Nomear. Reconhecer. <em>Experimentar. Revisitar.</em></h2></div><p>Um roteiro de investigação criado para esta Biblioteca, inspirado na reflexão da Escola e em estudos de paradoxos organizacionais. Não é teste psicológico ou método infalível.</p></div>
    <div className="learning-steps paradox-steps">{movimentosTrilha05.map(m=><article key={m.numero}><span>{m.numero} / {m.subtitulo}</span><h3>{m.titulo}</h3><p>{m.texto}</p><p className="paradox-step-question">{m.pergunta}</p></article>)}</div>
   </div>
  </section>

  <section className="learning-section learning-wrap paradox-tensions" id="tensoes">
   <div className="learning-section-header"><div><span className="eyebrow dark">CINCO TENSÕES DO COTIDIANO</span><h2>Entre os extremos <em>existe discernimento.</em></h2></div><p>Não existem lados sempre corretos. Use estas lentes para observar benefícios, excessos e perguntas que ajudem a agir com responsabilidade.</p></div>
   <div className="paradox-tension-grid">{tensoesTrilha05.map(t=><article key={t.id} className="paradox-tension-card">
    <div className="paradox-tension-top"><span>{t.numero} / TENSÃO</span><span>AMBOS IMPORTAM</span></div>
    <h3>{t.primeiro} <span aria-label="e">+</span> <em>{t.segundo}</em></h3>
    <p className="paradox-tension-context">{t.contexto}</p>
    <div className="paradox-tension-risks"><p><strong>Quando o primeiro domina:</strong> {t.excessoA}</p><p><strong>Quando o segundo domina:</strong> {t.excessoB}</p></div>
    <p className="paradox-tension-question"><span>INVESTIGUE</span>{t.pergunta}</p>
   </article>)}</div>
   <p className="paradox-section-note">Essas tensões são ilustrações educacionais, não classificações fixas. Segurança, legalidade e ética não devem ser relativizadas em nome de um equilíbrio abstrato.</p>
  </section>

  <section className="paradox-school-feature" aria-labelledby="paradox-school-feature-title">
   <div className="paradox-school-feature-image">
    <img src="https://escolaatemporal.com.br/wp-content/uploads/2026/09/ciclo-virtuoso.png" width="920" height="680" loading="lazy" decoding="async" alt="Diagrama institucional Ciclo Virtuoso, publicado pela Escola Atemporal"/>
    <a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/" target="_blank" rel="noopener noreferrer">CONHEÇA O DIAGRAMA NA ESCOLA ↗</a>
   </div>
   <div className="paradox-school-feature-copy"><span className="eyebrow">NOSSA REFERÊNCIA INSTITUCIONAL</span><h2 id="paradox-school-feature-title">O RESULTADO IMPORTA. <em>O COMO TAMBÉM.</em></h2><p>O equilíbrio entre curto e longo prazo faz parte da visão da Escola. O modo como as metas são alcançadas também cria hábitos, fortalece ou fragiliza relações e deixa marcas na cultura.</p><a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/" target="_blank" rel="noopener noreferrer">Ler Nossa Metodologia ↗</a></div>
  </section>

  <section className="learning-section learning-wrap" id="escola">
   <div className="learning-section-header"><div><span className="eyebrow dark">CONTEÚDOS OFICIAIS</span><h2>Repertório que nasce <em>na experiência.</em></h2></div><p>Artigos e páginas publicadas pela Escola Atemporal para aprofundar decisões, autonomia, coerência, mudanças e responsabilidade.</p></div>
   <div className="school-editorial-links" aria-label="Leituras em destaque da Escola Atemporal">
    {artigosTrilha05.filter(a=>a.href.includes("/blog/")).slice(0,2).map(a=><article className="school-editorial-feature" key={a.href}>
     <span>ARTIGO OU REFERÊNCIA · ESCOLA ATEMPORAL</span>
     <h3>{a.titulo}</h3>
     <p>{a.resumo}</p>
     <a href={a.href} target="_blank" rel="noopener noreferrer" aria-label={"Ler conteúdo original da Escola: "+a.titulo}>Ler no site da Escola ↗</a>
    </article>)}
   </div>
   <div className="learning-articles">{artigosTrilha05.map((a,i)=><article key={a.href} className="learning-article"><div className="learning-article-number">{String(i+1).padStart(2,"0")}</div><div><span className="learning-source-label">{a.tipo}</span><h3>{a.titulo}</h3><p>{a.resumo}</p><p className="learning-prompt"><strong>Para refletir:</strong> {a.pergunta}</p></div><a className="learning-source-link" href={a.href} target="_blank" rel="noopener noreferrer" aria-label={"Ler fonte: "+a.titulo}>Ler fonte <span aria-hidden="true">↗</span></a></article>)}</div>
  </section>

  <section className="learning-section learning-books paradox-books" id="leituras"><div className="learning-wrap">
   <div className="learning-section-header"><div><span className="eyebrow dark">BIBLIOGRAFIA · TRILHA 05</span><h2>Estudar para <em>discernir melhor.</em></h2></div><p>Livros e capítulos abertos, com autoria, contexto e acesso aos editores e repositórios originais.</p></div>
   <div className="paradox-books-intro"><div><span className="eyebrow">LER · CONTRASTAR · PRATICAR</span><h3>NENHUMA LENTE SOZINHA <em>CONTA A HISTÓRIA INTEIRA.</em></h3><p>Parta de dilemas reais, contraste perspectivas e transforme leitura em perguntas. Não há sequência obrigatória.</p></div><div className="paradox-books-count"><strong>{obrasTrilha05.length}</strong><span>OBRAS E CAPÍTULOS</span></div></div>
   <BibliografiaEditorial trilha="05" obras={obrasTrilha05.map(x=>({id:x.id,tipo:x.tipo,titulo:x.titulo,autor:x.autor,resumo:x.resumo,pergunta:x.pergunta,acesso:x.acesso,href:x.href}))}/>
   <p className="learning-disclaimer">A Biblioteca indica páginas públicas e fontes editoriais; não republica livros ou PDFs de terceiros. Acesso gratuito não significa permissão irrestrita de distribuição. Consulte a licença de cada edição antes de copiar, alterar ou compartilhar arquivos.</p>
  </div></section>

  <section className="learning-section learning-muted paradox-videos" id="videos"><div className="learning-wrap">
   <div className="learning-section-header"><div><span className="eyebrow dark">REFERÊNCIAS AUDIOVISUAIS</span><h2>Decidir com coragem. <em>Pensar com cuidado.</em></h2></div><p>Três palestras disponíveis no TED que dialogam com liderança, incerteza e escolhas difíceis. Os links abrem as páginas dos criadores.</p></div>
   <div className="paradox-video-grid">{videosTrilha05.map((v,i)=><article key={v.href} className="paradox-video-card">
    <a href={v.href} target="_blank" rel="noopener noreferrer" className="paradox-video-poster" aria-label={"Abrir palestra: "+v.titulo}>
     <span>REFERÊNCIA AUDIOVISUAL {String(i+1).padStart(2,"0")}</span><strong>IDEIAS PARA <em>CONVIVER COM O INCERTO.</em></strong><span className="paradox-video-play" aria-hidden="true">↗</span>
    </a><div className="paradox-video-body"><span>{v.autoria}</span><h3>{v.titulo}</h3><p className="paradox-video-lang">{v.idioma}</p><p>{v.resumo}</p><p className="paradox-video-reflection"><strong>Para refletir:</strong> {v.pergunta}</p><a href={v.href} target="_blank" rel="noopener noreferrer">Assistir na fonte original ↗</a></div>
   </article>)}</div>
   <p className="learning-disclaimer">As palestras não são produções da Escola Atemporal. Áudio, vídeo, legendas e direitos permanecem com os respectivos titulares.</p>
  </div></section>

  <section className="learning-section learning-wrap" id="pratica">
   <div className="learning-section-header"><div><span className="eyebrow dark">PRÁTICA PARA LIDERANÇAS E EXPERIENCIALISTAS</span><h2>Antes de decidir, <em>amplie a pergunta.</em></h2></div><p>Use as questões para abrir conversas em contextos de baixo risco, sem revelar informações pessoais ou confidenciais.</p></div>
   <ol className="learning-questions">{perguntas.map((p,i)=><li key={p}><span>{String(i+1).padStart(2,"0")}</span><p>{p}</p></li>)}</ol>
   <div className="learning-practice paradox-practice"><span className="eyebrow">UM EXPERIMENTO POSSÍVEL</span><h3>SUBSTITUA O “OU” AUTOMÁTICO POR UMA PERGUNTA MAIS AMPLA.</h3><p>Escolha uma tensão recorrente. Registre o que cada lado protege, defina os limites que precisam ser respeitados e construa um acordo pequeno e revisável. O objetivo não é conciliar tudo a qualquer custo, mas ampliar o discernimento sem abrir mão da responsabilidade.</p><a href="#mapa-de-tensoes">Abrir o Mapa de Tensões ↘</a></div>
   <CadernoParadoxos/>
  </section>

  <section className="learning-end paradox-end" aria-labelledby="paradox-end-title"><div className="learning-wrap">
   <div className="paradox-end-grid"><div><span className="eyebrow">A JORNADA CONTINUA / 05 — 06</span><h2 id="paradox-end-title">NEM TUDO É <em>OU UM, OU OUTRO.</em></h2><div className="paradox-end-rule" aria-hidden="true"/></div><div><p>Quando princípios orientam o olhar, a liderança aprende a tomar decisões sem apagar a complexidade. O próximo passo é perceber que resultados não são apenas números: também deixam legados.</p><p className="paradox-end-question">Que marca nossa próxima decisão vai deixar?</p><div className="paradox-end-links"><Link href="/" className="primary light">Explorar as trilhas ↗</Link><Link href="/trilhas/confianca-e-colaboracao" className="outline">Revisitar a Trilha 04 →</Link></div></div></div>
  </div></section>
  <footer><span>© Escola Atemporal · Biblioteca Atemporal</span><a className="learning-top-link" href="#topo">↑ Voltar ao início</a><span>Trilha 05 · Fontes e autoria identificadas</span></footer>
 </main>;
}
