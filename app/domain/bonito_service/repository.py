from datetime import datetime, timezone
from typing import Dict, List, Optional

from .models import (
    BonitoPack,
    BonitoPackCreate,
    BonitoPackStatus,
    BonitoPackUpdate,
)


class BonitoPackRepository:
    """
    Repositório de persistência para packs Bonito Serviço.
    """

    def __init__(self) -> None:
        self._storage: Dict[int, BonitoPack] = {}
        self._next_id: int = 1

    def list_all(self, include_inactive: bool = True) -> List[BonitoPack]:
        if include_inactive:
            return list(self._storage.values())
        return [p for p in self._storage.values() if p.status == BonitoPackStatus.ACTIVE]

    def get(self, pack_id: int) -> Optional[BonitoPack]:
        return self._storage.get(pack_id)

    def create(self, data: BonitoPackCreate) -> BonitoPack:
        now = datetime.now(timezone.utc)
        pack = BonitoPack(
            id=self._next_id,
            criado_em=now,
            atualizado_em=now,
            status=BonitoPackStatus.ACTIVE,
            **data.model_dump(),
        )
        self._storage[self._next_id] = pack
        self._next_id += 1
        return pack

    def update(self, pack_id: int, data: BonitoPackUpdate) -> Optional[BonitoPack]:
        existing = self._storage.get(pack_id)
        if not existing:
            return None
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(existing, field, value)
        existing.atualizado_em = datetime.now(timezone.utc)
        self._storage[pack_id] = existing
        return existing

    def set_status(self, pack_id: int, status: BonitoPackStatus) -> Optional[BonitoPack]:
        existing = self._storage.get(pack_id)
        if not existing:
            return None
        existing.status = status
        existing.atualizado_em = datetime.now(timezone.utc)
        self._storage[pack_id] = existing
        return existing
