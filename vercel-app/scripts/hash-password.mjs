#!/usr/bin/env node
/**
 * Gera hash scrypt para contas autorizadas da Biblioteca.
 * Lê a senha exclusivamente de STDIN, sem armazená-la em código ou logs.
 * Exemplo POSIX:
 *   read -rs -p "Senha: " BIB_SENHA; echo
 *   printf '%s' "$BIB_SENHA" | node scripts/hash-password.mjs
 *   unset BIB_SENHA
 */
import { randomBytes, scryptSync } from "node:crypto";

const chunks = [];
for await (const chunk of process.stdin) chunks.push(Buffer.from(chunk));
const password = Buffer.concat(chunks).toString("utf8").replace(/[\r\n]+$/, "");

if (password.length < 12 || password.length > 256) {
  process.stderr.write("A senha deve conter entre 12 e 256 caracteres.\n");
  process.exit(1);
}
const salt = randomBytes(16);
const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
process.stdout.write(`scrypt:16384:8:1:${salt.toString("hex")}:${hash.toString("hex")}\n`);
