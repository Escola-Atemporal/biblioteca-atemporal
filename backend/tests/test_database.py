"""Integration tests against disposable PostgreSQL service in GitHub Actions.

Never points at Neon or a real customer database. Uses TEST_DATABASE_URL only.
"""
import os
from pathlib import Path
from uuid import uuid4

import psycopg
import pytest

DB_URL = os.environ.get("TEST_DATABASE_URL")
MIGRATION = Path(__file__).resolve().parents[1] / "migrations" / "001_init.sql"

@pytest.fixture(scope="module")
def db():
    if not DB_URL:
        pytest.skip("No disposable TEST_DATABASE_URL configured")
    if "localhost" not in DB_URL and "127.0.0.1" not in DB_URL:
        pytest.fail("Integration tests may only run on local disposable PostgreSQL")
    connection = psycopg.connect(DB_URL, autocommit=True)
    with connection.cursor() as cur:
        cur.execute(MIGRATION.read_text(encoding="utf-8"))
    yield connection
    connection.close()

def seed_user(cur, subject):
    cur.execute(
        "INSERT INTO app_users(identity_subject,role) VALUES (%s,%s)",
        (subject, "administrator")
    )

def seed_record(cur, subject):
    cur.execute("""
        INSERT INTO content_records
           (title,content_type,track_code,source_title,created_by,updated_by)
        VALUES ('Teste', 'tema', '04', 'Fonte de teste', %s, %s)
        RETURNING id
    """, (subject, subject))
    return cur.fetchone()[0]

def test_new_records_default_to_non_publication(db):
    subject = "ci-" + uuid4().hex
    with db.cursor() as cur:
        seed_user(cur, subject)
        rid = seed_record(cur, subject)
        cur.execute(
            "SELECT editorial_status,access_level,rights_status FROM content_records WHERE id=%s",
            (rid,)
        )
        assert cur.fetchone() == ("inventariado", "interno_escola", "verificar")

def test_cannot_publish_without_both_approvals(db):
    subject = "ci-" + uuid4().hex
    with db.cursor() as cur:
        seed_user(cur, subject)
        rid = seed_record(cur, subject)
        with pytest.raises(psycopg.errors.CheckViolation):
            cur.execute(
                "UPDATE content_records SET editorial_status='publicado' WHERE id=%s",
                (rid,)
            )

def test_cannot_publish_restricted_rights_even_with_both_approvals(db):
    subject = "ci-" + uuid4().hex
    with db.cursor() as cur:
        seed_user(cur, subject)
        rid = seed_record(cur, subject)
        with pytest.raises(psycopg.errors.CheckViolation):
            cur.execute("""
                UPDATE content_records
                SET methodology_approved_by=%s, methodology_approved_at=now(),
                    rights_approved_by=%s, rights_approved_at=now(),
                    published_by=%s, published_at=now(),
                    editorial_status='publicado',
                    rights_status='restrito'
                WHERE id=%s
            """, (subject, subject, subject, rid))

def test_unapproved_record_does_not_leak_into_published_selection(db):
    subject = "ci-" + uuid4().hex
    with db.cursor() as cur:
        seed_user(cur, subject)
        rid = seed_record(cur, subject)
        cur.execute("""
            SELECT count(*) FROM content_records
            WHERE id=%s AND editorial_status='publicado'
              AND access_level='publico'
        """, (rid,))
        assert cur.fetchone()[0] == 0

def test_invalid_track_rejected_by_database(db):
    subject = "ci-" + uuid4().hex
    with db.cursor() as cur:
        seed_user(cur, subject)
        with pytest.raises(psycopg.errors.CheckViolation):
            cur.execute("""
                INSERT INTO content_records(title,content_type,track_code,source_title,created_by,updated_by)
                VALUES ('Teste','tema','99','Fonte de teste',%s,%s)
            """, (subject,subject))
