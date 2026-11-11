"use client";

import { useActionState } from "react";
import { createAccessInvite, type InviteResult } from "./actions";

const initial: InviteResult = { ok: false, message: "", inviteUrl: null };

export default function InviteControls({emailReady,manualReady}:{emailReady:boolean;manualReady:boolean}) {
  const [state, action, pending] = useActionState(createAccessInvite, initial);
  return (
    <div className="admin-atm-invite">
      <div className="admin-atm-invite-head">
        <span className="admin-atm-eyebrow">NOVO ACESSO</span>
        <h2>Convidar uma pessoa.</h2>
        <p>Cadastre o nome, o e-mail e o perfil. Após a criação, o participante recebe um convite individual para definir sua senha. Durante a verificação do Google, a administração copia o link e o envia por e-mail.</p>
      </div>
      {!emailReady && <p className="login-atm-notice">{manualReady
        ? "Modo provisório: somente convites individuais para experiencialistas, enviados manualmente por e-mail. O cadastro público continua fechado."
        : "Os convites estão bloqueados até a autorização da administração."}</p>}
      <form action={action} className="admin-atm-form">
        <div className="admin-atm-fields">
          <label>
            Nome
            <input name="name" type="text" placeholder="Nome da pessoa" required minLength={2} maxLength={120} autoComplete="off" />
          </label>
          <label>
            E-mail
            <input name="email" type="email" placeholder="nome@exemplo.com" required maxLength={254} autoComplete="off" />
          </label>
          <label>
            Perfil
            <select name="role" defaultValue="experiencialista" required>
              <option value="experiencialista">Experiencialista</option>
              {emailReady && <option value="curador">Curador</option>}
              {emailReady && <option value="administrador">Administrador</option>}
            </select>
          </label>
        </div>
        <button className="admin-atm-primary" type="submit" disabled={pending || (!emailReady && !manualReady)}>
          {pending ? "Criando convite..." : emailReady ? "Criar e enviar convite por e-mail" : "Gerar convite individual"} <span aria-hidden="true">↗</span>
        </button>
      </form>
      {state.ok && state.inviteUrl && (
        <div className="admin-atm-feedback admin-atm-success" role="status">
          <label htmlFor="link-convite-individual"><strong>Link de ativação — exibição única</strong></label>
          <input id="link-convite-individual" type="text" readOnly value={state.inviteUrl}
            onFocus={(event)=>event.currentTarget.select()} style={{width:"100%",padding:12,marginTop:10}}/>
          <button type="button" className="admin-atm-primary" style={{marginTop:12}}
            onClick={()=>navigator.clipboard.writeText(state.inviteUrl!).catch(()=>{})}>
            Copiar link do convite
          </button>
          <p>Envie esse link apenas para o e-mail informado. Não o publique em grupos ou páginas abertas. Se fechar esta tela, será necessário gerar outro convite.</p>
        </div>
      )}
      {state.message && (
        <div className={`admin-atm-feedback ${state.ok ? "admin-atm-success" : "admin-atm-failure"}`} role="status">
          <strong>{state.message}</strong>
        </div>
      )}
    </div>
  );
}
