
from datetime import datetime, timedelta, timezone
from typing import List, Dict, Optional
from app.domain.support.models import SupportTicket, SupportCategory, TicketStatus, ChatLogEntry

class SupportTicketRepository:
    def __init__(self):
        self._tickets: Dict[str, SupportTicket] = {}
        self._counter = 1

    def create(self, user_id: int, role: str, category: SupportCategory, ai_summary: str, chat_log: List[ChatLogEntry], escalated: bool) -> SupportTicket:
        ticket_id = f"T-{datetime.now().year}-{self._counter:05d}"
        self._counter += 1
        
        # Regra de Compliance: 5 anos de retenção
        retention_date = datetime.now(timezone.utc) + timedelta(days=5*365)
        
        ticket = SupportTicket(
            id=ticket_id,
            user_id=user_id,
            role=role,
            category=category,
            status=TicketStatus.OPEN,
            ai_summary=ai_summary,
            chat_log=chat_log,
            escalated=escalated,
            retention_until=retention_date
        )
        self._tickets[ticket_id] = ticket
        return ticket

    def get(self, ticket_id: str) -> Optional[SupportTicket]:
        return self._tickets.get(ticket_id)

    def list_pending_escalated(self) -> List[SupportTicket]:
        return [t for t in self._tickets.values() if t.escalated and t.status == TicketStatus.OPEN]

    def update_status(self, ticket_id: str, new_status: TicketStatus) -> Optional[SupportTicket]:
        if ticket_id not in self._tickets:
            return None
        ticket = self._tickets[ticket_id]
        ticket.status = new_status
        if new_status in [TicketStatus.IA_RESOLVED, TicketStatus.HUMAN_RESOLVED, TicketStatus.CLOSED]:
            ticket.resolved_at = datetime.now(timezone.utc)
        return ticket

class SupportService:
    def __init__(self, repo: SupportTicketRepository):
        self.repo = repo

    def open_ticket_from_ai(self, user_id: int, role: str, category: SupportCategory, summary: str, log: List[ChatLogEntry], escalated: bool) -> SupportTicket:
        return self.repo.create(user_id, role, category, summary, log, escalated)

    def resolve_ticket(self, ticket_id: str, method: str) -> Optional[SupportTicket]:
        status = TicketStatus.IA_RESOLVED if method == "IA" else TicketStatus.HUMAN_RESOLVED
        return self.repo.update_status(ticket_id, status)

# Singleton Instance for MVP
_global_repo = SupportTicketRepository()
def get_support_service():
    return SupportService(_global_repo)
