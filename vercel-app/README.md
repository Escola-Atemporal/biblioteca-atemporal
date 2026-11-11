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


## Gestão de usuários e convites (Novembro/2026)

Os usuários adicionais agora podem ser registrados no Neon, projeto `biblioteca-atemporal` (`aged-pine-47973990`). A conta administrativa de bootstrap permanece definida no Render para preservar a entrada inicial durante a migração.

1. Entre na Biblioteca com a conta administradora.
2. Abra `/painel/usuarios` (ou o card **Convites e permissões**).
3. Informe nome, e-mail e perfil. A administração recebe um link de convite de uso único, válido por **48 horas**.
4. Envie o link diretamente à pessoa. O sistema **não envia e-mails automaticamente**.
5. A pessoa abre `/convite/[token]`, define uma senha de 12 ou mais caracteres e usa `/entrar`.
6. O administrador pode consultar usuários, alterar perfis, desativar ou reativar acessos e emitir um novo convite para redefinição de senha.

### Modelagem e segurança

- `biblioteca_access_accounts` — usuários, papéis, status ativo e senha em hash scrypt.
- `biblioteca_access_invites` — token mantido apenas como SHA-256, validade e consumo único.
- `biblioteca_access_audit` — histórico de convites, ativação, revogação e troca de papéis.
- `DATABASE_URL` — conexão privada ao Neon configurada no Render, **nunca no GitHub**.
- A autenticação antiga por senha (conta de bootstrap) e a opção Google continuam disponíveis.
- Na autorização, um registro inativo no banco prevalece sobre a lista legada do Render; falhas de conexão não permitem contornar uma revogação.
- Consultas são parametrizadas, e as escritas de convites/ativação usam transações.
- O login público não permite autoinscrição. Não se altera o acesso dos documentos no Drive.
- O administrador não pode desativar ou mudar o próprio perfil na lista de contas.
- A limitação atual de tentativas por e-mail reside na instância da aplicação; antes de expansão horizontal, migrar para limitador distribuído por usuário e endereço de origem.
- Os convites carregam uma credencial temporária no link; compartilhar apenas por canal privado e não publicar links em grupos.

### Testes da implantação

Além do build e da verificação de imagens, validar com um convite de teste autorizado:

1. `/painel/usuarios` redireciona visitantes não autenticados e perfis não administrativos.
2. O convite é único, expira em 48 horas e o mesmo link não funciona após aceito.
3. A pessoa escolhe a própria senha, consegue entrar e não vê e-books editoriais caso seja experiencialista.
4. Uma conta desativada deixa de acessar `/painel` e os links de revisão.
5. A conta administrativa original continua funcionando.

### Próximos cuidados operacionais

A recuperação de acesso é feita emitindo um novo convite pela administração. Para distribuir acesso em larga escala, integrar serviço de e-mail transacional e trilha formal de revisão editorial. Antes de remover `BIBLIOTECA_PASSWORD_USERS`, transferir também a conta administradora para o banco, testar seu novo login e somente depois revogar o login de bootstrap.


## Solicitação pública e aprovação de membros

A etapa de aprovação foi adicionada sem abrir cadastro automático.

- **/solicitar-acesso**: a pessoa preenche nome, e-mail, contexto opcional e consentimento específico para uso dos dados na análise da solicitação.
- O pedido entra como `pending` em `biblioteca_membership_requests`. Solicitações repetidas para o mesmo e-mail não revelam se já existe conta; nova solicitação após recusa só é aceita passados 30 dias.
- A administração entra em **/painel/usuarios#solicitacoes** para avaliar cada pedido.
- **Aprovar** cria conta `experiencialista` inativa e um convite de uso único, válido por 48 horas. O administrador copia e compartilha o link privadamente, pois não há envio automático de e-mail.
- **Recusar** marca a solicitação como `rejected` e não cria acesso.
- O usuário aprovado define a senha em `/convite/[token]`. Só então passa a poder iniciar sessão.
- A conta `experiencialista` não recebe acesso aos nove e-books ainda classificados como minutas internas; continuam restritos à curadoria e administração.
- Pedidos não aprovados não alteram outros registros de usuário, permissões ou bibliografias.

### Proteções e limites

Há validação de comprimento, formulário antifraude simples (campo invisível), teto global de solicitações novas por 24 horas e consulta parametrizada. O sistema não possui captcha nem controle distribuído contra abuso por IP; antes de divulgação em massa será necessário adicionar uma proteção externa e definir política de retenção de pedidos pessoais segundo a LGPD.

Aprovação administrativa tem verificação de sessão no servidor e escrita transacional no Neon. Os convites são armazenados somente como hash SHA-256 e não podem ser recuperados depois de fechada a mensagem de aprovação. Não tente alterar contas existentes por essa rota — o painel fornece ferramentas específicas para usuários registrados.

### Verificação recomendada antes da divulgação ampla

Faça um pedido de teste com um e-mail controlado pela equipe, confira sua aparição na fila, aprove, copie o convite, ative a senha e teste o perfil. Em seguida, verifique que outro visitante não consegue acessar `/painel/usuarios` e que um experiencialista não visualiza os links editoriais restritos.
