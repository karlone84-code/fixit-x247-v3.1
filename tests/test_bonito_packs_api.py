import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.domain.bonito_service.deps import bonito_pack_repository
from app.domain.bonito_service.models import BonitoPackStatus

client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_repo():
    """Limpar o repositório antes de cada teste."""
    bonito_pack_repository._storage.clear()
    bonito_pack_repository._next_id = 1


def test_create_and_get_pack():
    payload = {
        "nome": "Revisão Elétrica x247",
        "descricao": "Revisão completa de quadros e circuitos até 2h.",
        "preco_base": 120.0,
        "imagem_url": "https://picsum.photos/seed/elec/800/600",
        "categorias": [
            {"area": "Eletricidade", "categoria": "Revisão"},
        ],
        "duracao_minutos": 120,
        "margem_maxima_pro_percent": 85.0,
        "raio_km_sugerido": 15.0,
    }

    response = client.post("/admin/bonito-packs/", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] == 1
    assert data["nome"] == payload["nome"]
    assert data["status"] == BonitoPackStatus.ACTIVE.value

    get_res = client.get("/admin/bonito-packs/1")
    assert get_res.status_code == 200
    assert get_res.json()["nome"] == payload["nome"]


def test_list_packs():
    for i in range(3):
        client.post("/admin/bonito-packs/", json={
            "nome": f"Pack {i}",
            "descricao": "Descrição de teste para o pack Bonito.",
            "preco_base": 100.0,
            "categorias": [{"area": "Canalização", "categoria": "Checkup"}],
            "duracao_minutos": 60,
            "margem_maxima_pro_percent": 80.0,
        })

    response = client.get("/admin/bonito-packs/")
    assert response.status_code == 200
    assert len(response.json()) == 3


def test_update_pack_status():
    client.post("/admin/bonito-packs/", json={
        "nome": "Pack Original",
        "descricao": "Descrição original do pack Bonito.",
        "preco_base": 100.0,
        "categorias": [{"area": "Geral", "categoria": "Limpeza"}],
        "duracao_minutos": 60,
    })

    # Deactivate
    res_deact = client.post("/admin/bonito-packs/1/deactivate")
    assert res_deact.status_code == 200
    assert res_deact.json()["status"] == BonitoPackStatus.INACTIVE.value

    # Activate
    res_act = client.post("/admin/bonito-packs/1/activate")
    assert res_act.status_code == 200
    assert res_act.json()["status"] == BonitoPackStatus.ACTIVE.value


def test_get_pack_not_found():
    response = client.get("/admin/bonito-packs/999")
    assert response.status_code == 404
    assert "Pack não encontrado" in response.json()["detail"]
