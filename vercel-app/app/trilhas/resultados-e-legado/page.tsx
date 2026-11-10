import Link from "next/link";
import type {Metadata} from "next";
import BrandLogo from "../../components/BrandLogo";
import CadernoLegado from "../../components/CadernoLegado";
import BibliografiaEditorial from "../../components/BibliografiaEditorial";
import {fontesEscola06,movimentos06,dimensoes06,livros06,videos06} from "../../../data/referencias-trilha-06";

export const metadata:Metadata={
 title:"Trilha 06 — Resultados e Legado | Biblioteca Atemporal",
 description:"O resultado importa. O como também. Explore o Ciclo Virtuoso da Escola Atemporal, leituras abertas, palestras e um caderno reflexivo sobre o que permanece."
};

const questoes=[
 "O que melhorou, de forma concreta, com o nosso trabalho?",
 "Que custo humano, cultural ou ambiental pode não aparecer no relatório?",
 "Que comportamento desejamos que se repita depois da entrega?",
 "Quem precisa ter voz na avaliação do resultado e na definição do próximo passo?",
 "Que compromisso podemos sustentar mesmo quando a liderança mudar?",
];

export default function ResultadosLegado(){
 return <main className="learning-page legacy-page" id="topo">
   <a href="#investigacao" className="skip-to-content">Ir para o conteúdo</a>
   <header className="topbar"><BrandLogo/><nav aria-label="Navegação principal"><Link href="/">Todas as trilhas</Link><Link href="/entrar" className="nav-login">Área de acesso ↗</Link></nav></header>
   <section className="learning-hero legacy-hero" aria-labelledby="legacy-title"><div className="learning-wrap">
     <div className="learning-hero-copy">
       <div className="learning-crumb"><Link href="/">Biblioteca</Link><span>/</span>Trilha 06</div>
       <span className="eyebrow">JORNADA DE INVESTIGAÇÃO · 06 / 06</span>
       <h1 id="legacy-title">Resultados <em>e Legado.</em></h1>
       <p className="learning-lead">O que permanece depois que a meta é alcançada?</p>
       <p className="learning-intro">Há entregas que terminam na apresentação dos números. E há resultados que transformam relações, fortalecem culturas e abrem possibilidades para quem vem depois. Nesta última jornada, investigamos o valor do que fazemos — e do modo como fazemos.</p>
       <div className="learning-hero-links"><a href="#investigacao" className="primary">Começar a última jornada ↗</a><a href="#bibliografia" className="outline">Livros e referências ↓</a></div>
     </div>
     <figure className="legacy-hero-figure">
       <img src="https://escolaatemporal.com.br/wp-content/uploads/2026/08/2150040143.jpg" alt="Fotografia publicada pela Escola Atemporal na página Princípios Norteadores" width="1024" height="800" fetchPriority="high" loading="eager" decoding="async"/>
       <figcaption><a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/principios-norteadores/" target="_blank" rel="noopener noreferrer">FOTO PUBLICADA PELA ESCOLA ↗</a></figcaption>
     </figure>
     <div className="learning-facts"><span>{fontesEscola06.length} fontes da Escola</span><span>{livros06.length} leituras abertas</span><span>{videos06.length} palestras</span><span>04 dimensões</span><span>01 caderno reflexivo</span></div>
   </div></section>

   <nav className="learning-nav legacy-nav" aria-label="Seções da Trilha 06"><div className="learning-wrap">
     <a href="#investigacao">Ponto de partida</a><a href="#dimensoes">Quatro dimensões</a><a href="#ciclo">Ciclo Virtuoso</a><a href="#movimentos">Movimentos</a><a href="#escola">A Escola</a><a href="#bibliografia">Livros</a><a href="#videos">Vídeos</a><a href="#pratica">Prática</a><a href="#caderno-legado">Caderno</a>
   </div></nav>

   <section className="learning-section learning-wrap legacy-intro" id="investigacao">
     <div className="learning-two-col">
       <div><span className="eyebrow dark">O PONTO DE PARTIDA</span><h2>O resultado <em>não termina no número.</em></h2></div>
       <div className="reading-copy">
         <p>Metas ajudam a dar direção. Mas o significado de uma entrega fica incompleto quando não observamos <strong>como as pessoas participaram, quais relações se fortaleceram e que hábitos foram criados.</strong></p>
         <p>Um resultado pode ser importante e ainda assim pedir revisão: o esforço foi sustentável? Houve escuta? Aprendemos algo que outra equipe poderá utilizar? O impacto alcançou quem deveria alcançar?</p>
         <p>A Escola Atemporal propõe um olhar de dentro para fora: princípios, escolhas, hábitos coerentes, relações saudáveis e cultura do bem comum se conectam a resultados que possam permanecer. Esta trilha transforma essa visão em perguntas e práticas educativas.</p>
         <p className="source-note">Síntese editorial original baseada em <a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/" target="_blank" rel="noopener noreferrer">Nossa Metodologia ↗</a> e <a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/principios-norteadores/" target="_blank" rel="noopener noreferrer">Princípios Norteadores ↗</a>.</p>
       </div>
     </div>
     <div className="learning-quote legacy-quote"><span>UMA PERGUNTA PARA ATRAVESSAR O PERCURSO</span><p>Se alcançarmos tudo o que planejamos, mas perdermos aquilo que nos orienta, teremos realmente avançado?</p></div>
   </section>

   <section className="learning-section learning-muted legacy-dimensions" id="dimensoes"><div className="learning-wrap">
     <div className="learning-section-header"><div><span className="eyebrow dark">UM OLHAR MAIS COMPLETO</span><h2>Quatro dimensões <em>de um resultado.</em></h2></div><p>Uma lente editorial para ampliar conversas — não é instrumento de diagnóstico, índice de desempenho ou avaliação de pessoas.</p></div>
     <div className="legacy-dimension-grid">{dimensoes06.map(d=><article key={d.numero}>
       <div className="legacy-dimension-meta">{d.numero} / DIMENSÃO</div><h3>{d.titulo}</h3><p>{d.descricao}</p><strong>{d.questao}</strong>
     </article>)}</div>
     <div className="legacy-dimension-caption"><span>PERGUNTA-CHAVE</span><p>Que evidência de cada dimensão ajudaria a compreender melhor a entrega — inclusive quando as evidências apontam para direções diferentes?</p></div>
   </div></section>

   <section className="legacy-cycle" id="ciclo" aria-labelledby="legacy-cycle-title"><div className="learning-wrap">
     <div className="legacy-cycle-head"><div><span className="eyebrow">REFERÊNCIA OFICIAL DA ESCOLA ATEMPORAL</span><h2 id="legacy-cycle-title">O CICLO VIRTUOSO <em>DOS RESULTADOS SUSTENTÁVEIS.</em></h2></div><p>A linguagem visual do Ciclo Virtuoso é mantida em suas cores originais, como na Escola. O fundo escuro preserva a leitura das legendas brancas do diagrama.</p></div>
     <div className="legacy-cycle-grid">
       <figure><img src="https://escolaatemporal.com.br/wp-content/uploads/2026/09/ciclo-virtuoso.png" alt="Diagrama original multicolorido do Ciclo Virtuoso da Escola Atemporal: princípios, escolhas virtuosas, hábitos coerentes, relações saudáveis, cultura do bem comum e resultado e legado" width="1000" height="820" loading="lazy" decoding="async"/><figcaption>DIAGRAMA INSTITUCIONAL · SEM RECOLORAÇÃO</figcaption></figure>
       <div className="legacy-cycle-copy">
         <span>DA ORIGEM À CONTINUIDADE</span>
         <h3>O COMO <em>CONSTRÓI O AMANHÃ.</em></h3>
         <p>Na metodologia da Escola, os resultados não aparecem desconectados dos princípios e dos hábitos. A experiência de cada escolha influencia a qualidade das relações e o tipo de cultura que permanece.</p>
         <p>Repare que o ciclo é uma imagem de interdependência: quando uma etapa enfraquece, outras podem sofrer. Não basta olhar para a última entrega; importa cuidar das condições que tornam possível continuar.</p>
         <a href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/" target="_blank" rel="noopener noreferrer">Conhecer a metodologia original ↗</a>
       </div>
     </div>
   </div></section>

   <section className="learning-section learning-muted legacy-movements" id="movimentos"><div className="learning-wrap">
     <div className="learning-section-header"><div><span className="eyebrow dark">DO ENTENDIMENTO À PRÁTICA</span><h2>Reconhecer. Considerar. <em>Cultivar. Transmitir.</em></h2></div><p>Quatro movimentos de investigação para olhar o que foi feito, suas consequências e os compromissos que valem ser sustentados.</p></div>
     <div className="learning-steps legacy-steps">{movimentos06.map(m=><article key={m.numero}>
       <span>{m.numero} / {m.subtitulo}</span><h3>{m.titulo}</h3><p>{m.texto}</p><p className="legacy-step-question">{m.pergunta}</p>
     </article>)}</div>
   </div></section>

   <section className="learning-section learning-wrap" id="escola">
     <div className="learning-section-header"><div><span className="eyebrow dark">A ESCOLA ATEMPORAL</span><h2>Um repertório para <em>o que permanece.</em></h2></div><p>Seis fontes institucionais que conectam escolhas, resultados, relações, cultura e compromisso com o futuro.</p></div>
     <div className="learning-articles">{fontesEscola06.map((a,i)=><article className="learning-article" key={a.href}>
       <div className="learning-article-number">{String(i+1).padStart(2,"0")}</div><div><span className="learning-source-label">{a.tipo}</span><h3>{a.titulo}</h3><p>{a.resumo}</p><p className="learning-prompt"><strong>Para refletir:</strong> {a.pergunta}</p></div>
       <a className="learning-source-link" href={a.href} target="_blank" rel="noopener noreferrer">Ler fonte ↗</a>
     </article>)}</div>
   </section>

   <section className="learning-section learning-books legacy-books" id="bibliografia"><div className="learning-wrap">
     <div className="learning-section-header"><div><span className="eyebrow dark">BIBLIOGRAFIA DA TRILHA 06</span><h2>Estudar o impacto. <em>Revisitar o caminho.</em></h2></div><p>Livros e capítulos de acesso aberto, com autores e links para editoras e repositórios. As opções de PDF ou EPUB ficam nas fontes originais.</p></div>
     <div className="legacy-books-lead"><div><span className="eyebrow">REPERTÓRIO · SEM DOWNLOADS NÃO AUTORIZADOS</span><h3>RESULTADOS SUSTENTÁVEIS PEDEM <em>PERGUNTAS MAIORES.</em></h3><p>Leia sobre stakeholders, responsabilidade corporativa, planejamento e aprendizagem contínua. Não é necessário seguir uma ordem fixa.</p></div><span className="legacy-books-total"><strong>{livros06.length}</strong><small>OBRAS E<br/>CAPÍTULOS</small></span></div>
     <BibliografiaEditorial trilha="06" obras={livros06.map(x=>({id:x.id,tipo:x.tipo,titulo:x.titulo,autor:x.autor,resumo:x.descricao,pergunta:x.pergunta,acesso:x.acesso,href:x.href}))}/>
     <p className="learning-disclaimer">A Biblioteca não hospeda cópias dos livros citados. O acesso às versões completas e a possibilidade de compartilhar arquivos dependem da licença de cada edição.</p>
   </div></section>

   <section className="learning-section learning-muted legacy-videos" id="videos"><div className="learning-wrap">
     <div className="learning-section-header"><div><span className="eyebrow dark">REFERÊNCIAS AUDIOVISUAIS</span><h2>O sucesso que medimos. <em>A vida que construímos.</em></h2></div><p>Três palestras selecionadas no TED. Todas abrem na fonte oficial; áudio, vídeo e legendas permanecem com seus criadores.</p></div>
     <div className="legacy-video-grid">{videos06.map((v,i)=><article className="legacy-video-card" key={v.href}>
       <a className="legacy-video-top" href={v.href} target="_blank" rel="noopener noreferrer" aria-label={"Assistir à palestra "+v.titulo}><span>TED · REFERÊNCIA {String(i+1).padStart(2,"0")}</span><strong>RESULTADO <em>TAMBÉM É IMPACTO.</em></strong><span aria-hidden="true" className="legacy-video-play">↗</span></a>
       <div className="legacy-video-content"><span>{v.autor}</span><h3>{v.titulo}</h3><p className="legacy-video-lang">{v.idioma}</p><p>{v.resumo}</p><p className="legacy-video-question"><strong>Para refletir:</strong> {v.pergunta}</p><a href={v.href} target="_blank" rel="noopener noreferrer">Assistir no TED ↗</a></div>
     </article>)}</div>
   </div></section>

   <section className="learning-section learning-wrap legacy-practice" id="pratica">
     <div className="learning-section-header"><div><span className="eyebrow dark">PARA TRAZER À VIDA REAL</span><h2>Depois da meta, <em>quais perguntas permanecem?</em></h2></div><p>Use essas perguntas numa conversa individual ou coletiva de baixo risco. Não exponha dados pessoais nem transforme a reflexão em julgamento.</p></div>
     <ol className="learning-questions">{questoes.map((q,i)=><li key={q}><span>{String(i+1).padStart(2,"0")}</span><p>{q}</p></li>)}</ol>
     <div className="learning-practice legacy-practice-banner"><div><span className="eyebrow">UMA EXPERIÊNCIA SIMPLES</span><h3>DEIXE UM COMPROMISSO, NÃO APENAS UMA ENTREGA.</h3><p>Escolha um resultado recente. Escute quem foi afetado, reconheça algo a preservar e uma consequência a reparar. Combine uma pequena prática e uma conversa futura para aprender com o que aconteceu.</p><a href="#caderno-legado">Abrir o Caderno de Continuidade ↘</a></div></div>
     <CadernoLegado/>
   </section>

   <section className="learning-end legacy-end" aria-labelledby="legacy-end-title"><div className="learning-wrap">
     <div className="legacy-end-grid"><div className="legacy-end-heading"><span className="eyebrow">SEIS TRILHAS · UMA BIBLIOTECA VIVA</span><h2 id="legacy-end-title">O QUE PERMANECE <em>NOS TRANSFORMA.</em></h2><span className="legacy-end-line" aria-hidden="true"/></div>
       <div className="legacy-end-copy"><p>Princípios, emoções, hábitos, confiança, liderança e legado. Estas seis trilhas não encerram uma busca: oferecem caminhos para que cada pergunta encontre espaço na experiência cotidiana.</p><p className="legacy-end-question">Que escolha de hoje merece ser lembrada amanhã?</p><div className="legacy-end-buttons"><Link href="/" className="primary light">Voltar às seis trilhas ↗</Link><Link href="/trilhas/principios-e-discernimento" className="outline">Recomeçar pela Trilha 01 →</Link></div></div>
     </div><div className="legacy-end-footer"><span>BIBLIOTECA ATEMPORAL</span><span>01 — 06 · O ESSENCIAL PERMANECE</span></div>
   </div></section>
   <footer><span>© Escola Atemporal · Biblioteca Atemporal</span><a className="learning-top-link" href="#topo">↑ Voltar ao início</a><span>Trilha 06 · Referências com fonte identificada</span></footer>
 </main>;
}
