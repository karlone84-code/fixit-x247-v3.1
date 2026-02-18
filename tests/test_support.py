
from fastapi.testclient import TestClient
from app.main import app
from app.core import security
from app.core.security import Role, CurrentUser

client = TestClient(app)

def mock_admin():
    return CurrentUser(id=1, email="admin@fixit.x247", role=Role.ADMIN)

def test_create_ticket_and_list_pending(monkeypatch):
    # 1. Create Ticket (simulating AI call)
    payload = {
        "user_id": 123,
        "user_role": "CLIENT",
        "category": "SOS",
        "ai_summary": "Inundação grave na cozinha, cliente stressado.",
        "chat_log": [{"role": "user", "content": "Ajuda! Água por todo o lado!"}],
        "escalated": True
    }
    res_create = client.post("/support/tickets", json=payload)
    assert res_create.status_code == 201
    ticket_id = res_create.json()["id"]

    # 2. List Pending as Admin
    monkeypatch.setattr(security, "get_current_user", mock_admin)
    res_list = client.get("/support/tickets/pending")
    assert res_list.status_code == 200
    assert any(t["id"] == ticket_id for t in res_list.json())

def test_resolve_ticket(monkeypatch):
    monkeypatch.setattr(security, "get_current_user", mock_admin)
    
    # Pre-create
    payload = {
        "user_id": 123,
        "user_role": "CLIENT",
        "category": "WALLET",
        "ai_summary": "Erro no levantamento.",
        "chat_log": [],
        "escalated": True
    }
    ticket_id = client.post("/support/tickets", json=payload).json()["id"]

    # Patch Status
    res_patch = client.patch(f"/support/tickets/{ticket_id}/status", json={"status": "HUMAN_RESOLVED"})
    assert res_patch.status_code == 200
    assert res_patch.json()["status"] == "HUMAN_RESOLVED"
    assert res_patch.json()["resolved_at"] is not None
