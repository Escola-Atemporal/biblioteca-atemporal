"""Isolated API tests; no Neon, Render, Drive, or GitHub secrets required."""
import os
from contextlib import contextmanager
from uuid import UUID

os.environ.setdefault("DATABASE_URL","postgresql://invalid:invalid@127.0.0.1:1/biblioteca_test")
os.environ.setdefault("OIDC_ISSUER","https://issuer.example.test")
os.environ.setdefault("OIDC_AUDIENCE","biblioteca-admin-tests")
os.environ.setdefault("OIDC_JWKS_URL","https://issuer.example.test/.well-known/jwks.json")
os.environ.setdefault("ALLOWED_ORIGIN","https://admin.example.test")

from fastapi.testclient import TestClient
from app import app, require_staff

client = TestClient(app)
DRAFT = {
    "title":"Ficha de demonstração",
    "summary":"Resumo de teste sem informações restritas",
    "content_type":"tema",
    "track_code":"04",
    "source_title":"Referência fictícia",
    "rights_status":"verificar",
    "access_level":"interno_escola",
}
ADMIN={"identity_subject":"admin-test","role":"administrator"}
CURATOR={"identity_subject":"curator-test","role":"curator"}

def setup_function():
    app.dependency_overrides.clear()

def teardown_function():
    app.dependency_overrides.clear()

def test_health_does_not_expose_database_or_user_info():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"service":"biblioteca-admin","status":"running"}

def test_list_requires_authentication():
    response=client.get("/api/admin/records")
    assert response.status_code == 401

def test_create_requires_authentication():
    response=client.post("/api/admin/records",json=DRAFT)
    assert response.status_code == 401

def test_review_requires_authentication():
    response=client.post(
       "/api/admin/records/00000000-0000-0000-0000-000000000001/review",
       json={"stage":"rights","approved":True}
    )
    assert response.status_code == 401

def test_curator_cannot_approve():
    app.dependency_overrides[require_staff]=lambda:CURATOR
    response=client.post(
       "/api/admin/records/00000000-0000-0000-0000-000000000001/review",
       json={"stage":"methodology","approved":True}
    )
    assert response.status_code == 403

def test_draft_rejects_invalid_track():
    app.dependency_overrides[require_staff]=lambda:CURATOR
    response=client.post("/api/admin/records",json={**DRAFT,"track_code":"99"})
    assert response.status_code == 422

def test_draft_rejects_public_access():
    app.dependency_overrides[require_staff]=lambda:ADMIN
    response=client.post("/api/admin/records",json={**DRAFT,"access_level":"publico"})
    assert response.status_code == 422

def test_draft_rejects_unknown_rights_status():
    app.dependency_overrides[require_staff]=lambda:ADMIN
    response=client.post("/api/admin/records",json={**DRAFT,"rights_status":"automatically_approved"})
    assert response.status_code == 422

def test_no_public_publish_endpoint():
    app.dependency_overrides[require_staff]=lambda:ADMIN
    response=client.post("/api/admin/publish",json=DRAFT)
    assert response.status_code == 404

def test_cors_is_limited_to_approved_origin():
    response=client.options("/api/admin/records",headers={
       "Origin":"https://malicious.example.test",
       "Access-Control-Request-Method":"GET",
       "Access-Control-Request-Headers":"authorization"
    })
    assert response.headers.get("access-control-allow-origin") != "https://malicious.example.test"

def test_schema_discovery_not_public():
    assert client.get("/openapi.json").status_code == 404
    assert client.get("/docs").status_code == 404
