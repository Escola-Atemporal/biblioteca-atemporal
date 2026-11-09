# Biblioteca Atemporal — Vercel + GitHub (sem Neon e sem Render)

Nova aplicação Next.js isolada na pasta `vercel-app/`. **Não altera o site GitHub Pages atual** nem modifica/exclui o serviço Render e o projeto Neon já existentes.

## O que funciona neste estágio

- Página pública com seis trilhas e descrições já aprovadas, copiadas de `data/catalogo-publico.json`.
- Entrada com conta Google verificada, via Auth.js JWT, sem banco de dados.
- Somente e-mails constantes das variáveis de autorização conseguem entrar. Perfis: administrador, curador e experiencialista.
- Página `/painel` protegida no servidor. A API `/api/private/status` retorna 401 sem sessão ou 403 sem autorização.
- **Ainda não existem** cadastro de conteúdos, favoritos sincronizados, convites, acervo interno nem publicação via GitHub API. Esses recursos não são simulados como concluídos.

## Implantar na Vercel

1. Criar projeto Vercel importando `https://github.com/Escola-Atemporal/biblioteca-atemporal`.
2. Definir **Root Directory = `vercel-app`** e framework Next.js.
3. Criar aplicativo Google OAuth (tela de consentimento apropriada), com callback `https://SEU-DOMINIO/api/auth/callback/google`.
4. Configurar **somente nas Environment Variables da Vercel**:
   - `AUTH_SECRET`: segredo aleatório forte de ao menos 32 caracteres.
   - `AUTH_GOOGLE_ID` e `AUTH_GOOGLE_SECRET`: OAuth do Google.
   - `BIBLIOTECA_ADMIN_EMAILS`: e-mails verificados de administradores, separados por vírgula.
   - `BIBLIOTECA_CURATOR_EMAILS` e `BIBLIOTECA_MEMBER_EMAILS`: listas específicas, separadas por vírgula.
5. Implantar e testar login, acesso negado e logout. Testar conta não autorizada. Não disponibilizar materiais internos antes de testar autorização em todas as rotas.

**Importante:** GitHub público armazena somente catálogo aprovado. Os dados editoriais restritos deverão permanecer em repositório privado ou Drive autorizado; nunca expor token GitHub nem conteúdo privado em Client Components ou variáveis `NEXT_PUBLIC_`.

## Limitações do modelo sem banco

A lista de acesso é controlada por variáveis de ambiente na Vercel, não por cadastro autônomo; mudanças exigem atualização da configuração e novo deploy. O painel não salva dados neste estágio. Login Google é requisito para quem tiver acesso. Não há banco de sessões: Auth.js mantém sessão JWT protegida por `AUTH_SECRET`.

## Segurança operacional

- Nunca adicionar arquivos `.env.local` ao GitHub.
- Não colocar `AUTH_SECRET`, token Google ou token GitHub em arquivos estáticos.
- A função `roleForEmail` é executada no servidor: ser autenticado não implica ter permissão.
- Não apontar o novo projeto para o serviço Render antigo nem para o banco Neon.
