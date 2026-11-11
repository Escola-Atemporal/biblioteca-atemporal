"use client";

import { useActionState } from "react";
import { submitAccessRequest, type AccessRequestState } from "./actions";

const initial: AccessRequestState = { ok: false, message: "" };

export default function AccessRequestForm() {
  const [state, action, pending] = useActionState(submitAccessRequest, initial);

  return (
    <form action={action} className="request-atm-form">
      <label htmlFor="request-member-name">Nome completo</label>
      <input id="request-member-name" name="name" type="text" autoComplete="name"
        minLength={2} maxLength={120} placeholder="Como podemos chamar você?" required />

      <label htmlFor="request-member-email">E-mail para contato</label>
      <input id="request-member-email" name="email" type="email" autoComplete="email"
        maxLength={254} placeholder="nome@exemplo.com" required />

      <label htmlFor="request-member-context">O que motiva seu interesse? <span>(opcional)</span></label>
      <textarea id="request-member-context" name="context" rows={3} maxLength={450}
        placeholder="Conte brevemente como gostaria de participar da comunidade." />

      <div className="request-atm-honeypot" aria-hidden="true">
        <label htmlFor="request-member-website">Site pessoal</label>
        <input id="request-member-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="request-atm-consent">
        <input type="checkbox" name="privacyAck" value="yes" required />
        <span>Autorizo a Escola Atemporal a utilizar meu nome, e-mail e mensagem exclusivamente para avaliar esta solicitação de acesso e responder sobre o resultado. Não estou autorizando mensagens promocionais.</span>
      </label>

      {state.message && <p className={state.ok ? "request-atm-response is-ok" : "request-atm-response"} role="status">{state.message}</p>}
      <button className="request-atm-submit" type="submit" disabled={pending || state.ok}>
        {pending ? "Enviando solicitação..." : state.ok ? "Solicitação recebida" : "Solicitar avaliação"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="request-atm-footnote">Este pedido não cria uma conta automaticamente. O acesso depende de aprovação individual, e os conteúdos internos continuam sujeitos às permissões da Escola.</p>
    </form>
  );
}
