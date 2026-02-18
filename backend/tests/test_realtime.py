
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.core.security import create_access_token

client = TestClient(app)

def test_stream_unauthorized():
    # Sem token deve retornar 401 ou 403 dependendo da implementação do guard
    response = client.get("/realtime/stream")
    assert response.status_code in [401, 403]

def test_stream_authorized():
    token = create_access_token(data={"sub": "1", "tenant_id": 1, "role": "CLIENT"})
    # Usando o client do teste como um iterador para SSE
    with client.stream("GET", f"/realtime/stream?token={token}") as response:
        assert response.status_code == 200
        # Validar se o header media-type é correto para SSE
        assert "text/event-stream" in response.headers["content-type"]
        
        # Obter a primeira linha de dados
        gen = response.iter_lines()
        first_line = next(gen)
        assert first_line.startswith("data: ")
