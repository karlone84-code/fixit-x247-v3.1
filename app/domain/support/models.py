
from enum import Enum
from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SupportCategory(str, Enum):
    SOS = "SOS"
    DISPUTE = "DISPUTE"
    WALLET = "WALLET"
    COMPLIANCE = "COMPLIANCE"

class TicketStatus(str, Enum):
    OPEN = "OPEN"
    IA_RESOLVED = "IA_RESOLVED"
    HUMAN_RESOLVED = "HUMAN_RESOLVED"
    CLOSED = "CLOSED"

class ChatLogEntry(BaseModel):
    role: str  # "user" | "ai" | "admin" | "system"
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SupportTicket(BaseModel):
    id: str
    user_id: int
    role: str
    category: SupportCategory
    status: TicketStatus = TicketStatus.OPEN
    ai_summary: str
    chat_log: List[ChatLogEntry]
    escalated: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    resolved_at: Optional[datetime] = None
    # Compliance: Logs auditáveis retidos por 5 anos (Regra Canónica)
    retention_until: datetime
