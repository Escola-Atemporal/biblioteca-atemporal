-- Biblioteca Atemporal: migration 001 (run ONLY in a dedicated database)
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS app_users (
  identity_subject text PRIMARY KEY,
  email text,
  display_name text,
  role text NOT NULL CHECK (role IN ('administrator','curator','experiencialista','community_member')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS content_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL CHECK (char_length(title) BETWEEN 1 AND 250),
  summary text NOT NULL DEFAULT '',
  content_type text NOT NULL CHECK (content_type IN ('tema','livro','ferramenta','conceito','video','roteiro')),
  track_code text NOT NULL CHECK (track_code IN ('01','02','03','04','05','06')),
  source_title text NOT NULL,
  source_author text,
  source_url text,
  rights_status text NOT NULL DEFAULT 'verificar' CHECK (rights_status IN ('verificar','autorizado','dominio_publico','referencia_externa','restrito')),
  access_level text NOT NULL DEFAULT 'interno_escola' CHECK (access_level IN ('publico','interno_escola','experiencialista_autorizado','confidencial')),
  editorial_status text NOT NULL DEFAULT 'inventariado' CHECK (editorial_status IN ('inventariado','curadoria_interna','validado','publicado','rejeitado')),
  methodology_approved_by text REFERENCES app_users(identity_subject),
  methodology_approved_at timestamptz,
  rights_approved_by text REFERENCES app_users(identity_subject),
  rights_approved_at timestamptz,
  published_by text REFERENCES app_users(identity_subject),
  published_at timestamptz,
  created_by text NOT NULL REFERENCES app_users(identity_subject),
  updated_by text NOT NULL REFERENCES app_users(identity_subject),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  version integer NOT NULL DEFAULT 1 CHECK (version > 0),
  CONSTRAINT valid_published_record CHECK (
     editorial_status <> 'publicado' OR (
       methodology_approved_by IS NOT NULL AND methodology_approved_at IS NOT NULL
       AND rights_approved_by IS NOT NULL AND rights_approved_at IS NOT NULL
       AND published_by IS NOT NULL AND published_at IS NOT NULL
       AND rights_status IN ('autorizado','dominio_publico','referencia_externa')
     )
  )
);
CREATE INDEX IF NOT EXISTS content_records_status_idx ON content_records(editorial_status,access_level);
CREATE INDEX IF NOT EXISTS content_records_track_idx ON content_records(track_code);

CREATE TABLE IF NOT EXISTS audit_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  actor_subject text NOT NULL,
  action text NOT NULL,
  record_id uuid,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Never grant direct table access to an anonymous/public web client.
-- API must use a dedicated DB role with minimum required privileges.
COMMIT;
