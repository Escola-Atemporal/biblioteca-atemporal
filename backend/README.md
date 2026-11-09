# Biblioteca Atemporal — backend administrativo (não implantado)

Este diretório contém a **primeira estrutura técnica** de uma API administrativa. Ela não está conectada ao site público e **não deve ser apontada para o banco de dados do Círculo Atemporal**.

## O que foi implementado

- Esquema PostgreSQL para usuários, fichas editoriais e auditoria.
- Verificação de JWT via chaves públicas (JWKS) de um provedor OIDC confiável.
- Autorização por cadastro **no servidor**: `administrator` e `curator`.
- Listagem e criação de fichas de acervo por perfis autorizados.
- Registro de revisão metodológica e de direitos por administrador.
- Status de publicação bloqueado: **não existe endpoint para publicar** nesta primeira etapa.
- Nenhum arquivo do Drive é lido ou alterado.

## Segurança e premissas

1. Criar **projeto/banco dedicados** à Biblioteca, ou branch isolada avaliada pela equipe técnica.
2. Configurar um provedor de identidade real para a Escola. A API valida `iss`, `aud`, `exp`, `iat`, assinatura RS256 e correspondência de `sub` com usuário ativo em `app_users`.
3. Cadastrar administradores no banco **somente por processo de bootstrap operacional autenticado e auditável**, nunca por autoinscrição pública.
4. Guardar `DATABASE_URL` e outros valores em secrets do serviço, não no GitHub.
5. Hospedar a API em HTTPS, com rate limiting, observabilidade, backups, gestão de privilégios e revisão de dependências.
6. Usar DB role específico da Biblioteca com mínimos privilégios. **Não** reutilizar credenciais de superusuário do Neon.
7. Testar primeiro em ambiente separado e realizar revisão de segurança antes de qualquer conteúdo real.
8. Definir origem exata da interface administrativa em `ALLOWED_ORIGIN` — **não** apontar para a página pública sem autenticação.

## Configuração local por uma equipe técnica

1. Criar um banco PostgreSQL isolado.
2. Aplicar `migrations/001_init.sql` no banco isolado.
3. Instalar as dependências de `requirements.txt`.
4. Definir as cinco variáveis do arquivo `.env.example` no ambiente (não publicá-las).
5. Subir em ambiente de desenvolvimento: `uvicorn app:app --host 127.0.0.1 --port 8000`.

A aplicação falha no início se as variáveis essenciais não estiverem configuradas.

## Endpoints existentes

| Método | Caminho | Autorização |
| --- | --- | --- |
| GET | `/health` | Saúde, sem dados sensíveis |
| GET | `/api/admin/records` | Administrator ou Curator |
| POST | `/api/admin/records` | Administrator ou Curator |
| POST | `/api/admin/records/{id}/review` | Administrator |

A interface `prototipos/curadoria.html` **não está ligada a esta API**. Ela continua apenas como demonstração sem dados reais. A conexão só deve ocorrer após aprovação de provedores de identidade, ambientes e regras de acesso.

## Testes automatizados (isolados)

O workflow `.github/workflows/backend-tests.yml` agora inicia um PostgreSQL temporário do GitHub Actions, aplica `migrations/001_init.sql` e executa testes de segurança com `pytest`. A variável `TEST_DATABASE_URL` é exclusiva dos testes. O conjunto recusa executar contra URLs diferentes de `localhost` e `127.0.0.1`, evitando o uso acidental de bancos Neon reais.

Os testes cobrem a exigência de autenticação, restrições de papéis, validação de campos e algumas restrições estruturais do banco. Eles não representam uma homologação para produção e ainda faltam testes end-to-end de sessões reais e revisão de segurança independente.

## Limites desta entrega

Ainda faltam: testes automatizados completos, bootstrap seguro de identidade, política de publicação e revisão, API para perfis autorizados, UI administrativa autenticada, regras de upload e revisão de materiais, backups e configuração/implantação em servidor dedicado.

O GitHub Pages estático publica apenas `index.html`, `acervo.html`, `.nojekyll` e `data/catalogo-publico.json`; nenhum arquivo de `backend/` deve compor o artefato publicado.
