
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import Role, UserClaims
from app.db.session import get_db

client = TestClient(app)

@pytest.fixture
def mock_super_admin(monkeypatch):
    def mock_claims():
        return UserClaims(id=1, email="founder@fixit.x247", role=Role.SUPER_ADMIN, tenant_id=1)
    monkeypatch.setattr("app.api.v1.ux247verse.get_current_user_claims", mock_claims)

@pytest.fixture
def mock_client(monkeypatch):
    def mock_claims():
        return UserClaims(id=2, email="user@fixit.x247", role=Role.CLIENT, tenant_id=1)
    monkeypatch.setattr("app.api.v1.ux247verse.get_current_user_claims", mock_claims)

def test_get_config_creates_default_seed(mock_client):
    response = client.get("/ux247verse/config")
    assert response.status_code == 200
    data = response.json()
    assert data["videos_enabled"] is True
    assert "whatsapp_url" in data["social_meta"]

def test_put_config_forbidden_for_regular_user(mock_client):
    payload = {"videos_enabled": False}
    response = client.put("/ux247verse/config", json=payload)
    assert response.status_code == 403

def test_put_config_success_for_super_admin(mock_super_admin):
    payload = {
        "videos_enabled": False,
        "future_visibility": "public"
    }
    response = client.put("/ux247verse/config", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["videos_enabled"] is False
    assert data["future_visibility"] == "public"
