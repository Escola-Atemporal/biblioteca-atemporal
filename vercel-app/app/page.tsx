import BrandLogo from "./components/BrandLogo";
import Link from "next/link";
import type { Metadata } from "next";
import catalog from "../data/catalogo-publico.json";

export const metadata: Metadata = {
  title: "Biblioteca Atemporal | Repertórios que permanecem",
  description: "Explore as trilhas de desenvolvimento humano, reflexões e referências da Escola Atemporal. Uma biblioteca viva para experiencialistas.",
};

const tracks: Record<string, { name: string; kicker: string; inquiry: string }> = {
  "01": { name: "Princípios e Discernimento", kicker: "O essencial permanece", inquiry: "O que orienta nossas escolhas quando não existe resposta simples?" },
  "02": { name: "Emoções e Autoconsciência", kicker: "Reconhecer para escolher", inquiry: "O que sentimos antes de decidir e como isso modifica nossas relações?" },
  "03": { name: "Autoconhecimento e Hábitos", kicker: "Pequenas escolhas, grandes mudanças", inquiry: "Quais padrões repetimos sem perceber?" },
  "04": { name: "Confiança e Colaboração", kicker: "A sabedoria é coletiva", inquiry: "Que condições permitem construir com outras pessoas?" },
  "05": { name: "Paradoxos da Liderança", kicker: "Sustentar a complexidade", inquiry: "Como encontrar direção em meio a tensões legítimas?" },
  "06": { name: "Resultados e Legado", kicker: "O como também importa", inquiry: "O que permanece depois que a meta é alcançada?" },
};

const schoolArticles = [
  {
    type: "ARTIGO · ESCOLA ATEMPORAL",
    title: "O preço da coerência",
    desc: "Princípios, ética e escolhas que revelam quem somos quando ceder parece mais fácil.",
    image: "https://escolaatemporal.com.br/wp-content/uploads/2026/10/Principios-na-lideranca-etica-confianca-e-coerencia-nas-decisoes.png",
    href: "https://escolaatemporal.com.br/blog/principios-lideranca-preco-coerencia/",
    alt: "Imagem editorial da Escola Atemporal sobre princípios e coerência na liderança",
  },
  {
    type: "NOSSA FILOSOFIA",
    title: "Princípios Norteadores",
    desc: "O essencial permanece: discernimento, presença, responsabilidade e bem comum.",
    image: "https://escolaatemporal.com.br/wp-content/uploads/2026/04/Conceitual-Homem-Atemporal-2.png",
    href: "https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/principios-norteadores/",
    alt: "Imagem conceitual utilizada pela Escola Atemporal em Princípios Norteadores",
  },
  {
    type: "NOSSA METODOLOGIA",
    title: "O resultado importa. O como também.",
    desc: "Escolhas virtuosas, hábitos coerentes e resultados que deixam um legado.",
    image: "https://escolaatemporal.com.br/wp-content/uploads/2026/09/ciclo-virtuoso.png",
    href: "https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/nossa-metodologia/",
    alt: "Ilustração do Ciclo Virtuoso da Escola Atemporal",
  },
];

