/**
 * Regression tests for learning trail catalog and progress sections.
 * Uses only the real public catalog, with no database or user information.
 */
import assert from "node:assert/strict";
import { LEARNING_TRAILS, resolveTrail, validSection } from "../lib/learning-progress.ts";

const expectedSlugs=[
 "principios-e-discernimento",
 "emocoes-e-autoconsciencia",
 "autoconhecimento-e-habitos",
 "confianca-e-colaboracao",
 "paradoxos-da-lideranca",
 "resultados-e-legado",
];
assert.deepEqual(LEARNING_TRAILS.map(t=>t.slug),expectedSlugs,"As seis trilhas devem continuar registradas na ordem oficial.");
let count=1;
for(const trail of LEARNING_TRAILS) {
 assert.equal(resolveTrail(trail.slug)?.slug,trail.slug,trail.slug+" precisa ser identificavel.");
 count++;
 assert.ok(trail.sections.length>=5,trail.slug+" precisa possuir percurso editorial.");
 count++;
 const ids=trail.sections.map(([id])=>id);
 assert.equal(new Set(ids).size,ids.length,"Secoes nao podem repetir IDs: "+trail.slug);
 count++;
 for(const [id,label] of trail.sections) {
   assert.equal(validSection(trail.slug,id),true,"Secao legitima deve ser reconhecida: "+trail.slug+"/"+id);
   assert.equal(Boolean(label.trim()),true,"Toda secao precisa ter rotulo: "+trail.slug+"/"+id);
   count+=2;
 }
 for(const invalid of ["","__invalid__","../../painel","bibliografia-filtros"]) {
   // bibliografia-filtros eh uma ancora de componente, nao uma etapa do progresso.
   assert.equal(validSection(trail.slug,invalid),false,"Etapa nao reconhecida precisa ser recusada: "+trail.slug+"/"+invalid);
   count++;
 }
}
assert.equal(resolveTrail("__invalid__"),undefined);
assert.equal(validSection("__invalid__","investigacao"),false);
count+=2;
console.log("OK: "+count+" verificacoes reais do catalogo e secoes de progresso.");
