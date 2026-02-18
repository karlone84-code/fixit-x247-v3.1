
from __future__ import annotations
from datetime import datetime
from typing import List, Dict
from .models import WalletTransaction, WalletTransactionType

class WalletRepository:
    def __init__(self):
        self._transactions: Dict[int, WalletTransaction] = {}
        self._counter = 1

    def create(self, tx: WalletTransaction) -> WalletTransaction:
        self._transactions[tx.id] = tx
        return tx

class WalletService:
    def __init__(self, repo: WalletRepository):
        self._repo = repo
        self._counter = 1

    def add_transaction(
        self,
        *,
        order_id: int,
        user_id: int,
        amount_cents: int,
        tx_type: WalletTransactionType,
        model: str,
        commission_rate: float | None,
    ) -> WalletTransaction:
        tx = WalletTransaction(
            id=self._counter,
            order_id=order_id,
            user_id=user_id,
            amount_cents=amount_cents,
            tx_type=tx_type,
            model=model,
            commission_rate=commission_rate
        )
        self._counter += 1
        return self._repo.create(tx)

# Singleton Instance
_wallet_repo = WalletRepository()
wallet_service = WalletService(_wallet_repo)

def get_wallet_service() -> WalletService:
    return wallet_service
