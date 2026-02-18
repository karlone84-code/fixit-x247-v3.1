
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.payments.domain import calculate_split
from app.domain.payments.models import CommissionModel

client = TestClient(app)

def test_calculate_split_bridge():
    # 100€ (10000 cêntimos) com 10% comissão
    split = calculate_split(10000, 0.10, CommissionModel.BRIDGE)
    assert split.platform_amount == 1000
    assert split.pro_amount == 9000
    assert split.model == CommissionModel.BRIDGE

def test_calculate_split_internal():
    # 100€ (10000 cêntimos) com 15% comissão
    split = calculate_split(10000, 0.15, CommissionModel.INTERNAL)
    assert split.platform_amount == 1500
    assert split.pro_amount == 8500
    assert split.model == CommissionModel.INTERNAL

def test_checkout_endpoint():
    payload = {
        "order_id": 123,
        "amount_cents": 5000,
        "commission_rate": 0.10
    }
    response = client.post("/payments/checkout", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "pi_test_123_secret" in data["client_secret"]
    assert data["split"]["platform_amount"] == 500

def test_stripe_webhook_success():
    webhook_payload = {
        "type": "payment_intent.succeeded",
        "data": {
            "object": {
                "id": "pi_123",
                "amount_received": 5000,
                "metadata": {"order_id": "123"}
            }
        }
    }
    response = client.post("/payments/webhooks/stripe", json=webhook_payload)
    assert response.status_code == 200
    assert response.json()["received"] is True
