/**
 * Behavior tests on the actual pure authorization function.
 * No real users, database access, secrets, or HTTP requests.
 */
import assert from "node:assert/strict";
import { resolveIndividualDecision } from "../lib/individual-access-policy.ts";
const roles = [null, "experiencialista", "curador", "administrador"];
const overrides = [null, true, false];
let count = 0;
for (const role of roles) {
 for (const inherited of [true, false]) {
  for (const override of overrides) {
   const actual = resolveIndividualDecision(role, inherited, override);
   const expected = role === null ? false :
     role === "administrador" || override === null ? inherited : override;
   assert.equal(actual, expected,
     "Permissao inesperada: " + JSON.stringify({ role, inherited, override }));
   count++;
  }
 }
}
assert.equal(resolveIndividualDecision("experiencialista", true, false), false);
assert.equal(resolveIndividualDecision("experiencialista", false, true), true);
assert.equal(resolveIndividualDecision("administrador", true, false), true);
assert.equal(resolveIndividualDecision("administrador", false, true), false);
console.log("OK: " + count + " cenarios de autorizacao individual (sem contas reais).");
