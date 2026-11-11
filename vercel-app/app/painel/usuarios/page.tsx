import BrandLogo from "../../components/BrandLogo";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, authConfigured, signOut } from "../../../auth";
import { roleForEmailAsync } from "../../../lib/access";
import { dbQuery, databaseConfigured } from "../../../lib/database";
import InviteControls from "./InviteControls";
import { setAccountActive, changeAccountRole } from "./actions";
import RequestReviewRow, { type MembershipRequest } from "./RequestReviewRow";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Gerenciar acessos | Escola Atemporal",
  description: "Administração de convites e perfis da Biblioteca Atemporal.",
  robots: { index: false, follow: false },
};

type MemberRow = {
  email: string;
  display_name: string;
  role: string;
  active: boolean;
  has_password: boolean;
  created_at: string;
};
type SummaryRow = { pending: string };

export default async function UsersPanel() {
  if (!authConfigured) redirect("/entrar");
  const session = await auth();
  const email = session?.user?.email;
  if (!email) redirect("/entrar");
  if ((await roleForEmailAsync(email)) !== "administrador") redirect("/painel");
  if (!databaseConfigured) {
    return <main className="admin-atm-page"><header className="topbar login-atm-topbar"><BrandLogo/></header><section className="admin-atm-container"><h1>Gestão de usuários</h1><p>O banco de usuários ainda precisa ser conectado ao serviço de hospedagem.</p><Link href="/painel">← Voltar ao painel</Link></section></main>;
  }
  let users: MemberRow[] = [];
  let pending = 0;
  let requests: MembershipRequest[] = [];
  let databaseUnavailable = false;
  try {
    [users, pending, requests] = await Promise.all([
      dbQuery<MemberRow>(
        `SELECT email,display_name,role,active,(password_hash IS NOT NULL) AS has_password,created_at
         FROM biblioteca_access_accounts ORDER BY created_at DESC LIMIT 300`,
      ),
      dbQuery<SummaryRow>(
        "SELECT count(*)::text AS pending FROM biblioteca_access_invites WHERE used_at IS NULL AND expires_at>now()",
      ).then((r) => Number(r[0]?.pending ?? 0)),
      dbQuery<MembershipRequest>(
        `SELECT id,full_name,email,context,created_at::text AS created_at
         FROM biblioteca_membership_requests
         WHERE status='pending' ORDER BY created_at ASC LIMIT 100`,
      ),
    ]);
  } catch { databaseUnavailable = true; }

  return (
    <main className="admin-atm-page">
      <header className="topbar login-atm-topbar">
        <BrandLogo/>
        <nav aria-label="Navegação administrativa">
          <Link href="/painel">Meu painel</Link>
          <form action={async () => { "use server"; await signOut({redirectTo:"/entrar"}); }}>
            <button className="dashboard-atm-logout" type="submit">Sair ↗</button>
          </form>
        </nav>
      </header>
      <section className="admin-atm-hero">
        <div className="admin-atm-container">
          <span className="admin-atm-eyebrow">ESCOLA ATEMPORAL · ADMINISTRAÇÃO</span>
          <h1>Gestão de <em>acessos.</em></h1>
          <p>Convide pessoas, acompanhe a ativação das contas e defina quem pode acessar cada área da Biblioteca.</p>
          <div className="admin-atm-facts">
            <span><strong>{users.length}</strong> usuários cadastrados no banco</span>
            <span><strong>{requests.length}</strong> pedidos aguardando avaliação</span>
            <span><strong>{pending}</strong> convites pendentes</span>
            <span><strong>03</strong> perfis de autorização</span>
          </div>
        </div>
      </section>
      <div className="admin-atm-container admin-atm-main">
        {databaseUnavailable ? (
          <div role="alert" className="admin-atm-feedback admin-atm-failure">
            O banco de dados não respondeu. Nenhuma alteração foi realizada. Tente novamente mais tarde.
          </div>
        ) : (
          <>
            <section className="request-atm-review-section" id="solicitacoes" aria-labelledby="request-atm-review-title">
              <div className="admin-atm-section-head">
                <div>
                  <span className="admin-atm-eyebrow">SOLICITAÇÕES DE PARTICIPAÇÃO</span>
                  <h2 id="request-atm-review-title">Avaliar novos membros.</h2>
                </div>
                <div className="request-atm-review-intro">
                  <p>Pedidos recebidos pelo formulário público. Aprovar gera um convite pessoal de ativação; não libera a conta imediatamente.</p>
                  <Link href="/painel/usuarios#solicitacoes">Atualizar solicitações ↗</Link>
                </div>
              </div>
              {requests.length ? (
                <div className="request-atm-review-list">
                  {requests.map((request) => <RequestReviewRow key={request.id} request={request}/>)}
                </div>
              ) : (
                <div className="admin-atm-empty">Não há solicitações aguardando análise. O formulário público pode ser acessado em <Link href="/solicitar-acesso">Solicitar participação ↗</Link>.</div>
              )}
              <p className="admin-atm-privacy">Somente administradores podem aprovar ou recusar solicitações. Os convites devem ser compartilhados individualmente e não concedem acesso aos PDFs em revisão.</p>
            </section>

            <InviteControls />
            <section className="admin-atm-people" aria-labelledby="admin-atm-people-title">
              <div className="admin-atm-section-head">
                <div>
                  <span className="admin-atm-eyebrow">CONTROLE DE PERMISSÕES</span>
                  <h2 id="admin-atm-people-title">Pessoas cadastradas.</h2>
                </div>
                <p>Alterações de papel e de situação são aplicadas no banco e passam a valer na próxima requisição autenticada.</p>
              </div>
              {!users.length ? (
                <p className="admin-atm-empty">Ainda não há contas persistentes. Sua conta administradora inicial permanece autorizada pelo Render. Use o formulário acima para convidar a primeira pessoa.</p>
              ) : (
                <div className="admin-atm-table-wrap">
                  <table className="admin-atm-table">
                    <thead><tr><th scope="col">Pessoa</th><th scope="col">Perfil</th><th scope="col">Situação</th><th scope="col">Ação</th></tr></thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.email}>
                          <td><strong>{u.display_name}</strong><span>{u.email}</span></td>
                          <td>
                            {u.email === email?.trim().toLowerCase() ? <strong>{u.role}</strong> : (
                              <form action={changeAccountRole} className="admin-atm-inline">
                                <input name="email" type="hidden" value={u.email}/>
                                <select name="role" defaultValue={u.role} aria-label={`Alterar perfil de ${u.display_name}`}>
                                  <option value="experiencialista">Experiencialista</option>
                                  <option value="curador">Curador</option>
                                  <option value="administrador">Administrador</option>
                                </select>
                                <button type="submit">Salvar</button>
                              </form>
                            )}
                          </td>
                          <td>
                            <span className={`admin-atm-state ${u.active && u.has_password ? "is-active" : ""}`}>
                              {u.active && u.has_password ? "Ativo" : !u.has_password ? "Aguardando senha" : "Desativado"}
                            </span>
                          </td>
                          <td>
                            {u.email === email?.trim().toLowerCase() ? <span>Esta conta</span> : !u.has_password ? (
                              <span>Aguardando ativação pelo convite</span>
                            ) : (
                              <form action={setAccountActive} className="admin-atm-inline">
                                <input name="email" type="hidden" value={u.email}/>
                                <input name="action" type="hidden" value={u.active ? "deactivate" : "activate"}/>
                                <button type="submit">{u.active ? "Desativar" : "Reativar"}</button>
                              </form>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="admin-atm-privacy">Somente administradores podem alterar contas. O acesso aos arquivos do Google Drive continua sujeito às permissões dos documentos. A ativação de login não equivale à aprovação dos e-books para distribuição.</p>
            </section>
          </>
        )}
        <Link href="/painel" className="admin-atm-back">← Retornar ao meu painel</Link>
      </div>
    </main>
  );
}
