
from enum import Enum
from pydantic import BaseModel, Field

class CommissionModel(str, Enum):
    INTERNAL = "INTERNAL"  # 15% (Canon Standard)
    BRIDGE = "BRIDGE"      # 10% (Canon Bridge Manual)

class PaymentSplit(BaseModel):
    total_amount: int  # em cêntimos
    platform_amount: int
    pro_amount: int
    commission_rate: float
    model: CommissionModel

class CheckoutRequest(BaseModel):
    order_id: int
    amount_cents: int = Field(..., ge=100)  # Mínimo 1€
    commission_rate: float = Field(..., ge=0.0, le=0.5)

class CheckoutResponse(BaseModel):
    client_secret: str
    split: PaymentSplit
