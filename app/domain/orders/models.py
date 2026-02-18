
from enum import Enum
from typing import Optional
from pydantic import BaseModel, Field

class OrderStatus(str, Enum):
    PENDING = "PENDING"
    MANUAL_FORWARDING = "MANUAL_FORWARDING"
    ASSIGNED = "ASSIGNED"
    COMPLETED = "COMPLETED"

class ManualProContact(BaseModel):
    name: str
    phone: str
    source: str  # ex.: "partner_list" ou "google_maps"

class Order(BaseModel):
    id: int
    category: str
    area: str
    status: OrderStatus
    client_id: int
    manual_pro_contact: Optional[ManualProContact] = None
    manual_bridge_commission: float = 0.0  # 0.10 na 1ª vez
