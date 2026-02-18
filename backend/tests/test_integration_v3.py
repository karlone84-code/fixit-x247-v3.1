
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token

client = TestClient(app)

@pytest.fixture
def auth_header():
    token = create_access_token(data={"sub": "1", "tenant_id": 1, "role": "CLIENT"})
    return {"Authorization": f"Bearer {token}"}

def test_ai_chat_endpoint(auth_header):
    payload = {
        "message": "Como funciona o SOS?",
        "history": [],
        "category": "SOS"
    }
    response = client.post("/support/chat/", json=payload, headers=auth_header)
    assert response.status_code == 200
    assert "reply" in response.json()
    assert "ticket_id" in response.json()

def test_create_payment_intent_auth_required():
    response = client.post("/payments/create-intent?order_id=1")
    assert response.status_code == 401 # Sem token

def test_webhook_invalid_sig():
    response = client.post("/payments/webhook", content=b"{}", headers={"stripe-signature": "invalid"})
    assert response.status_code == 400
