import assert from "node:assert/strict";
import test from "node:test";
import {can} from "../lib/permissions.ts";

const allowed = {
  experiencialista: ["tracks:read"],
  curador: ["tracks:read", "drafts:read"],
  administrador: ["tracks:read", "drafts:read", "users:manage", "analytics:read", "emails:manage"],
};
const capabilities = ["tracks:read", "drafts:read", "users:manage", "analytics:read", "emails:manage"];
for (const [role, grants] of Object.entries(allowed)) {
  test("role capabilities: "+role, () => {
    for (const capability of capabilities)
      assert.equal(can(role, capability), grants.includes(capability), role+" / "+capability);
  });
}
test("default deny", () => {
  for (const role of [null, undefined, "", "visitor", "experiencialista-admin"])
    for (const capability of capabilities) assert.equal(can(role, capability), false);
});
