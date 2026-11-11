import BrandLogo from "../components/BrandLogo";
import Link from "next/link";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { auth, authConfigured, googleReady, passwordReady, signIn, signOut } from "../../auth";
import { roleForEmailAsync } from "../../lib/access";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Entrar na Biblioteca | Escola Atemporal",
  description: "Acesso reservado à comunidade e à equipe autorizada da Escola Atemporal.",
  robots: { index: false, follow: false },
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ erro?: string; convite?: string }>;
}) {
  const params = await searchParams;
  const session = authConfigured ? await auth() : null;
  const role = await roleForEmailAsync(session?.user?.email);
  const invalidCredentials = params?.erro === "credenciais";

  async function entrarComSenha(formData: FormData) {
    "use server";
    const email = String(formData.get("email") || "").trim().toLowerCase();
    const password = String(formData.get("password") || "");
    if (!email || !password) redirect("/entrar?erro=credenciais");
    try {
      await signIn("credentials", {
        email,
        password,
        redirectTo: "/painel",
      });
    } catch (error) {
      if (error instanceof AuthError) redirect("/entrar?erro=credenciais");
      throw error;
    }
  }

  return (
    <main className="login-atm">
      <header className="topbar login-atm-topbar">
        <BrandLogo />
        <nav aria-label="Navegação de acesso">
          <Link href="/">Explorar Biblioteca</Link>
          <Link className="nav-login" href="/#trilhas">Conhecer trilhas</Link>
        </nav>
      </header>

      <div className="login-atm-shell">
        <section className="login-atm-identity" aria-labelledby="login-atm-title">
          <span className="login-atm-eyebrow">ESCOLA ATEMPORAL / BIBLIOTECA VIVA</span>
          <div className="login-atm-narrative">
            <span className="login-atm-big" aria-hidden="true">06</span>
            <h1 id="login-atm-title">Um lugar para <em>continuar aprendendo.</em></h1>
            <p>Conhecimento para ampliar perspectivas. Experiências para transformar a maneira como escolhemos, nos relacionamos e construímos juntos.</p>
          </div>
          <div className="login-atm-foot">
            <span>PRINCÍPIOS</span>
            <span>EMOÇÕES</span>
            <span>HÁBITOS</span>
            <span>COLABORAÇÃO</span>
            <span>LIDERANÇA</span>
            <span>LEGADO</span>
          </div>
        </section>

        <section className="login-atm-form-wrap" aria-label="Acesso à área reservada">
          <div className="login-atm-panel">
            <span className="login-atm-form-eyebrow">ACESSO RESERVADO</span>
            <h2>{session?.user?.email && role ? "Sua jornada continua." : "Bem-vindo de volta."}</h2>
            <p className="login-atm-description">
              {session?.user?.email && role
                ? "Sua identidade foi confirmada. Acesse o painel ou encerre a sessão."
                : "Entre com seu e-mail e senha autorizados pela Escola Atemporal."}
            </p>

            {params?.convite === "ativado" && <p className="login-atm-notice" role="status">Seu acesso foi ativado. Entre com o e-mail e a senha que você acabou de definir.</p>}

            {session?.user?.email && role ? (
              <div className="login-atm-connected">
                <p>Você está conectado como <strong>{session.user.email}</strong>.</p>
                <span>Perfil: {role}</span>
                <Link className="login-atm-submit" href="/painel">Acessar meu painel <span aria-hidden="true">↗</span></Link>
                <form action={async () => { "use server"; await signOut({ redirectTo: "/entrar" }); }}>
                  <button type="submit" className="login-atm-secondary">Encerrar sessão</button>
                </form>
              </div>
            ) : (
              <>
                {passwordReady && (
                  <form action={entrarComSenha} className="login-atm-form">
                    <label htmlFor="biblioteca-email">E-mail</label>
                    <input
                      id="biblioteca-email"
                      type="email"
                      name="email"
                      placeholder="seuemail@exemplo.com"
                      required
                      maxLength={254}
                      autoComplete="username"
                      inputMode="email"
                    />
                    <label htmlFor="biblioteca-password">Senha</label>
                    <input
                      id="biblioteca-password"
                      type="password"
                      name="password"
                      placeholder="Digite sua senha"
                      autoComplete="current-password"
                      required
                      minLength={10}
                      maxLength={256}
                    />
                    {invalidCredentials && (
                      <p className="login-atm-error" role="alert">
                        Não foi possível entrar. Confira e-mail e senha e tente novamente. Após várias tentativas, aguarde alguns minutos.
                      </p>
                    )}
                    <button type="submit" className="login-atm-submit">Entrar no meu painel <span aria-hidden="true">↗</span></button>
                  </form>
                )}
                {googleReady && (
                  <form className="login-atm-google-form" action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/painel" });
                  }}>
                    {passwordReady && <div className="login-atm-divider"><span>ou</span></div>}
                    <button type="submit" className="login-atm-secondary">Continuar com Google <span aria-hidden="true">↗</span></button>
                  </form>
                )}
                {!authConfigured && (
                  <p className="login-atm-notice" role="status">
                    O painel está preparado, mas o primeiro acesso ainda precisa ser ativado pela administração da Escola.
                  </p>
                )}
              </>
            )}

            {(!session?.user?.email || !role) && (
              <div className="login-atm-membership">
                <p>Ainda não recebeu um convite?</p>
                <Link href="/solicitar-acesso">Solicitar participação na Biblioteca <span aria-hidden="true">↗</span></Link>
              </div>
            )}

            <div className="login-atm-security">
              <span aria-hidden="true">●</span>
              <p>O acesso é individual e depende de autorização da Escola. As minutas editoriais e os arquivos privados seguem suas próprias permissões.</p>
            </div>
            <Link href="/" className="login-atm-back">← Voltar à Biblioteca Atemporal</Link>
          </div>
        </section>
      </div>
    </main>
  );
}
