
from fastapi import status
from fastapi.testclient import TestClient
from app.main import app
from app.core import security
from app.core.security import Role, CurrentUser

client = TestClient(app)

def mock_user(role: Role):
    return CurrentUser(id=999, email=f"{role.lower()}@fixit.x247", role=role)

def test_manual_bridge_success(monkeypatch):
    # Simular Super Admin
    monkeypatch.setattr(security, "get_current_user", lambda: mock_user(Role.SUPER_ADMIN))

    # 1. Criar pedido
    res_order = client.post("/orders/", json={"category": "Canalização", "area": "Almada", "client_id": 1})
    assert res_order.status_code == 200
    order_id = res_order.json()["order"]["id"]

    # 2. Acionar Bridge
    res_bridge = client.post(f"/orders/manual-bridge/{order_id}")
    assert res_bridge.status_code == 200
    data = res_bridge.json()
    assert data["orderId"] == order_id
    assert data["commission"] == "10% primeira utilização"
    assert "whatsapp" in data["proContact"]

def test_manual_bridge_forbidden_for_client(monkeypatch):
    # Simular Cliente comum
    monkeypatch.setattr(security, "get_current_user", lambda: mock_user(Role.CLIENT))

    response = client.post("/orders/manual-bridge/1")
    assert response.status_code == status.HTTP_403_FORBIDDEN
