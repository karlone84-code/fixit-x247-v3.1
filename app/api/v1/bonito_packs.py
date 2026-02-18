from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import require_admin, require_super_admin, CurrentUser
from app.domain.bonito_service.deps import get_bonito_pack_repository
from app.domain.bonito_service.models import (
    BonitoPack,
    BonitoPackCreate,
    BonitoPackStatus,
    BonitoPackUpdate,
)
from app.domain.bonito_service.repository import BonitoPackRepository

router = APIRouter(
    prefix="/admin/bonito-packs",
    tags=["admin-bonito-packs"],
)


@router.get("/", response_model=List[BonitoPack])
def list_packs(
    include_inactive: bool = True,
    repo: BonitoPackRepository = Depends(get_bonito_pack_repository),
    _: CurrentUser = Depends(require_admin),
) -> List[BonitoPack]:
    """
    Lista todos os packs Bonito Serviço cadastrados no sistema.
    """
    return repo.list_all(include_inactive=include_inactive)


@router.get("/{pack_id}", response_model=BonitoPack)
def get_pack(
    pack_id: int,
    repo: BonitoPackRepository = Depends(get_bonito_pack_repository),
    _: CurrentUser = Depends(require_admin),
) -> BonitoPack:
    """
    Obtém detalhes de um pack específico por ID.
    """
    pack = repo.get(pack_id)
    if not pack:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pack não encontrado",
        )
    return pack


@router.post(
    "/",
    response_model=BonitoPack,
    status_code=status.HTTP_201_CREATED,
)
def create_pack(
    payload: BonitoPackCreate,
    repo: BonitoPackRepository = Depends(get_bonito_pack_repository),
    _: CurrentUser = Depends(require_admin),
) -> BonitoPack:
    """
    Cria um novo pack Bonito Serviço respeitando as regras canónicas de 2h e 85%.
    """
    return repo.create(payload)


@router.patch("/{pack_id}", response_model=BonitoPack)
def update_pack(
    pack_id: int,
    payload: BonitoPackUpdate,
    repo: BonitoPackRepository = Depends(get_bonito_pack_repository),
    _: CurrentUser = Depends(require_admin),
) -> BonitoPack:
    """
    Atualiza campos de um pack existente.
    """
    updated = repo.update(pack_id, payload)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pack não encontrado",
        )
    return updated


@router.post("/{pack_id}/activate", response_model=BonitoPack)
def activate_pack(
    pack_id: int,
    repo: BonitoPackRepository = Depends(get_bonito_pack_repository),
    _: CurrentUser = Depends(require_admin),
) -> BonitoPack:
    """
    Ativa um pack para exibição no catálogo público.
    """
    updated = repo.set_status(pack_id, BonitoPackStatus.ACTIVE)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pack não encontrado",
        )
    return updated


@router.post("/{pack_id}/deactivate", response_model=BonitoPack)
def deactivate_pack(
    pack_id: int,
    repo: BonitoPackRepository = Depends(get_bonito_pack_repository),
    _: CurrentUser = Depends(require_admin),
) -> BonitoPack:
    """
    Desativa um pack, removendo-o do catálogo sem apagar o histórico.
    """
    updated = repo.set_status(pack_id, BonitoPackStatus.INACTIVE)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pack não encontrado",
        )
    return updated
