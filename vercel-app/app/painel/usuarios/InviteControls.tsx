"use client";

import { useActionState } from "react";
import { createAccessInvite, type InviteResult } from "./actions";

const initial: InviteResult = { ok: false, message: "", inviteUrl: null };

export default function InviteControls() {
  const [state, action, pending] = useActionState(createAccessInvite, initial);
  return (
    <div className="admin-atm-invite">
      <div className="admin-atm-invite-head">
        <span className="admin-atm-eyebrow">NOVO ACESSO</span>
        <h2>Convidar uma pessoa.</h2>
        <p>Cadastre o nome, o e-mail e o perfil. Após a criação, o sistema envia automaticamente um convite individual para a pessoa definir sua senha.</p>
      </div>
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
              <option value="curador">Curador</option>
              <option value="administrador">Administrador</option>
            </select>
          </label>
        </div>
        <button className="admin-atm-primary" type="submit" disabled={pending}>
          {pending ? "Enviando..." : "Criar e enviar convite por e-mail"} <span aria-hidden="true">↗</span>
        </button>
      </form>
      {state.message && (
        <div className={`admin-atm-feedback ${state.ok ? "admin-atm-success" : "admin-atm-failure"}`} role="status">
          <strong>{state.message}</strong>
        </div>
      )}
    </div>
  );
}
