"""Biblioteca Atemporal admin API — isolated service, not deployed by GitHub Pages.

Production requires: a dedicated Postgres database, trusted OIDC provider,
verified staff identities, backend CORS origins and TLS at the reverse proxy.
"""
from __future__ import annotations

import os
from contextlib import contextmanager
from typing import Literal
from uuid import UUID

import jwt
import psycopg
from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient
from psycopg.rows import dict_row
from pydantic import BaseModel, Field

DATABASE_URL = os.environ.get("DATABASE_URL", "")
OIDC_ISSUER = os.environ.get("OIDC_ISSUER", "").rstrip("/")
OIDC_AUDIENCE = os.environ.get("OIDC_AUDIENCE", "")
OIDC_JWKS_URL = os.environ.get("OIDC_JWKS_URL", "")
ALLOW_ORIGIN = os.environ.get("ALLOWED_ORIGIN", "")

ADMIN_API_ENABLED = os.environ.get("ADMIN_API_ENABLED", "false").strip().lower() == "true"
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is required")
if ADMIN_API_ENABLED and not all([OIDC_ISSUER, OIDC_AUDIENCE, OIDC_JWKS_URL, ALLOW_ORIGIN]):
    raise RuntimeError("Admin API requires OIDC_ISSUER, OIDC_AUDIENCE, OIDC_JWKS_URL and ALLOWED_ORIGIN")
if ALLOW_ORIGIN and (ALLOW_ORIGIN == "*" or not ALLOW_ORIGIN.startswith("https://")):
    raise RuntimeError("ALLOWED_ORIGIN must be an exact HTTPS origin")

app = FastAPI(title="Biblioteca Atemporal — Admin API", docs_url=None, redoc_url=None, openapi_url=None)
app.add_middleware(
    CORSMiddleware, allow_origins=[ALLOW_ORIGIN] if ALLOW_ORIGIN else [], allow_credentials=False,
    allow_methods=["GET", "POST"], allow_headers=["Authorization", "Content-Type"]
)
bearer = HTTPBearer(auto_error=False)
jwks = PyJWKClient(OIDC_JWKS_URL, cache_jwk_set=True, lifespan=300) if ADMIN_API_ENABLED else None
ROLES = {"administrator", "curator"}

@contextmanager
def conn():
    with psycopg.connect(DATABASE_URL, row_factory=dict_row, connect_timeout=8) as db:
        yield db

def require_staff(credentials: HTTPAuthorizationCredentials | None = Depends(bearer)):
    if not ADMIN_API_ENABLED:
        raise HTTPException(503, "Administrative access is not configured")
    if credentials is None:
        raise HTTPException(401, "Bearer token required")
    try:
        key = jwks.get_signing_key_from_jwt(credentials.credentials)
        claims = jwt.decode(
            credentials.credentials, key.key,
            algorithms=["RS256"], audience=OIDC_AUDIENCE, issuer=OIDC_ISSUER,
            options={"require": ["exp", "iat", "iss", "sub", "aud"]}
        )
    except (jwt.PyJWTError, Exception) as err:
        # Never leak token material or verification internals.
        raise HTTPException(401, "Invalid identity token") from None
    subject = claims.get("sub", "")
    if not subject:
        raise HTTPException(401, "Invalid identity")
    with conn() as db:
        user = db.execute(
            "SELECT identity_subject, role FROM app_users WHERE identity_subject = %s AND active = TRUE",
            (subject,)
        ).fetchone()
    if user is None or user["role"] not in ROLES:
        raise HTTPException(403, "Insufficient permissions")
    return user

class Draft(BaseModel):
    title: str = Field(min_length=1, max_length=250)
    summary: str = Field(default="", max_length=4000)
    content_type: Literal["tema","livro","ferramenta","conceito","video","roteiro"]
    track_code: Literal["01","02","03","04","05","06"]
    source_title: str = Field(min_length=1, max_length=250)
    source_author: str | None = Field(default=None, max_length=250)
    rights_status: Literal["verificar","autorizado","dominio_publico","referencia_externa","restrito"] = "verificar"
    access_level: Literal["interno_escola","experiencialista_autorizado","confidencial"] = "interno_escola"

class Decision(BaseModel):
    stage: Literal["methodology","rights"]
    approved: bool = True

@app.get("/health")
def health():
    return {"service": "biblioteca-admin", "status": "running"}

@app.get("/api/admin/records")
def records(user=Depends(require_staff)):
    with conn() as db:
        rows = db.execute("""
          SELECT id,title,summary,content_type,track_code,source_title,source_author,
                 rights_status,access_level,editorial_status,created_at,updated_at,version
            FROM content_records ORDER BY created_at DESC LIMIT 100
        """).fetchall()
        return {"items": rows}

@app.post("/api/admin/records", status_code=201)
def create_record(body: Draft, user=Depends(require_staff)):
    with conn() as db:
        with db.transaction():
            row = db.execute("""
              INSERT INTO content_records
                (title,summary,content_type,track_code,source_title,source_author,
                 rights_status,access_level,created_by,updated_by)
              VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
              RETURNING id,editorial_status
            """, (body.title, body.summary, body.content_type, body.track_code, body.source_title,
                  body.source_author, body.rights_status, body.access_level,
                  user["identity_subject"], user["identity_subject"])).fetchone()
            db.execute(
                "INSERT INTO audit_events(actor_subject,action,record_id) VALUES (%s,%s,%s)",
                (user["identity_subject"], "record.created", row["id"])
            )
            return row

@app.post("/api/admin/records/{record_id}/review")
def review(record_id: UUID, body: Decision, user=Depends(require_staff)):
    # A stage decision is permission-gated and stored in the DB; it does not publish.
    if user["role"] != "administrator":
        raise HTTPException(403, "Administrator approval required")
    column = "methodology" if body.stage == "methodology" else "rights"
    with conn() as db:
        with db.transaction():
            row = db.execute("SELECT id, editorial_status FROM content_records WHERE id = %s FOR UPDATE", (record_id,)).fetchone()
            if row is None:
                raise HTTPException(404, "Record not found")
            if row["editorial_status"] == "publicado":
                raise HTTPException(409, "Published records require a controlled revision process")
            if column == "methodology":
                db.execute("""
                   UPDATE content_records SET methodology_approved_by=%s, methodology_approved_at=%s,
                       editorial_status='curadoria_interna', updated_by=%s,updated_at=now(),version=version+1
                   WHERE id=%s
                """, (user["identity_subject"] if body.approved else None,
                      None if not body.approved else __import__("datetime").datetime.now(__import__("datetime").timezone.utc),
                      user["identity_subject"],record_id))
            else:
                db.execute("""
                   UPDATE content_records SET rights_approved_by=%s,rights_approved_at=%s,
                       editorial_status='curadoria_interna',updated_by=%s,updated_at=now(),version=version+1
                   WHERE id=%s
                """, (user["identity_subject"] if body.approved else None,
                      None if not body.approved else __import__("datetime").datetime.now(__import__("datetime").timezone.utc),
                      user["identity_subject"],record_id))
            db.execute("INSERT INTO audit_events(actor_subject,action,record_id,details) VALUES (%s,%s,%s,%s)",
                       (user["identity_subject"], "record.review", record_id,
                        __import__("json").dumps({"stage":body.stage,"approved":body.approved})))
            return {"id":record_id,"status":"review_recorded","published":False}
