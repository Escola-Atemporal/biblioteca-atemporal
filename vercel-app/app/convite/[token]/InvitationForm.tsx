"use client";

import { useActionState } from "react";
import { activateInvitation } from "./actions";

const initial = { ok: false, message: "" };

export default function InvitationForm({ token, email }: { token: string; email: string }) {
  const [state, action, pending] = useActionState(activateInvitation, initial);
  return (
    <form action={action} className="admin-atm-activation-form">
      <input type="hidden" name="token" value={token} />
      <label>
        E-mail convidado
        <input type="email" value={email} readOnly aria-readonly="true" />
      </label>
      <label>
        Defina sua senha
        <input name="password" type="password" placeholder="Pelo menos 12 caracteres" minLength={12} maxLength={256} autoComplete="new-password" required />
      </label>
      <label>
        Confirme sua senha
        <input name="confirmation" type="password" placeholder="Repita a senha" minLength={12} maxLength={256} autoComplete="new-password" required />
      </label>
      {state.message && <p className="admin-atm-activation-error" role="alert">{state.message}</p>}
      <button className="admin-atm-primary" type="submit" disabled={pending}>{pending ? "Ativando..." : "Ativar meu acesso"} <span aria-hidden="true">↗</span></button>
    </form>
  );
}
