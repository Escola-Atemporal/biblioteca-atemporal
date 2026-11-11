import ColecaoAutoral from "../../components/ColecaoAutoral";
import Link from "next/link";
import type { Metadata } from "next";
import BrandLogo from "../../components/BrandLogo";
import BibliografiaTrilha03 from "../../components/BibliografiaTrilha03";
import CadernoHabitos from "../../components/CadernoHabitos";
import RoteiroVideos from "../../components/RoteiroVideos";
import {
  livrosTrilha03, artigosTrilha03, movimentosTrilha03,
  videosTrilha03, aprofundamentosTrilha03,
} from "../../../data/referencias-trilha-03";

export const metadata: Metadata = {
  title:"Trilha 03 — Autoconhecimento e Hábitos | Biblioteca Atemporal",
  description:"Quais padrões repetimos sem perceber? Uma jornada com 8 fontes da Escola Atemporal, 9 livros e materiais, 6 vídeos e o Diário das Pequenas Escolhas.",
};

const lentes = [
 {numero:"01",titulo:"O contexto",kicker:"ANTES DA AÇÃO",texto:"Um lugar, uma pressão ou uma expectativa frequentemente antecede o hábito. Identificar o contexto ajuda a questionar a ideia de que tudo depende apenas de força de vontade.",pergunta:"Em que momento o padrão costuma aparecer?"},
 {numero:"02",titulo:"O gesto",kicker:"O QUE EU REPITO",texto:"Descrever o que fazemos — sem nos definir pelo comportamento — permite notar variações e alternativas que passam despercebidas na rotina.",pergunta:"O que faço quase sem decidir?"},
 {numero:"03",titulo:"A consequência",kicker:"O QUE A REPETIÇÃO PRODUZ",texto:"Alguns hábitos aliviam algo no presente, mas cobram um custo adiante. Outros sustentam as pessoas e os valores mesmo em dias difíceis.",pergunta:"O que ganho agora e o que isso constrói depois?"},
];

const perguntas=[
 "Que comportamento você reconhece como automático em reuniões ou conversas difíceis?",
 "Qual fórmula de sucesso antiga merece ser revisitada com respeito, mas sem apego?",
 "O que ajuda a transformar uma boa intenção em prática observável?",
 "Que papel as pessoas e o ambiente têm na manutenção de seus hábitos?",
 "Como retornar a um compromisso depois de uma interrupção, sem transformar o processo em culpa?",
];

