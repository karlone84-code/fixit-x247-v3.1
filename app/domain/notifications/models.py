
from enum import Enum
from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field

class NotificationType(str, Enum):
    ORDER_STATUS = "ORDER_STATUS"
    PAYMENT = "PAYMENT"
    SUPPORT = "SUPPORT"
    SYSTEM = "SYSTEM"

class Notification(BaseModel):
    id: str
    user_id: int
    type: NotificationType
    title: str
    content: str
    metadata: Dict[str, Any] = {} # ex: {"order_id": 123}
    is_read: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
