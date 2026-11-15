/** Static authorization-regression checks.
 * These are guardrail checks, not authenticated end-to-end tests.
 * Keep them inside prebuild so regressions block deployment.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const read = path => readFileSync(join(root,path),"utf8");
const slugs = [
 "principios-e-discernimento",
 "emocoes-e-autoconsciencia",
 "autoconhecimento-e-habitos",
 "confianca-e-colaboracao",
 "paradoxos-da-lideranca",
 "resultados-e-legado",
];
let checked = 0;
function assertGuard(condition, message) {
 if (!condition) {
  console.error("ERRO DE SEGURANCA: " + message);
  process.exitCode = 1;
 } else checked++;
}
for (const slug of slugs) {
 const source=read("app/trilhas/"+slug+"/page.tsx");
 assertGuard(source.includes('permittedTrail(session?.user?.email,"'+slug+'")') &&
  source.includes('redirect("/painel?acesso=restrito")'),
  "A trilha "+slug+" precisa validar permissao individual antes de renderizar.");
}
const progress=read("app/painel/progresso/actions.ts");
assertGuard(progress.includes("await permittedTrail(email,slug)") &&
 progress.indexOf("await permittedTrail(email,slug)")<progress.indexOf("INSERT INTO biblioteca_learning_progress"),
 "A gravacao de progresso exige validacao individual no servidor.");

const notes=read("app/painel/caderno/actions.ts");
assertGuard(notes.includes("await permittedTrail(email,trail)") &&
 notes.indexOf("await permittedTrail(email,trail)")<notes.indexOf("UPDATE biblioteca_reflection_notes") &&
 notes.indexOf("await permittedTrail(email,trail)")<notes.indexOf("INSERT INTO biblioteca_reflection_notes"),
 "A gravacao do caderno exige validacao individual antes do SQL.");
assertGuard(notes.includes("WHERE id=$4::uuid AND email=$5") &&
 notes.includes("WHERE id=$1::uuid AND email=$2"),
 "Alteracao/exclusao das reflexoes precisa restringir por email do autor.");

const notebook=read("app/painel/caderno/page.tsx");
assertGuard(notebook.includes("allowedTrails=LEARNING_TRAILS.filter") &&
 notebook.includes("{allowedTrails.map") &&
 notebook.includes("allowedTrails.some("),
 "O editor do caderno deve exibir apenas trilhas autorizadas.");

const memberDashboard=read("app/painel/page.tsx");
assertGuard(memberDashboard.includes("permittedTrail(currentEmail,t.slug)") &&
 memberDashboard.includes("permittedEmail(session.user.email"),
 "O painel precisa respeitar acessos individuais aos recursos.");

const editorial=read("app/arquivos/page.tsx");
assertGuard(editorial.includes('permittedEmail(session.user.email, "drafts:read")'),
 "O acervo editorial precisa consultar permissao individual.");
const admin=read("app/painel/usuarios/individual-actions.ts");
assertGuard(admin.includes('can(await roleForEmailAsync(actor),"users:manage")') &&
 admin.includes('target.rows[0].role==="administrador"'),
 "Somente administradores podem alterar acesso individual; perfis admin nao recebem overrides.");

if (!process.exitCode) console.log("OK: "+checked+" verificacoes estaticas de protecao de acesso.");