export default function Trilha03Page(){
 return <main className="learning-page habit-page referencia-trilha01" id="topo">
  <a className="skip-to-content" href="#investigacao">Ir para a investigação</a>
  <header className="topbar"><BrandLogo/><nav aria-label="Navegação principal"><Link href="/">Todas as trilhas</Link><Link href="/entrar" className="nav-login">Área de acesso ↗</Link></nav></header>
  <section className="learning-hero habit-hero" aria-labelledby="titulo-trilha-03">
   <div className="learning-wrap">
    <div className="learning-hero-copy">
     <div className="learning-crumb"><Link href="/">Biblioteca</Link><span>/</span>Trilha 03</div>
     <span className="eyebrow">JORNADA DE INVESTIGAÇÃO · 03 / 06</span>
     <h1 id="titulo-trilha-03">Autoconhecimento <em>e Hábitos.</em></h1>
     <p className="learning-lead">Quais padrões repetimos sem perceber?</p>
     <p className="learning-intro">O que praticamos todos os dias também conta a nossa história. Esta trilha convida a reconhecer automatismos, revisar fórmulas antigas e experimentar pequenas escolhas alinhadas ao que importa.</p>
     <div className="learning-hero-links"><a className="primary" href="#investigacao">Começar a investigação <span aria-hidden="true">↗</span></a><a className="outline" href="#livros">Explorar livros e e-books ↓</a></div>
    </div>
    <div className="learning-hero-picture habit-hero-picture">
     <img
      src="https://escolaatemporal.com.br/wp-content/uploads/2025/11/capa_23.png"
      alt="Imagem de capa oficial do artigo O Poder de Voltar para Si, da Escola Atemporal"
      width="840" height="840" loading="eager" fetchPriority="high" decoding="async"
     />
     <span className="learning-hero-picture-label">PEQUENAS ESCOLHAS. GRANDES LEGADOS.</span>
    </div>
    <div className="learning-facts">
     <span>{artigosTrilha03.length} conteúdos da Escola</span>
     <span>{livrosTrilha03.length} livros e materiais</span>
     <span>{videosTrilha03.length} vídeos externos</span>
     <span>04 movimentos</span>
     <span>01 diário reflexivo</span>
    </div>
   </div>
  </section>

  <nav className="learning-nav habit-nav" aria-label="Seções da Trilha 03">
   <div className="learning-wrap">
    <a href="#investigacao">O ponto de partida</a>
    <a href="#movimentos">Movimentos</a>
    <a href="#padroes">Padrões</a>
    <a href="#biblioteca">A Escola</a>
    <a href="#livros">Livros e e-books</a>
    <a href="#videos">Vídeos</a>
    <a href="#pratica">Prática</a>
    <a href="#diario-habitos">Diário</a>
   </div><span className="habit-nav-hint" aria-hidden="true">Deslize para explorar as seções →</span>
  </nav>

  <section id="investigacao" className="learning-section learning-wrap">
   <div className="learning-two-col">
    <div><span className="eyebrow dark">O PONTO DE PARTIDA</span><h2>O que repetimos <em>nos transforma.</em></h2></div>
    <div className="reading-copy">
     <p>Nem todos os hábitos começam como escolhas conscientes. Alguns surgem como respostas úteis a situações difíceis; outros aparecem por imitação, recompensa, pressa ou necessidade de pertencimento. Com o tempo, podem se transformar na maneira habitual de falar, trabalhar e decidir.</p>
     <p><strong>Autoconhecimento não é encontrar uma definição definitiva sobre si.</strong> É observar de que modo reagimos em diferentes situações, perceber o que sustenta nossos comportamentos e abrir espaço para alternativas coerentes com os princípios que valorizamos.</p>
     <p>Na Escola Atemporal, essa investigação encontra uma dimensão prática: <strong>princípios, crenças e emoções</strong> participam de nossas escolhas; escolhas repetidas podem formar <strong>hábitos coerentes</strong>, com efeitos sobre a cultura, os resultados e o legado.</p>
     <p className="source-note">Síntese editorial original baseada em <a href="https://escolaatemporal.com.br/blog/autoconhecimento/" target="_blank" rel="noopener noreferrer">O Poder de Voltar para Si ↗</a>, <a href="https://escolaatemporal.com.br/blog/escolhas-dificeis-lideranca-habitos/" target="_blank" rel="noopener noreferrer">As escolhas que nos tornam quem somos ↗</a> e <a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/" target="_blank" rel="noopener noreferrer">Nossa Metodologia ↗</a>.</p>
    </div>
   </div>
   <div className="habit-school-images">
    <figure className="habit-school-images-feature">
     <img src="https://escolaatemporal.com.br/wp-content/uploads/2026/10/Escolhas-dificeis-na-lideranca-decisoes-consequencias-e-transformacao.png" width="1200" height="780" loading="lazy" decoding="async" alt="Imagem editorial oficial do artigo As escolhas que nos tornam quem somos, da Escola Atemporal"/>
     <figcaption><span>IMAGEM OFICIAL · ESCOLA ATEMPORAL</span><a href="https://escolaatemporal.com.br/blog/escolhas-dificeis-lideranca-habitos/" target="_blank" rel="noopener noreferrer">Ver o artigo original ↗</a></figcaption>
    </figure>
    <div className="habit-school-images-copy">
     <span className="eyebrow">FONTE · ESCOLA ATEMPORAL</span>
     <h3>ESCOLHAS FAZEM MARCAS. <em>HÁBITOS SUSTENTAM CAMINHOS.</em></h3>
     <p>As escolhas exigentes podem revelar quem estamos nos tornando. Mas a mudança não se encerra no instante da decisão: ela se torna visível no que repetimos, ajustamos e praticamos nas relações.</p>
    </div>
   </div>
   <div className="learning-quote habit-quote"><span>UMA PERGUNTA PARA LEVAR ADIANTE</span><p>Que tipo de pessoa e de cultura meus hábitos ajudam a construir, mesmo quando ninguém está olhando?</p></div>
  </section>

  <section className="learning-section learning-muted" id="movimentos">
   <div className="learning-wrap">
    <div className="learning-section-header"><div><span className="eyebrow dark">QUATRO MOVIMENTOS</span><h2>Perceber. Questionar. <em>Experimentar. Sustentar.</em></h2></div><p>Um roteiro editorial inspirado na visão institucional sobre escolhas virtuosas e hábitos coerentes. Não é um teste, um método clínico ou uma promessa de mudança garantida.</p></div>
    <div className="learning-steps habit-steps">{movimentosTrilha03.map(m=><article key={m.numero}>
     <span>{m.numero}</span><h3>{m.titulo}</h3><p className="habit-stage-label">{m.subtitulo}</p><p>{m.texto}</p><p className="habit-stage-question">{m.pergunta}</p>
    </article>)}</div>
   </div>
  </section>

  <section className="learning-section learning-wrap" id="padroes">
   <div className="learning-section-header"><div><span className="eyebrow dark">UMA LENTE PARA O COTIDIANO</span><h2>O contexto também <em>participa da escolha.</em></h2></div><p>Observar o comportamento é mais útil do que definir a própria identidade pelo hábito. Estas três lentes ajudam a perceber um ciclo sem reduzi-lo a uma regra universal.</p></div>
   <div className="habit-lenses">{lentes.map(l=><article key={l.numero}><span>{l.numero} / {l.kicker}</span><h3>{l.titulo}</h3><p>{l.texto}</p><strong>{l.pergunta}</strong></article>)}</div>
   <p className="habit-lenses-note">Este esquema é uma síntese de leitura sobre contexto, repetição e consequência. Não equivale a um diagnóstico psicológico nem significa que todos os hábitos funcionem da mesma maneira.</p>
  </section>

  <section className="learning-section learning-wrap" id="biblioteca">
   <div className="learning-section-header"><div><span className="eyebrow dark">O QUE A ESCOLA JÁ INVESTIGA</span><h2>O repertório começa <em>na experiência.</em></h2></div><p>Uma seleção de artigos e páginas institucionais que conecta autoconhecimento, hábitos, presença e aprendizagem. Os textos completos permanecem no site original da Escola.</p></div>
   <div className="habit-editorial-gallery">
    <figure><img src="https://escolaatemporal.com.br/wp-content/uploads/2025/11/formula-do-sucesso.jpeg" width="940" height="630" loading="lazy" decoding="async" alt="Imagem oficial do artigo Será que a sua fórmula de sucesso ainda te serve?"/><figcaption><a href="https://escolaatemporal.com.br/blog/formula-de-sucesso/" target="_blank" rel="noopener noreferrer">Revisitar sua fórmula de sucesso ↗</a></figcaption></figure>
    <figure><img src="https://escolaatemporal.com.br/wp-content/uploads/2025/06/produtividade.png" width="940" height="630" loading="lazy" decoding="async" alt="Imagem editorial oficial da Escola sobre produtividade com presença"/><figcaption><a href="https://escolaatemporal.com.br/blog/produtividade-com-presenca/" target="_blank" rel="noopener noreferrer">Produtividade com presença ↗</a></figcaption></figure>
   </div>
   <div className="learning-articles">{artigosTrilha03.map((a,i)=><article key={a.href} className={"learning-article"+(a.destaque?" habit-article-featured":"")}>
    <div className="learning-article-number">{String(i+1).padStart(2,"0")}</div>
    <div><span className="learning-source-label">{a.tipo}</span><h3>{a.titulo}</h3><p>{a.resumo}</p><p className="learning-prompt"><strong>Para refletir:</strong> {a.pergunta}</p></div>
    <a className="learning-source-link" href={a.href} target="_blank" rel="noopener noreferrer" aria-label={"Ler fonte: "+a.titulo}>Ler fonte <span aria-hidden="true">↗</span></a>
   </article>)}</div>
  </section>

  <section className="learning-section learning-books" id="livros">
   <div className="learning-wrap">
    <div className="learning-section-header"><div><span className="eyebrow dark">ACERVO BIBLIOGRÁFICO · TRILHA 03</span><h2>Leituras para se <em>observar e transformar.</em></h2></div><p>Livros, materiais formativos e guias de acesso aberto, com contexto de publicação, perguntas reflexivas e links para as instituições de origem.</p></div>
    <ColecaoAutoral trilha="03" />
          <div className="learning-books-intro habit-books-intro"><div>
     <span className="learning-books-preamble">LER · EXPERIMENTAR · REVISAR</span>
     <h3>Conhecimento que ganha forma <em>no cotidiano.</em></h3>
     <p>Os materiais não são uma sequência obrigatória. Cada um oferece outra lente: autoconhecimento, hábitos de aprendizagem, motivação, cuidado ou comportamento em organizações.</p>
    </div><div className="learning-books-count"><strong>{livrosTrilha03.length}</strong><span>OBRAS<br/>E MATERIAIS</span></div></div>
    <nav className="learning-books-jump" aria-label="Navegação pela bibliografia"><a href="#roteiro-leituras-03">Percurso sugerido <span>04 ↘</span></a><a href="#bibliografia-filtros">Buscar no acervo <span>{livrosTrilha03.length} ↘</span></a><a href="#aprofundamentos-03">Textos acadêmicos <span>03 ↘</span></a></nav>
    <div className="learning-reading-route" id="roteiro-leituras-03">
     <div className="learning-book-group-head"><div><span className="learning-book-group-number">COMECE POR AQUI</span><h3>QUATRO LEITURAS PARA A PRÁTICA</h3></div><p>Uma proposta para atravessar os quatro movimentos com questões que você pode testar no cotidiano.</p></div>
     <ol className="reading-route-grid">
      <li><span>01 / PERCEBER</span><h4>Observar a si mesmo</h4><p>Comece com a apostila <strong>Autoconhecimento e Motivação</strong> e investigue um padrão recorrente no trabalho.</p><a href="#t03-enap-autoconhecimento">Ver leitura ↗</a></li>
      <li><span>02 / QUESTIONAR</span><h4>Desnaturalizar o hábito</h4><p>Leia trechos de <strong>Psychology 2e</strong> sobre aprendizagem e como o contexto pode reforçar comportamentos.</p><a href="#t03-openstax-psychology">Ver leitura ↗</a></li>
      <li><span>03 / EXPERIMENTAR</span><h4>Criar uma alternativa viável</h4><p>Explore <strong>Orientações pedagógicas para os estudos e a aprendizagem</strong> e escolha um ajuste possível na rotina.</p><a href="#t03-ifpa-estudo">Ver leitura ↗</a></li>
      <li><span>04 / SUSTENTAR</span><h4>Revisar sem se cobrar</h4><p>Use <strong>Autorregulação da aprendizagem</strong> para observar o que funcionou e adaptar o que precisa mudar.</p><a href="#t03-ifmg-autoregulacao">Ver leitura ↗</a></li>
     </ol>
    </div>
    <BibliografiaTrilha03/>
    <div className="learning-biblio-note"><span className="learning-biblio-note-icon" aria-hidden="true">i</span><div><strong>Sobre acesso gratuito e direitos de uso</strong><p>Os arquivos permanecem hospedados pela Enap, eduCAPES, OpenStax e Project Gutenberg. A Biblioteca abre o PDF, o EPUB ou o registro da instituição, sem copiar os materiais. Acesso público não equivale a permissão irrestrita para modificar, redistribuir ou explorar comercialmente. Consulte a licença da edição e o contexto original de cada obra.</p></div></div>
    <div className="learning-essays" id="aprofundamentos-03">
     <div className="learning-book-group-head"><div><span className="learning-book-group-number">C / 03</span><h3>PARA APROFUNDAR</h3></div><p>Textos de acesso aberto para contrastar experiências pessoais com perspectivas acadêmicas.</p></div>
     <div className="learning-essays-grid">{aprofundamentosTrilha03.map((x,i)=><article className="learning-essay" key={x.href}>
      <span className="learning-essay-num">{String(i+1).padStart(2,"0")} / TEXTO ONLINE</span>
      <h4>{x.titulo}</h4><p className="learning-essay-author">{x.fonte}</p><p>{x.tema}</p><p className="learning-essay-prompt"><strong>Investigue:</strong> {x.pergunta}</p>
      <a href={x.href} target="_blank" rel="noopener noreferrer">Ler referência original ↗</a>
     </article>)}</div>
    </div>
   </div>
  </section>

  <section className="learning-section learning-muted" id="videos">
   <div className="learning-wrap">
    <div className="learning-section-header"><div><span className="eyebrow dark">REFERÊNCIAS AUDIOVISUAIS</span><h2>Ideias que nos ajudam <em>a experimentar.</em></h2></div><p>Seis vídeos para investigar como os hábitos nascem, mudam e se relacionam com motivação e tempo. As imagens exibidas são apenas miniaturas oficiais quando disponíveis; os demais materiais têm capas tipográficas.</p></div>
    <RoteiroVideos trilha="03" total={videosTrilha03.length}/>
    <div className="learning-videos habit-videos">{videosTrilha03.map(v=><article className="learning-video" key={v.href}>
     <a className="habit-video-cover" href={v.href} aria-label={"Assistir na fonte original: "+v.titulo} target="_blank" rel="noopener noreferrer">
      <div className="learning-video-icon">{v.imagem?<img src={v.imagem} alt="" width="480" height="360" loading="lazy" decoding="async"/>:<div className="video-curadoria-placeholder"><span>TED · HÁBITOS E APRENDIZAGEM</span><strong>{v.titulo}</strong></div>}<span className="learning-video-play" aria-hidden="true"><span>▶</span></span></div>
     </a>
     <div className="learning-video-body"><span>{v.autoria}</span><h3>{v.titulo}</h3><p className="learning-video-theme">{v.idioma}</p><p>{v.resumo}</p><p className="learning-prompt"><strong>Para refletir:</strong> {v.pergunta}</p><a href={v.href} target="_blank" rel="noopener noreferrer">Assistir na fonte original ↗</a></div>
    </article>)}</div>
    <p className="learning-disclaimer">Os vídeos e suas miniaturas são de terceiros. A Biblioteca não republica gravações ou imagens como se fossem da Escola Atemporal; direitos, legendas e disponibilidade pertencem aos canais originais.</p>
   </div>
  </section>

  <section className="learning-section learning-wrap" id="pratica">
   <div className="learning-section-header"><div><span className="eyebrow dark">UMA PRÁTICA PARA O DIA A DIA</span><h2>Pequenas escolhas, <em>grandes possibilidades.</em></h2></div><p>Não é preciso mudar tudo para começar a observar. Um pequeno experimento pode revelar mais do que uma promessa grandiosa.</p></div>
   <div className="habit-final-questions">{perguntas.map((p,i)=><div key={p}><span>{String(i+1).padStart(2,"0")}</span><p>{p}</p></div>)}</div>
   <div className="learning-practice habit-practice">
    <span className="eyebrow">UM EXPERIMENTO POSSÍVEL · SEM PONTUAÇÃO</span>
    <h3>PERCEBER O QUE SE REPETE. TESTAR O QUE IMPORTA.</h3>
    <p>Escolha uma ação cotidiana que você gostaria de compreender melhor. Observe em quais situações ela aparece e o que acontece depois. Questione se a ação ainda ajuda a cuidar de um valor importante. Imagine uma pequena alternativa viável e, após algumas tentativas, revise o que aprendeu. A proposta é ganhar liberdade de escolha, não impor mais uma meta a cumprir.</p>
    <a href="#diario-habitos" className="workbook-cta-link">Abrir o Diário das Pequenas Escolhas ↓</a>
   </div>
   <CadernoHabitos/>
  </section>

  <section className="learning-end habit-end"><div className="learning-wrap">
   <span className="eyebrow">A JORNADA CONTINUA</span>
   <h2>O QUE FAZEMOS TODOS OS DIAS <em>TAMBÉM É UM LEGADO.</em></h2>
   <p>Conhecer-se não significa nunca mais repetir um hábito antigo. Significa cultivar presença suficiente para revisitar escolhas e construir, com outras pessoas, práticas mais coerentes.</p>
   <div className="learning-end-actions"><Link className="primary light" href="/">Voltar às seis trilhas ↗</Link><Link className="outline" href="/trilhas/emocoes-e-autoconsciencia">Revisitar a Trilha 02 →</Link></div>
  </div></section>
  <footer><span>© Escola Atemporal · Biblioteca Atemporal</span><a className="learning-top-link" href="#topo">↑ Voltar ao início</a><span>Trilha 03 · Curadoria com fontes identificadas</span></footer>
 </main>;
}
