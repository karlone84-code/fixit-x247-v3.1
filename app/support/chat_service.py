
from __future__ import annotations
from typing import Any, Dict
from .chat_schemas import ChatRequest, ChatTurn
from .gemini_client import GeminiClient
from .sentinel_events import SentinelEventEmitter
from .service import SupportService
from app.domain.support.models import SupportCategory, ChatLogEntry

class ChatSupportService:
    def __init__(
        self,
        support_service: SupportService,
        gemini_client: GeminiClient,
        sentinel: SentinelEventEmitter,
    ) -> None:
        self._support_service = support_service
        self._gemini = gemini_client
        self._sentinel = sentinel

    async def handle_chat(self, payload: ChatRequest) -> Dict[str, Any]:
        # 1. Obter resposta da IA
        ai_reply = await self._gemini.chat(
            message=payload.message,
            history=payload.history,
        )

        # 2. Lógica de Escalonamento (Regra Canónica: DISPUTE e COMPLIANCE são críticos)
        escalated = payload.category in (
            SupportCategory.DISPUTE,
            SupportCategory.COMPLIANCE,
        )

        # 3. Preparar Log de Chat para Compliance (Retenção 5 anos)
        chat_log = [
            ChatLogEntry(role=turn.role, content=turn.content)
            for turn in payload.history
        ]
        chat_log.append(ChatLogEntry(role="user", content=payload.message))
        chat_log.append(ChatLogEntry(role="ai", content=ai_reply))

        summary = f"Conversa IA com {payload.user_role} sobre {payload.category.value}"

        # 4. Registar Ticket no Domínio
        ticket = self._support_service.open_ticket_from_ai(
            user_id=payload.user_id,
            role=payload.user_role,
            category=payload.category,
            summary=summary,
            log=chat_log,
            escalated=escalated,
        )

        # 5. Emitir Alerta para Sentinel se Crítico
        if escalated or payload.category == SupportCategory.COMPLIANCE:
            self._sentinel.emit(
                event_type="SupportTicketEscalated",
                payload={
                    "ticket_id": ticket.id,
                    "user_id": ticket.user_id,
                    "category": ticket.category.value,
                    "escalated": ticket.escalated,
                },
            )

        return {
            "reply": ai_reply,
            "ticket_id": ticket.id,
            "escalated": escalated,
            "status": ticket.status.value,
        }
