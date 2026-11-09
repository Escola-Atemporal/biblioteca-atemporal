import Link from "next/link";
import catalog from "../data/catalogo-publico.json";

const tracks: Record<string, string> = {
  "01": "Princípios e Discernimento",
  "02": "Emoções e Autoconsciência",
  "03": "Autoconhecimento e Hábitos",
  "04": "Confiança e Colaboração",
  "05": "Paradoxos da Liderança",
  "06": "Resultados e Legado",
};

export default function HomePage() {
  return (
    <main>
      <header className="topbar"><Link className="brand" href="/"><img className="brand-logo" src="https://escolaatemporal.com.br/wp-content/uploads/2026/08/hor-e1787682735563.png" alt="Escola Atemporal" width="1350" height="454" /><span> / BIBLIOTECA</span></Link><nav><Link href="#trilhas">Explorar trilhas</Link><Link href="/entrar" className="nav-login">Área de acesso ↗</Link></nav></header>
      <section className="hero">
        <div className="eyebrow">CONHECIMENTO EM MOVIMENTO <span>·</span> ACERVO EXPERIENCIALISTA</div>
        <h1>Conhecimento que <em>atravessa</em> o tempo.</h1>
        <p>Uma biblioteca viva para conectar reflexões, repertórios e experiências. Explore as seis trilhas de desenvolvimento humano da Escola Atemporal.</p>
        <div className="actions"><Link className="primary" href="#trilhas">Explorar biblioteca <span>↗</span></Link><Link className="outline" href="/entrar">Acessar meu espaço →</Link></div>
        <div className="hero-aside"><span>01 — 06</span><span>Seis caminhos. Múltiplas perspectivas.</span></div>
      </section>
      <section id="trilhas" className="section">
        <div className="section-head"><div><span className="eyebrow dark">PERCURSOS DE CONHECIMENTO</span><h2>As seis trilhas</h2></div><p>Temas que convidam a investigar o humano em suas diferentes dimensões.</p></div>
        <div className="tracks">
          {catalog.items.map((item) => <article className="track" key={item.id}><div className="track-num">{item.track} <span>↗</span></div><h3>{item.track === "01" ? <Link href="/trilhas/principios-e-discernimento">{tracks[item.track]} ↗</Link> : tracks[item.track]}</h3><h4>{item.title}</h4><p>{item.description}</p><div className="tags">{item.tags.slice(0,3).map(tag=><span key={tag}>{tag}</span>)}</div>{item.track === "01" && <Link href="/trilhas/principios-e-discernimento" className="track-cta">Explorar a trilha completa →</Link>}</article>)}
        </div>
      </section>
      <section className="access-cta"><div><span className="eyebrow">UM ESPAÇO PARA APROFUNDAR</span><h2>O seu percurso continua aqui.</h2><p>Os materiais internos ficarão disponíveis apenas para pessoas autorizadas pela Escola.</p></div><Link href="/entrar" className="primary light">Entrar na Biblioteca ↗</Link></section>
      <footer><span>© Escola Atemporal · Biblioteca Atemporal</span><span>Protótipo público · Nenhum material restrito publicado</span></footer>
    </main>
  );
}
