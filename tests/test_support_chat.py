
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_flix_ai_chat_flow():
    payload = {
        "user_id": 444,
        "user_role": "PRO",
        "category": "COMPLIANCE",
        "message": "Quero reportar uma atividade suspeita.",
        "history": []
    }
    
    response = client.post("/support/chat/", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "reply" in data
    assert "ticket_id" in data
    assert data["escalated"] is True  # COMPLIANCE escala sempre
    assert data["status"] == "OPEN"

def test_flix_ai_chat_standard():
    payload = {
        "user_id": 555,
        "user_role": "CLIENT",
        "category": "SOS",
        "message": "Como funciona o SOS?",
        "history": []
    }
    
    response = client.post("/support/chat/", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["escalated"] is False
