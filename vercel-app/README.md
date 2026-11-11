# Biblioteca Atemporal — Escola Atemporal

Aplicação Next.js em `vercel-app/`, publicada no **Render** a partir do repositório `Escola-Atemporal/biblioteca-atemporal`.

## Visibilidade do acervo

- Página inicial e seis trilhas: públicas.
- `/entrar`: login por e-mail e senha, com alternativa Google quando configurada.
- `/painel`: exige uma sessão autenticada e um perfil autorizado.
- PDFs autorais ainda em **minuta interna**: os links no Drive são apresentados no servidor somente para `administrador` e `curador`; visitantes e `experiencialista` veem aviso de revisão.
- **Importante**: o login na Biblioteca não concede permissão no Google Drive. Manter os PDFs restritos no Drive e revisar as permissões antes de publicar.

## Variáveis no Render

Definir em Render > Serviço Biblioteca > Environment (NUNCA no GitHub):

| Variável | Função |
|---|---|
| `AUTH_SECRET` | Segredo aleatório forte de autenticação (mínimo 32 bytes) |
| `AUTH_URL` | `https://biblioteca-atemporal-web.onrender.com` |
| `AUTH_TRUST_HOST` | `true` |
| `BIBLIOTECA_PASSWORD_USERS` | Array JSON de usuários autorizados, com hash de senha |
| `AUTH_GOOGLE_ID` | Opcional: ID de cliente Google OAuth |
| `AUTH_GOOGLE_SECRET` | Opcional: segredo de cliente Google OAuth |
| `BIBLIOTECA_ADMIN_EMAILS` | Opcional: lista CSV de e-mails administradores com Google |
| `BIBLIOTECA_CURATOR_EMAILS` | Opcional: lista CSV de curadores com Google |
| `BIBLIOTECA_MEMBER_EMAILS` | Opcional: lista CSV de membros com Google |

Exemplo de estrutura (NÃO é uma conta real nem uma senha válida):

```json
[
  {
    "email": "usuario@exemplo.com",
    "role": "administrador",
    "name": "Equipe Editorial",
    "passwordHash": "scrypt:16384:8:1:...salt...:...hash..."
  }
]
```

Perfis: `administrador`, `curador`, `experiencialista`.

Para gerar hashes a partir de senha digitada sem exibir a senha no histórico do terminal:

```sh
read -rs -p "Senha: " BIB_SENHA; echo
printf '%s' "$BIB_SENHA" | node scripts/hash-password.mjs
unset BIB_SENHA
```

Copiar apenas o hash para `BIBLIOTECA_PASSWORD_USERS`. Nunca guardar a senha em código, commits, capturas de tela ou variáveis `NEXT_PUBLIC_`.

## Segurança implementada

- Auth.js / NextAuth com JWT assinado, validade de oito horas.
- Scrypt com sal aleatório para senhas, comparação em tempo constante.
- Contas autorizadas por perfil, sem cadastro público.
- Limitação local de sete tentativas inválidas por e-mail em quinze minutos.
- Login por Google exige e-mail verificado.
- Sessões e papéis são conferidos nas rotas restritas.
- URLs do Drive para minutas não são renderizadas para usuários sem perfil editorial.

**Limite atual:** a lista de contas com senha é administrada por variável de ambiente. Alterar senhas, cadastrar membros e revogar acessos requer alterar a configuração no Render e publicar novamente. Para escalar ou criar um painel de gestão de membros com redefinição de senha, migrar a autenticação de usuários para uma base com armazenamento persistente e limitação distribuída de tentativas.

## Deploy e testes

O Render utiliza a branch `main` e o comando:

```sh
cd vercel-app && npm install --no-audit --no-fund && npm run build
```

Com autoDeploy desativado, é necessário iniciar um deploy no painel do Render depois de alterar o código ou variáveis.

Validações recomendadas:
1. `npm run build` aprovado.
2. Login correto de administrador e entrada em `/painel`.
3. Senha incorreta rejeitada sem revelar existência da conta.
4. `/painel` inacessível sem autenticação.
5. Minutas não visíveis para visitante ou perfil `experiencialista`.
6. Logout encerra a sessão, e URLs do Drive respeitam suas permissões próprias.
