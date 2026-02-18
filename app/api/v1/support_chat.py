
from __future__ import annotations
from fastapi import APIRouter, Depends
from app.support.chat_schemas import ChatRequest, ChatResponse
from app.support.chat_service import ChatSupportService
from app.support.gemini_client import GeminiClient
from app.support.sentinel_events import SentinelEventEmitter
from app.support.service import get_support_service, SupportService

router = APIRouter(prefix="/support/chat", tags=["support-chat"])

def get_chat_support_orchestrator(
    support_service: SupportService = Depends(get_support_service)
) -> ChatSupportService:
    gemini = GeminiClient(api_key="STUB_KEY")
    sentinel = SentinelEventEmitter()
    return ChatSupportService(support_service, gemini, sentinel)

@router.post("/", response_model=ChatResponse)
async def flix_ai_chat(
    payload: ChatRequest,
    orchestrator: ChatSupportService = Depends(get_chat_support_orchestrator),
) -> ChatResponse:
    """
    Interface de chat com o Flix AI. 
    Cria automaticamente tickets de suporte para auditoria e compliance (5 anos).
    """
    result = await orchestrator.handle_chat(payload)
    return ChatResponse(**result)
