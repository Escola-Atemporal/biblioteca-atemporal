"use client";

import { useActionState } from "react";
import { approveMembership, rejectMembership, type ReviewResult } from "./review-actions";

export type MembershipRequest = {
  id: string;
  full_name: string;
  email: string;
  context: string;
  created_at: string;
};

const initial: ReviewResult = { ok: false, message: "", inviteUrl: null };

export default function RequestReviewRow({ request, emailReady }: { request: MembershipRequest; emailReady:boolean }) {
  const [approval, approve, approving] = useActionState(approveMembership, initial);
  const [rejection, reject, rejecting] = useActionState(rejectMembership, initial);
  const complete = approval.ok || rejection.ok;

  return (
    <article className="request-atm-review-item">
      <div className="request-atm-review-top">
        <div>
          <span className="request-atm-review-label">SOLICITAÇÃO PENDENTE</span>
          <h3>{request.full_name}</h3>
          <p className="request-atm-review-email">{request.email}</p>
        </div>
        <time dateTime={request.created_at}>{new Date(request.created_at).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}</time>
      </div>
      {request.context && (
        <p className="request-atm-review-context">{request.context}</p>
      )}
      <div className="request-atm-review-actions">
        <form action={approve}>
          <input type="hidden" name="requestId" value={request.id}/>
          <button type="submit" className="request-atm-approve" disabled={complete || approving || rejecting || !emailReady}>
            {approving ? "Aprovando..." : "Aprovar e enviar e-mail"} <span aria-hidden="true">↗</span>
          </button>
        </form>
        <form action={reject}>
          <input type="hidden" name="requestId" value={request.id}/>
          <button type="submit" className="request-atm-reject" disabled={complete || approving || rejecting}>
            {rejecting ? "Recusando..." : "Recusar"}
          </button>
        </form>
      </div>

      {(approval.message || rejection.message) && (
        <div className={`request-atm-review-result ${complete ? "is-success" : "is-error"}`} role="status">
          <p>{approval.message || rejection.message}</p>
        </div>
      )}
    </article>
  );
}
