import BrandLogo from "../components/BrandLogo";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, authConfigured, signOut } from "../../auth";
import { roleForEmail } from "../../lib/access";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Meu painel | Biblioteca Atemporal",
  description: "Espaço reservado de aprendizagem da Escola Atemporal.",
  robots: { index: false, follow: false },
};

const trilhas = [
  { number: "01", title: "Princípios e Discernimento", slug: "principios-e-discernimento" },
  { number: "02", title: "Emoções e Autoconsciência", slug: "emocoes-e-autoconsciencia" },
  { number: "03", title: "Autoconhecimento e Hábitos", slug: "autoconhecimento-e-habitos" },
  { number: "04", title: "Confiança e Colaboração", slug: "confianca-e-colaboracao" },
  { number: "05", title: "Paradoxos da Liderança", slug: "paradoxos-da-lideranca" },
  { number: "06", title: "Resultados e Legado", slug: "resultados-e-legado" },
] as const;

export default async function Painel() {
  if (!authConfigured) redirect("/entrar");
  const session = await auth();
  if (!session?.user?.email) redirect("/entrar");
  const role = roleForEmail(session.user.email);
  if (!role) redirect("/entrar");

  const canReviewDrafts = role === "administrador" || role === "curador";

  return (
    <main className="dashboard-atm">
      <header className="topbar login-atm-topbar">
        <BrandLogo />
        <nav aria-label="Navegação do painel">
          <Link href="/">Biblioteca</Link>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/entrar" }); }}>
            <button type="submit" className="dashboard-atm-logout">Sair da conta ↗</button>
          </form>
        </nav>
      </header>

      <section className="dashboard-atm-hero">
        <div className="dashboard-atm-container">
          <span className="dashboard-atm-eyebrow">ESPAÇO DE APRENDIZAGEM / ACESSO AUTORIZADO</span>
          <h1>Seu repertório <em>continua aqui.</em></h1>
          <p>Um convite para conhecer, refletir e transformar conhecimento em experiências que permanecem.</p>
          <div className="dashboard-atm-user">
            <span><strong>CONTA</strong> {session.user.email}</span>
            <span><strong>PERFIL</strong> {role}</span>
            <span><strong>SESSÃO</strong> autenticada</span>
          </div>
        </div>
      </section>

      <div className="dashboard-atm-body dashboard-atm-container">
        <div className="dashboard-atm-heading">
          <div>
            <span className="dashboard-atm-eyebrow dark">SUAS JORNADAS</span>
            <h2>Seis trilhas para <em>seguir investigando.</em></h2>
          </div>
          <p>Escolha um tema. Cada percurso reúne textos, referências e perguntas para experimentar na vida real.</p>
        </div>
        <div className="dashboard-atm-tracks">
          {trilhas.map((trilha) => (
            <article className="dashboard-atm-track" key={trilha.number}>
              <span>TRILHA {trilha.number} / 06</span>
              <h3>{trilha.title}</h3>
              <Link href={`/trilhas/${trilha.slug}`}>Abrir jornada <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
        <section className="dashboard-atm-editorial" aria-labelledby="dashboard-acervo">
          <div>
            <span className="dashboard-atm-eyebrow">COLEÇÃO BIBLIOTECA ATEMPORAL</span>
            <h2 id="dashboard-acervo">E-books da <em>Escola.</em></h2>
            {canReviewDrafts
              ? <p>Os nove volumes estão em revisão editorial. Os links de consulta aparecem nas bibliografias das trilhas; o Drive exige permissão própria para abrir os arquivos.</p>
              : <p>A coleção de e-books está em revisão editorial. O acesso às minutas é reservado à administração e à curadoria até a aprovação de distribuição.</p>}
          </div>
          {canReviewDrafts
            ? <Link href="/trilhas/principios-e-discernimento#ebooks-escola-01" className="dashboard-atm-editorial-link">Ver e-books em revisão ↗</Link>
            : <Link href="/#trilhas" className="dashboard-atm-editorial-link">Explorar acervo público ↗</Link>}
        </section>
        <div className="dashboard-atm-bottom">
          <p><strong>O resultado importa. O como também.</strong> A Escola Atemporal valoriza escolhas conscientes, relações genuínas e aprendizado contínuo.</p>
          <form action={async () => { "use server"; await signOut({ redirectTo: "/entrar" }); }}>
            <button type="submit" className="dashboard-atm-exit">Encerrar sessão</button>
          </form>
        </div>
      </div>
    </main>
  );
}
