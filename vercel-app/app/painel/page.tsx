import { can } from "../../lib/permissions";
import BrandLogo from "../components/BrandLogo";
import PresenceHeartbeat from "../components/PresenceHeartbeat";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, authConfigured, signOut } from "../../auth";
import { roleForEmailAsync } from "../../lib/access";
import { databaseConfigured,dbQuery } from "../../lib/database";
import type { ProgressRecord } from "../../lib/learning-progress";
import ProgressCards from "./ProgressCards";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Meu painel | Biblioteca Atemporal",
  description: "Espaço reservado de aprendizagem da Escola Atemporal.",
  robots: { index: false, follow: false },
};

export default async function Painel() {
  if (!authConfigured) redirect("/entrar");
  const session = await auth();
  if (!session?.user?.email) redirect("/entrar");
  const role = await roleForEmailAsync(session.user.email);
  if (!role) redirect("/entrar");

  const canReviewDrafts = can(role, "drafts:read");
  let progress:ProgressRecord[]=[];
  let progressUnavailable=!databaseConfigured;
  if(databaseConfigured)try{
    progress=await dbQuery<ProgressRecord>("SELECT trail_slug,status,section_id,updated_at::text AS updated_at FROM biblioteca_learning_progress WHERE email=$1",[session.user.email.trim().toLowerCase()]);
  }catch{progressUnavailable=true;}

  return (
    <main className="dashboard-atm">
      <PresenceHeartbeat section="Meu painel" />
      <header className="topbar login-atm-topbar">
        <BrandLogo />
        <nav aria-label="Navegação do painel">
          <Link href="/">Biblioteca</Link>
          <Link href="/arquivos">Arquivos</Link>
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
        <ProgressCards progress={progress} unavailable={progressUnavailable}/>
        <section className="dashboard-atm-editorial" aria-labelledby="dashboard-caderno">
          <div><span className="dashboard-atm-eyebrow">SEU ESPAÇO DE REFLEXÃO</span>
            <h2 id="dashboard-caderno">Um caderno para <em>revisitar suas ideias.</em></h2>
            <p>Registre reflexões pessoais inspiradas nas seis trilhas. Suas anotações ficam vinculadas à sua conta e podem ser editadas ou excluídas por você.</p>
          </div>
          <Link href="/painel/caderno" className="dashboard-atm-editorial-link">Abrir meu caderno ↗</Link>
        </section>
        <section className="dashboard-atm-editorial" aria-labelledby="dashboard-acervo">
          <div>
            <span className="dashboard-atm-eyebrow">COLEÇÃO BIBLIOTECA ATEMPORAL</span>
            <h2 id="dashboard-acervo">Arquivos da <em>Biblioteca.</em></h2>
            {canReviewDrafts
              ? <p>Encontre os nove e-books autorais, guias e documentos de apoio em um só lugar. Busque por tema, navegue pelas pastas e abra ou baixe os arquivos no Drive da Escola.</p>
              : <p>A coleção de e-books está em revisão editorial. O acesso às minutas é reservado à administração e à curadoria até a aprovação de distribuição.</p>}
          </div>
          {canReviewDrafts
            ? <Link href="/arquivos" className="dashboard-atm-editorial-link">Explorar os arquivos ↗</Link>
            : <Link href="/#trilhas" className="dashboard-atm-editorial-link">Explorar acervo público ↗</Link>}
        </section>
        {can(role, "users:manage") && (
          <section className="admin-atm-dashboard-callout">
            <div>
              <span className="dashboard-atm-eyebrow">GESTÃO ADMINISTRATIVA</span>
              <h2>Convites e permissões.</h2>
              <p>Cadastre pessoas, acompanhe ativações e gerencie quem pode acessar a Biblioteca e o acervo editorial.</p>
            </div>
            <Link href="/painel/usuarios">Administrar acessos ↗</Link>
          </section>
        )}
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
