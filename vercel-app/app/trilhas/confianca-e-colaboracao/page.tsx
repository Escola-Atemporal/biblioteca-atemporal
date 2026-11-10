import Link from "next/link";
import type { Metadata } from "next";
import BrandLogo from "../../components/BrandLogo";
import CadernoConfianca from "../../components/CadernoConfianca";
import {artigosTrilha04, livrosTrilha04, videosTrilha04, movimentosTrilha04} from "../../../data/referencias-trilha-04";

export const metadata:Metadata={
  title:"Trilha 04 — Confiança e Colaboração | Biblioteca Atemporal",
  description:"Uma jornada de escuta, pertencimento e inteligência coletiva com conteúdos da Escola, referências de acesso aberto, vídeos e caderno reflexivo."
};

const perguntas=[
  "Quando uma pessoa discorda de mim, o que faço que convida ou interrompe a conversa?",
  "Que tipo de contribuição é reconhecida na nossa equipe e o que fica invisível?",
  "Há perguntas que as pessoas evitam fazer por receio de parecerem despreparadas?",
  "Nossos combinados são realmente compartilhados ou conhecidos por poucos?",
  "Qual gesto pode reparar uma expectativa rompida sem procurar culpados?",
];
const lentes=[
  {numero:"01",titulo:"Confiança",pergunta:"Há coerência entre o que prometemos e praticamos?",texto:"Confiança se fortalece quando expectativas ficam claras, compromissos são cumpridos e rupturas podem ser reconhecidas e reparadas."},
  {numero:"02",titulo:"Escuta",pergunta:"Todas as vozes têm espaço real na conversa?",texto:"Escutar envolve curiosidade, atenção e disposição para rever a própria compreensão, sem exigir concordância imediata."},
  {numero:"03",titulo:"Colaboração",pergunta:"O que só conseguimos construir juntos?",texto:"Colaboração não é apenas dividir tarefas: é construir sentido, combinar responsabilidades, lidar com diferenças e aprender no percurso."},
];
export default function Trilha04Page(){
 return <main className="learning-page colab-page" id="topo">
  <a className="skip-to-content" href="#investigacao">Ir para a investigação</a>
  <header className="topbar"><BrandLogo/><nav aria-label="Navegação principal"><Link href="/">Todas as trilhas</Link><Link href="/entrar" className="nav-login">Área de acesso ↗</Link></nav></header>
  <section className="learning-hero colab-hero" aria-labelledby="titulo-trilha-04"><div className="learning-wrap">
   <div className="learning-hero-copy">
    <div className="learning-crumb"><Link href="/">Biblioteca</Link><span>/</span>Trilha 04</div>
    <span className="eyebrow">JORNADA DE INVESTIGAÇÃO · 04 / 06</span>
    <h1 id="titulo-trilha-04">Confiança <em>e Colaboração.</em></h1>
    <p className="learning-lead">O que nos permite construir com outras pessoas?</p>
    <p className="learning-intro">A sabedoria é coletiva quando diferentes pessoas podem participar de verdade. Uma jornada para praticar a escuta, reconhecer a diversidade de perspectivas e transformar encontros em compromissos compartilhados.</p>
    <div className="learning-hero-links"><a className="primary" href="#investigacao">Começar a investigação <span aria-hidden="true">↗</span></a><a className="outline" href="#livros">Explorar livros e e-books ↓</a></div>
   </div>
   <div className="learning-hero-picture colab-hero-picture">
    <img src="https://escolaatemporal.com.br/wp-content/uploads/2026/08/DSC9619-1024x681.jpg" width="1024" height="681" alt="Fotografia institucional publicada pela Escola Atemporal na página Emoções em Jogo" loading="eager" fetchPriority="high" decoding="async"/>
    <span className="learning-hero-picture-label">A SABEDORIA É COLETIVA.</span>
   </div>
   <div className="learning-facts"><span>{artigosTrilha04.length} fontes da Escola</span><span>{livrosTrilha04.length} livros e guias</span><span>{videosTrilha04.length} vídeos</span><span>04 movimentos</span><span>01 caderno de reflexão</span></div>
  </div></section>
  <nav className="learning-nav colab-nav" aria-label="Seções da Trilha 04"><div className="learning-wrap"><a href="#investigacao">Ponto de partida</a><a href="#movimentos">Movimentos</a><a href="#lentes">Três lentes</a><a href="#escola">A Escola</a><a href="#livros">Livros</a><a href="#videos">Vídeos</a><a href="#pratica">Prática</a><a href="#caderno-confianca">Caderno</a></div></nav>
  <section id="investigacao" className="learning-section learning-wrap">
   <div className="learning-two-col"><div><span className="eyebrow dark">O PONTO DE PARTIDA</span><h2>Ninguém constrói <em>sozinho.</em></h2></div><div className="reading-copy">
    <p>Colaborar não significa estar sempre de acordo. Uma relação de confiança pode acolher diferenças, dúvidas e decisões difíceis sem reduzir as pessoas a seus erros ou opiniões.</p>
    <p><strong>Escuta e confiança se tornam práticas</strong> quando uma equipe cria condições para formular perguntas, nomear tensões, respeitar acordos e reconhecer contribuições que normalmente passam despercebidas.</p>
    <p>Na filosofia da Escola Atemporal, a ideia de que <strong>a sabedoria é coletiva</strong> convida a deslocar o foco do desempenho isolado para a qualidade do encontro e dos resultados construídos em conjunto.</p>
    <p className="source-note">Síntese editorial original inspirada em <a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/principios-norteadores/" target="_blank" rel="noopener noreferrer">Princípios Norteadores ↗</a>, <a href="https://escolaatemporal.com.br/blog/forca-invisivel-dos-times/" target="_blank" rel="noopener noreferrer">A força invisível dos times ↗</a> e <a href="https://escolaatemporal.com.br/blog/liderar-sem-escutar-escuta-ativa-empatia/" target="_blank" rel="noopener noreferrer">Liderar sem escutar ↗</a>.</p>
   </div></div>
   <div className="learning-quote colab-quote"><span>UMA PERGUNTA PARA LEVAR ADIANTE</span><p>O que muda numa equipe quando cada pessoa tem condições reais de contribuir?</p></div>
  </section>
  <section id="movimentos" className="learning-section learning-muted"><div className="learning-wrap">
   <div className="learning-section-header"><div><span className="eyebrow dark">QUATRO MOVIMENTOS</span><h2>Reconhecer. Escutar. <em>Construir. Cuidar.</em></h2></div><p>Um roteiro de investigação editorial para conversas em equipe. Não é um teste de clima ou uma ferramenta diagnóstica.</p></div>
   <div className="learning-steps colab-steps">{movimentosTrilha04.map(m=><article key={m.numero}><span>{m.numero} / {m.subtitulo}</span><h3>{m.titulo}</h3><p>{m.texto}</p><p className="colab-step-question">{m.pergunta}</p></article>)}</div>
  </div></section>
  <section id="lentes" className="learning-section learning-wrap"><div className="learning-section-header"><div><span className="eyebrow dark">TRÊS LENTES COMPLEMENTARES</span><h2>A qualidade dos vínculos <em>muda a qualidade do trabalho.</em></h2></div><p>Confiança, escuta e colaboração se alimentam mutuamente, mas cada dimensão pede uma atenção própria.</p></div>
   <div className="colab-lenses">{lentes.map(l=><article key={l.numero}><span>{l.numero} / LENTE</span><h3>{l.titulo}</h3><p>{l.texto}</p><strong>{l.pergunta}</strong></article>)}</div>
  </section>
  <section id="escola" className="learning-section learning-wrap"><div className="learning-section-header"><div><span className="eyebrow dark">FONTES DA ESCOLA ATEMPORAL</span><h2>Colaboração começa <em>no encontro.</em></h2></div><p>Textos e páginas oficiais conectados a confiança, escuta, liderança e pertencimento. Abra cada fonte no site da Escola.</p></div>
   <div className="learning-articles">{artigosTrilha04.map((a,i)=><article className="learning-article" key={a.href}><div className="learning-article-number">{String(i+1).padStart(2,"0")}</div><div><span className="learning-source-label">{a.tipo}</span><h3>{a.titulo}</h3><p>{a.resumo}</p><p className="learning-prompt"><strong>Para refletir:</strong> {a.pergunta}</p></div><a className="learning-source-link" href={a.href} target="_blank" rel="noopener noreferrer">Ler fonte ↗</a></article>)}</div>
  </section>
  <section id="livros" className="learning-section learning-books colab-books"><div className="learning-wrap">
   <div className="learning-section-header"><div><span className="eyebrow dark">BIBLIOGRAFIA · TRILHA 04</span><h2>Leituras para <em>construir juntos.</em></h2></div><p>Uma curadoria de obras e guias de acesso aberto. Os downloads, quando disponíveis, são oferecidos nas páginas originais dos editores ou autores.</p></div>
   <div className="learning-books-intro colab-books-intro"><div><span className="learning-books-preamble">LER · CONVERSAR · EXPERIMENTAR</span><h3>Confiança não se decreta. <em>Se cultiva.</em></h3><p>Experimente começar pela comunicação em pequenos grupos, seguir para escuta e concluir com práticas de equipes.</p></div><div className="learning-books-count"><strong>{livrosTrilha04.length}</strong><span>OBRAS<br/>E GUIAS</span></div></div>
   <div className="colab-reading-route"><article><span>01 / ESCUTAR</span><h3>Comunicação em prática</h3><p>Explore princípios de escuta, entendimento e conversas difíceis.</p><a href="#small-group">Ver referência ↘</a></article><article><span>02 / CONSTRUIR</span><h3>Pequenos grupos</h3><p>Observe papéis, participação e tomada de decisão.</p><a href="#communication-practice">Ver referência ↘</a></article><article><span>03 / SUSTENTAR</span><h3>Equipes e cultura</h3><p>Conecte a conversa aos compromissos e aos resultados.</p><a href="#behavior">Ver referência ↘</a></article></div>
   <div className="colab-book-list">{livrosTrilha04.map((l,i)=><article id={l.id} className="colab-book" key={l.id}><span className="colab-book-num">{String(i+1).padStart(2,"0")}</span><div className="colab-book-copy"><span className="learning-source-label">{l.formato}</span><h3>{l.titulo}</h3><p className="colab-book-author">{l.autor}</p><p>{l.tema}</p><p className="learning-prompt"><strong>Investigue:</strong> {l.pergunta}</p><small>{l.licenca}</small></div><a href={l.href} target="_blank" rel="noopener noreferrer">Abrir fonte original ↗</a></article>)}</div>
   <p className="learning-disclaimer">Links para fontes externas; não há cópias de livros de terceiros hospedadas na Biblioteca. Acesso aberto não significa uso irrestrito: consulte os termos de cada edição antes de compartilhar, adaptar ou redistribuir arquivos.</p>
  </div></section>
  <section id="videos" className="learning-section learning-muted"><div className="learning-wrap">
   <div className="learning-section-header"><div><span className="eyebrow dark">REFERÊNCIAS AUDIOVISUAIS</span><h2>Escutar melhor. <em>Discordar melhor.</em></h2></div><p>Três conversas para observar participação, segurança para aprender e valor da discordância construtiva.</p></div>
   <div className="learning-videos colab-videos">{videosTrilha04.map(v=><article className="learning-video" key={v.href}><a href={v.href} className="colab-video-cover" target="_blank" rel="noopener noreferrer" aria-label={"Assistir na fonte original: "+v.titulo}><div className="learning-video-icon">{v.imagem?<img src={v.imagem} alt="" width="480" height="360" loading="lazy" decoding="async"/>:<span className="colab-video-title">TED <small>ABRIR PALESTRA ↗</small></span>}<span className="colab-video-play" aria-hidden="true">▶</span></div></a><div className="learning-video-body"><span>{v.autoria}</span><h3>{v.titulo}</h3><p className="learning-video-theme">{v.idioma}</p><p>{v.resumo}</p><p className="learning-prompt"><strong>Para refletir:</strong> {v.pergunta}</p><a href={v.href} target="_blank" rel="noopener noreferrer">Assistir na fonte original ↗</a></div></article>)}</div>
   <p className="learning-disclaimer">Vídeos, imagens e legendas pertencem aos criadores e canais originais. Não há republicação dos conteúdos audiovisuais nesta página.</p>
  </div></section>
  <section id="pratica" className="learning-section learning-wrap"><div className="learning-section-header"><div><span className="eyebrow dark">PRÁTICA PARA O COTIDIANO</span><h2>Uma boa conversa <em>pode mudar o grupo.</em></h2></div><p>Escolha uma situação de trabalho de baixo risco e teste uma pergunta ou um acordo claro antes de propor uma solução.</p></div>
   <ol className="learning-questions">{perguntas.map((p,i)=><li key={p}><span>{String(i+1).padStart(2,"0")}</span><p>{p}</p></li>)}</ol>
   <div className="learning-practice colab-practice"><div><span className="eyebrow">EXPERIMENTO REFLEXIVO</span><h3>UMA PERGUNTA ANTES DE UMA RESPOSTA.</h3><p>Em uma próxima conversa, experimente perguntar o que ainda não foi considerado, retomar o que você ouviu e confirmar se compreendeu. Depois, combine um gesto observável e uma forma simples de acompanhar o acordo. Não force exposições pessoais; participação também exige consentimento.</p><a href="#caderno-confianca" className="colab-practice-link">Abrir o caderno reflexivo ↘</a></div></div>
   <CadernoConfianca/>
  </section>
  <section className="learning-end colab-end" aria-labelledby="colab-end-title">
   <div className="learning-wrap">
    <div className="colab-end-grid">
     <div className="colab-end-heading">
      <span className="eyebrow">A JORNADA CONTINUA <span aria-hidden="true">/</span> 04 — 06</span>
      <h2 id="colab-end-title">A SABEDORIA <em>É COLETIVA.</em></h2>
      <span className="colab-end-rule" aria-hidden="true" />
     </div>
     <div className="colab-end-content">
      <p>Quando escutamos com curiosidade e assumimos compromissos compartilhados, criamos condições para que boas ideias não precisem nascer de uma só pessoa.</p>
      <p className="colab-end-question">O que podemos construir juntos a partir daqui?</p>
      <div className="colab-end-actions">
       <Link className="primary light" href="/">Explorar as seis trilhas <span aria-hidden="true">↗</span></Link>
       <Link className="outline" href="/trilhas/autoconhecimento-e-habitos">Revisitar a Trilha 03 <span aria-hidden="true">→</span></Link>
      </div>
     </div>
    </div>
    <div className="colab-end-foot"><span>ESCOLA ATEMPORAL <span aria-hidden="true">/</span> BIBLIOTECA VIVA</span><span>CONFIANÇA · ESCUTA · COLABORAÇÃO</span></div>
   </div>
  </section>
  <footer><span>© Escola Atemporal · Biblioteca Atemporal</span><a className="learning-top-link" href="#topo">↑ Voltar ao início</a><span>Trilha 04 · Curadoria com fontes identificadas</span></footer>
 </main>;
}
