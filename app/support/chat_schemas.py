
from __future__ import annotations
from typing import Literal, List, Optional
from pydantic import BaseModel, Field
from app.domain.support.models import SupportCategory

class ChatTurn(BaseModel):
    role: Literal["user", "ai", "admin"]
    content: str

class ChatRequest(BaseModel):
    user_id: int
    user_role: str = Field(..., example="CLIENT")
    category: SupportCategory
    message: str
    history: List[ChatTurn] = []

class ChatResponse(BaseModel):
    reply: str
    ticket_id: str
    escalated: bool
    status: str
