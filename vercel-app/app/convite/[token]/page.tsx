import { createHash } from "node:crypto";
import BrandLogo from "../../components/BrandLogo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { databaseConfigured, dbQuery } from "../../../lib/database";
import InvitationForm from "./InvitationForm";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Ativar acesso | Biblioteca Atemporal",
  robots: { index: false, follow: false },
};

type InviteRow = { email: string; display_name: string; role: string };
const tokenPattern = /^[A-Za-z0-9_-]{43}$/;

export default async function InvitationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!databaseConfigured || !tokenPattern.test(token)) notFound();
  const hash = createHash("sha256").update(token).digest("hex");
  let invite: InviteRow | undefined;
  try {
    [invite] = await dbQuery<InviteRow>(
      `SELECT i.email,a.display_name,a.role
       FROM biblioteca_access_invites i
       JOIN biblioteca_access_accounts a ON a.email=i.email
       WHERE i.token_hash=$1 AND i.used_at IS NULL AND i.expires_at>now()
       LIMIT 1`,
      [hash],
    );
  } catch { notFound(); }
  if (!invite) {
    return (
      <main className="login-atm">
        <header className="topbar login-atm-topbar"><BrandLogo /></header>
        <div className="admin-atm-activation">
          <div className="admin-atm-activation-panel">
            <span className="admin-atm-eyebrow">ESCOLA ATEMPORAL · CONVITE</span>
            <h1>Este convite não está mais disponível.</h1>
            <p>Ele pode ter expirado ou já ter sido utilizado. Solicite um novo link à administração da Escola.</p>
            <Link href="/entrar" className="admin-atm-primary">Voltar ao login ↗</Link>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="login-atm">
      <header className="topbar login-atm-topbar"><BrandLogo /></header>
      <div className="admin-atm-activation">
        <div className="admin-atm-activation-panel">
          <span className="admin-atm-eyebrow">ESCOLA ATEMPORAL · ATIVAÇÃO DE ACESSO</span>
          <h1>Sua jornada <em>começa aqui.</em></h1>
          <p>Olá, <strong>{invite.display_name}</strong>. Você recebeu um convite para acessar a Biblioteca Atemporal com o perfil <strong>{invite.role}</strong>.</p>
          <p>Defina uma senha pessoal. O convite expira em 48 horas e só pode ser utilizado uma vez.</p>
          <InvitationForm token={token} email={invite.email} />
          <Link href="/" className="admin-atm-back">← Conhecer a Biblioteca</Link>
        </div>
      </div>
    </main>
  );
}
