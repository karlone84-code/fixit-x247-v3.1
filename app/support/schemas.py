
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from app.domain.support.models import SupportCategory, TicketStatus, ChatLogEntry

class CreateTicketRequest(BaseModel):
    user_id: int
    user_role: str
    category: SupportCategory
    ai_summary: str
    chat_log: List[ChatLogEntry]
    escalated: bool = False

class UpdateTicketStatusRequest(BaseModel):
    status: TicketStatus

class SupportTicketResponse(BaseModel):
    id: str
    user_id: int
    role: str
    category: SupportCategory
    status: TicketStatus
    ai_summary: str
    chat_log: List[ChatLogEntry]
    escalated: bool
    created_at: datetime
    resolved_at: Optional[datetime] = None
    retention_until: datetime
