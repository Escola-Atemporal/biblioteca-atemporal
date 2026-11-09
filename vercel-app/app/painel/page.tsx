import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, authConfigured, signOut } from "../../auth";
import { roleForEmail } from "../../lib/access";
export const dynamic = "force-dynamic";

export default async function Painel() {
  if (!authConfigured) redirect("/entrar");
  const session = await auth();
  if (!session?.user?.email) redirect("/entrar");
  const role = roleForEmail(session.user.email);
  if (!role) redirect("/entrar");
  const canCurate = role === "administrador" || role === "curador";
  return <main><header className="topbar"><Link className="brand" href="/">✳ ESCOLA ATEMPORAL <span> / BIBLIOTECA</span></Link><nav><Link href="/">Biblioteca pública</Link></nav></header>
    <section className="dashboard"><span className="eyebrow dark">ESPAÇO RESTRITO · {role.toUpperCase()}</span><h1>Bem-vindo ao seu <em>acervo.</em></h1><p>Identidade verificada: {session.user.email}</p><div className="dashboard-grid"><article className="dashboard-card"><span>01</span><h2>Minhas trilhas</h2><p>Explore as seis jornadas e seus conteúdos públicos.</p><Link href="/#trilhas">Ver trilhas ↗</Link></article><article className="dashboard-card"><span>02</span><h2>Acervo autorizado</h2><p>O acesso a materiais internos será liberado somente após a integração de fontes e direitos.</p><strong>Em preparação</strong></article>{canCurate && <article className="dashboard-card"><span>03</span><h2>Curadoria editorial</h2><p>Área reservada a profissionais da curadoria. Edição e publicação ainda não estão habilitadas.</p><strong>Em preparação</strong></article>}</div><form action={async()=>{"use server";await signOut({redirectTo:"/"});}}><button className="text-button" type="submit">Encerrar sessão →</button></form></section>
  </main>;
}
