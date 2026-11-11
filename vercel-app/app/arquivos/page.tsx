import { can } from "../../lib/permissions";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, authConfigured } from "../../auth";
import { roleForEmailAsync } from "../../lib/access";
import { getDriveCatalog } from "../../lib/drive-catalog";
import BrandLogo from "../components/BrandLogo";
import PresenceHeartbeat from "../components/PresenceHeartbeat";
import ArquivosCatalogo from "./ArquivosCatalogo";
import "./arquivos.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Arquivos da Biblioteca | Escola Atemporal",
  description: "E-books, guias e materiais de apoio da Biblioteca Atemporal.",
  robots: { index: false, follow: false },
};

export default async function ArquivosPage() {
  if (!authConfigured) redirect("/entrar");
  const session = await auth();
  const role = await roleForEmailAsync(session?.user?.email);
  if (!session?.user?.email || !role) redirect("/entrar");
  const canReviewDrafts = can(role, "drafts:read");
  const index = canReviewDrafts ? getDriveCatalog() : null;

  return (
    <main className="dashboard-atm arquivos-atm">
      <PresenceHeartbeat section="Arquivos" />
      <header className="topbar login-atm-topbar">
        <BrandLogo />
        <nav aria-label="Navegação dos arquivos">
          <Link href="/">Biblioteca</Link>
          <Link href="/painel" className="nav-login">Meu painel ↗</Link>
        </nav>
      </header>
      <section className="dashboard-atm-hero arquivos-hero">
        <div className="dashboard-atm-container">
          <span className="dashboard-atm-eyebrow">BIBLIOTECA ATEMPORAL / ARQUIVOS</span>
          <h1>Repertório para <em>levar adiante.</em></h1>
          <p>E-books, guias e perguntas que aproximam o conhecimento da experiência. Encontre aqui os materiais organizados pela Escola.</p>
          {index && <div className="arquivos-numbers"><span><strong>{index.files.length}</strong> ARQUIVOS</span><span><strong>{index.folders.length}</strong> PASTAS</span><span><strong>{String(index.files.filter(file => file.mimeType === "application/pdf").length).padStart(2, "0")}</strong> E-BOOKS AUTORAIS</span></div>}
        </div>
      </section>
      <div className="dashboard-atm-container arquivos-body">
        {canReviewDrafts ? index ? <ArquivosCatalogo index={index} /> : <section className="arquivos-notice" role="status"><h2>Catálogo temporariamente indisponível.</h2><p>Os materiais precisam ser conferidos pela administração. Tente novamente mais tarde.</p></section> : (
          <section className="arquivos-notice" aria-labelledby="arquivos-revisao">
            <span className="dashboard-atm-eyebrow dark">CURADORIA EM ANDAMENTO</span>
            <h2 id="arquivos-revisao">Materiais em preparação.</h2>
            <p>Esta pasta reúne minutas e documentos internos. A consulta está reservada à administração e à curadoria enquanto a distribuição dos materiais é revisada.</p>
            <Link href="/#trilhas">Explorar as trilhas disponíveis ↗</Link>
          </section>
        )}
        <p className="arquivos-return"><Link href="/painel">← Voltar ao meu painel</Link></p>
      </div>
    </main>
  );
}