export default function HomePage() {
  return (
    <main className="biblioteca-home">
      <a className="skip-to-content" href="#trilhas">Ir para as trilhas</a>
      <header className="topbar">
        <BrandLogo />
        <nav aria-label="Navegação principal">
          <Link href="#trilhas">Trilhas</Link>
          <Link href="#fontes">Referências</Link>
          <a href="https://escolaatemporal.com.br/" target="_blank" rel="noopener noreferrer">A Escola ↗</a>
          <Link href="/entrar" className="nav-login">Área de acesso ↗</Link>
        </nav>
      </header>

      <section className="atemporal-masthead" aria-labelledby="home-title">
        <div className="atemporal-masthead-main">
          <div className="atemporal-masthead-content">
            <div className="atemporal-overline"><span className="square-dot" aria-hidden="true" /> ESCOLA ATEMPORAL <span className="overline-divider">/</span> ACERVO EXPERIENCIALISTA</div>
            <h1 id="home-title">O QUE <span>PERMANECE</span> NOS TRANSFORMA.</h1>
            <p className="atemporal-masthead-question">O que nos orienta quando tudo muda?</p>
            <p className="atemporal-masthead-description">Conhecimento que ganha sentido na experiência. Um espaço vivo para encontrar ideias, ampliar perspectivas e colocar princípios em movimento.</p>
            <div className="atemporal-hero-actions">
              <a href="#trilhas" className="primary">Explorar as trilhas <span aria-hidden="true">↗</span></a>
              <Link href="/trilhas/principios-e-discernimento" className="outline">Começar pela Trilha 01 <span aria-hidden="true">→</span></Link>
            </div>
          </div>
          <div className="atemporal-masthead-visual" aria-hidden="true">
            <div className="masthead-art-ring" />
            <img src="https://escolaatemporal.com.br/wp-content/uploads/2026/04/Conceitual-Homem-Atemporal-2.png" alt="" width="840" height="860" />
            <div className="masthead-art-label">A PROFUNDIDADE<br/>COMEÇA EM NÓS.</div>
          </div>
        </div>
        <div className="atemporal-masthead-bottom">
          <span>UM ACERVO PARA PERGUNTAS QUE VALEM A PENA</span>
          <span>01 — 06 <span aria-hidden="true">↘</span></span>
        </div>
        <div className="spectrum-strip" aria-hidden="true"><i/><i/><i/><i/><i/><i/></div>
      </section>

      <section className="atemporal-statement" aria-label="Proposta da Biblioteca">
        <div className="atemporal-container statement-grid">
          <span className="eyebrow dark">POR QUE EXISTE</span>
          <div>
            <h2>NÃO É APENAS SOBRE <span>APRENDER.</span><br/>É SOBRE O QUE FAZEMOS COM ISSO.</h2>
            <p>Na Escola Atemporal, o conhecimento não termina na leitura. Ele encontra significado nas conversas, nas decisões e nos hábitos que transformam a maneira como vivemos e colaboramos.</p>
          </div>
        </div>
      </section>

      <section className="atemporal-journeys" id="trilhas">
        <div className="atemporal-container">
          <div className="atemporal-section-heading">
            <div><span className="eyebrow dark">PERCURSOS DE INVESTIGAÇÃO · 01 — 06</span><h2>SEIS TRILHAS.<br/><span>MÚLTIPLAS PERSPECTIVAS.</span></h2></div>
            <p>Temas que se conectam e se desdobram em textos, vídeos, referências e perguntas para a vida real. Vamos desenvolver uma trilha de cada vez.</p>
          </div>
          <div className="atemporal-tracks">
            {catalog.items.map((item) => {
              const track = tracks[item.track];
              const available = item.track === "01";
              return <article className={`atemporal-track track-color-${item.track}${available ? " track-is-live" : ""}`} key={item.id}>
                <div className="atemporal-track-top"><span>TRILHA {item.track}</span><span className="atemporal-track-status">{available ? "DISPONÍVEL" : "EM DESENVOLVIMENTO"}</span></div>
                <div className="atemporal-track-content">
                  <span className="atemporal-track-index" aria-hidden="true">{item.track}</span>
                  <span className="atemporal-track-kicker">{track.kicker}</span>
                  <h3>{track.name}</h3>
                  <p>{track.inquiry}</p>
                </div>
                <div className="atemporal-track-foot">
                  {available ? <Link href="/trilhas/principios-e-discernimento" aria-label="Explorar trilha 01 — Princípios e Discernimento">Explorar trilha <span aria-hidden="true">↗</span></Link> : <span>Conteúdo em preparação <span aria-hidden="true">·</span></span>}
                </div>
              </article>;
            })}
          </div>
        </div>
      </section>

      <section className="atemporal-feature" aria-labelledby="feature-title">
        <div className="atemporal-feature-image">
          <img src="https://escolaatemporal.com.br/wp-content/uploads/2026/08/2150040143.jpg" alt="Imagem de referência usada pela Escola Atemporal na página Princípios Norteadores" width="1100" height="800" loading="lazy" />
          <span>01 / 06 · PRIMEIRA TRILHA</span>
        </div>
        <div className="atemporal-feature-content">
          <span className="eyebrow">EXPERIÊNCIA EM DESTAQUE</span>
          <h2>O ESSENCIAL <span>PERMANECE.</span></h2>
          <p className="feature-lead">Princípios e Discernimento</p>
          <p>Em tempos de pressão e mudanças, o desafio não é apenas chegar ao resultado. É reconhecer quais valores precisam atravessar nossas decisões.</p>
          <div className="atemporal-feature-data"><span>08 LEITURAS DA ESCOLA</span><span>17 LIVROS E MATERIAIS</span><span>03 VÍDEOS</span><span>01 CADERNO INTERATIVO</span></div>
          <Link href="/trilhas/principios-e-discernimento" className="primary">Entrar na Trilha 01 <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section className="atemporal-sources" id="fontes">
        <div className="atemporal-container">
          <div className="atemporal-section-heading">
            <div><span className="eyebrow dark">CONTEÚDOS DA NOSSA ESCOLA</span><h2>IDEIAS QUE <span>CONTINUAM.</span></h2></div>
            <p>A Biblioteca se constrói a partir de reflexões e materiais já publicados pela Escola Atemporal, sempre apontando para as fontes originais.</p>
          </div>
          <div className="atemporal-source-grid">
            {schoolArticles.map((article) => <article key={article.href} className="atemporal-source-card">
              <a className="source-card-figure" href={article.href} target="_blank" rel="noopener noreferrer" aria-label={`Abrir fonte: ${article.title}`}>
                <img src={article.image} alt={article.alt} loading="lazy" />
                <span className="source-card-open">Abrir fonte <span aria-hidden="true">↗</span></span>
              </a>
              <div className="source-card-copy"><span className="eyebrow dark">{article.type}</span><h3>{article.title}</h3><p>{article.desc}</p><a href={article.href} target="_blank" rel="noopener noreferrer">Ler na Escola Atemporal <span aria-hidden="true">↗</span></a></div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="atemporal-manifesto">
        <div className="atemporal-container">
          <span className="eyebrow">A FILOSOFIA QUE NOS MOVE</span>
          <h2>PROFUNDIDADE <span>COM SIMPLICIDADE.</span></h2>
          <div className="atemporal-values">
            <div><span>01</span><h3>O ESSENCIAL PERMANECE</h3><p>Reconhecer o que não pode se perder, mesmo quando o contexto exige mudança.</p></div>
            <div><span>02</span><h3>A SABEDORIA É COLETIVA</h3><p>Ampliar o repertório pela escuta e pelo encontro entre perspectivas.</p></div>
            <div><span>03</span><h3>PEQUENAS ESCOLHAS, GRANDES LEGADOS</h3><p>Levar princípios para os gestos, as relações e as decisões do cotidiano.</p></div>
          </div>
          <a className="manifesto-source" href="https://escolaatemporal.com.br/hub-de-desenvolvimento-humano/principios-norteadores/" target="_blank" rel="noopener noreferrer">Conheça os Princípios Norteadores da Escola ↗</a>
        </div>
      </section>

      <section className="atemporal-cta">
        <div className="atemporal-container atemporal-cta-inner">
          <div><span className="eyebrow dark">UM ESPAÇO PARA CONTINUAR</span><h2>SEU PERCURSO <span>CONTINUA AQUI.</span></h2><p>A Biblioteca pública já pode ser explorada. A área reservada dos experiencialistas será disponibilizada após a conclusão do controle de acesso.</p></div>
          <Link href="/entrar" className="primary">Conhecer a área de acesso <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
      <footer className="atemporal-footer"><div className="atemporal-container"><span>© Escola Atemporal · Biblioteca Atemporal</span><a href="https://escolaatemporal.com.br/" target="_blank" rel="noopener noreferrer">Visitar a Escola Atemporal ↗</a><span>Curadoria pública · Sem materiais restritos</span></div></footer>
    </main>
  );
}
