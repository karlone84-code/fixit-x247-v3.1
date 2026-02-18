
from __future__ import annotations
from datetime import datetime
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field

class WalletTransactionType(str, Enum):
    ESCROW_IN = "ESCROW_IN"
    ESCROW_OUT = "ESCROW_OUT"
    REFUND = "REFUND"
    FEE = "FEE"

class WalletTransaction(BaseModel):
    id: int
    order_id: int
    user_id: int
    amount_cents: int
    tx_type: WalletTransactionType
    model: str          # INTERNAL | BRIDGE
    commission_rate: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
