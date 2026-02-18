
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select, func
from backend.app.models.database import WalletTransaction, TxType
from .base import BaseRepository

class WalletRepository(BaseRepository[WalletTransaction]):
    def __init__(self, session: Session, tenant_id: int):
        super().__init__(WalletTransaction, session, tenant_id)

    def get_user_balance(self, user_id: int) -> int:
        """Calcula o saldo disponível (cêntimos) de um utilizador no tenant."""
        # Nota: Lógica simplificada. Realidade: soma de IN - OUT, considerando Escrow em separado.
        query_in = select(func.sum(self.model.amount_cents)).where(
            self.model.tenant_id == self.tenant_id,
            self.model.user_id == user_id,
            self.model.tx_type.in_([TxType.ESCROW_OUT, TxType.FEE]) == False # Simplificação
        )
        # Em produção: usar agregação robusta por tipo de transação
        return self.session.execute(query_in).scalar() or 0

    def list_user_history(self, user_id: int) -> List[WalletTransaction]:
        """Extrato de transações do utilizador no tenant."""
        query = select(self.model).where(
            self.model.tenant_id == self.tenant_id,
            self.model.user_id == user_id
        ).order_by(self.model.created_at.desc())
        return list(self.session.execute(query).scalars().all())
