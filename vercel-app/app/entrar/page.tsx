import Link from "next/link";
import { auth, authConfigured, signIn, signOut } from "../../auth";
import { roleForEmail } from "../../lib/access";

export const dynamic = "force-dynamic";
export default async function Login() {
  const session = authConfigured ? await auth() : null;
  const role = roleForEmail(session?.user?.email);
  return <main><header className="topbar"><Link className="brand" href="/">✳ ESCOLA ATEMPORAL <span> / BIBLIOTECA</span></Link></header><section className="login-shell"><div className="login-panel"><span className="eyebrow dark">ACESSO À BIBLIOTECA</span><h1>Seu espaço de <em>aprendizagem.</em></h1><p>O acesso às áreas internas é reservado a pessoas autorizadas pela Escola Atemporal.</p>
  {session?.user?.email && role ? <><div className="notice">Conectado como <strong>{session.user.email}</strong> · {role}</div><Link href="/painel" className="primary">Ir para meu painel ↗</Link><form action={async()=>{"use server";await signOut({redirectTo:"/"});}}><button className="text-button" type="submit">Sair</button></form></>
  : authConfigured ? <form action={async()=>{"use server";await signIn("google",{redirectTo:"/painel"});}}><button type="submit" className="primary">Continuar com Google ↗</button></form>
  : <div className="notice">O login ainda não foi ativado. É necessário configurar o Google OAuth e a lista de acesso na Vercel.</div>}
  <small>Entrar com uma conta Google não concede acesso automaticamente: o e-mail precisa estar autorizado.</small><Link href="/" className="back">← Voltar à biblioteca</Link></div></section></main>;
}
