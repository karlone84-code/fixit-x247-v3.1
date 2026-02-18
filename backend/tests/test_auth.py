
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.database import User, Tenant

client = TestClient(app)

def test_register_and_login_flow():
    # 1. Registo
    email = "test-founder@fixit.x247"
    reg_payload = {
        "email": email,
        "password": "securepassword123",
        "tenant_name": "Test HQ"
    }
    response = client.post("/auth/register", json=reg_payload)
    assert response.status_code == 200
    assert response.json()["status"] == "success"

    # 2. Login
    login_payload = {
        "email": email,
        "password": "securepassword123"
    }
    response = client.post("/auth/login", json=login_payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == email

def test_login_invalid_credentials():
    login_payload = {
        "email": "nonexistent@fixit.x247",
        "password": "wrongpassword"
    }
    response = client.post("/auth/login", json=login_payload)
    assert response.status_code == 401
    assert "Credenciais inválidas" in response.json()["detail"] or "Email ou password incorretos" in response.json()["detail"]
