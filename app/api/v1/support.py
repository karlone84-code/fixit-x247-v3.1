
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import AdminUser, CurrentUser, get_current_user
from app.support.service import SupportService, get_support_service
from app.support.schemas import CreateTicketRequest, UpdateTicketStatusRequest, SupportTicketResponse

router = APIRouter(prefix="/support", tags=["support"])

@router.post("/tickets", response_model=SupportTicketResponse, status_code=status.HTTP_201_CREATED)
def create_support_ticket(
    payload: CreateTicketRequest,
    service: SupportService = Depends(get_support_service)
):
    """
    Cria um ticket de suporte (normalmente disparado pelo Flix AI).
    Regra Canónica: Conversas auditáveis 5 anos.
    """
    ticket = service.open_ticket_from_ai(
        payload.user_id, 
        payload.user_role, 
        payload.category, 
        payload.ai_summary, 
        payload.chat_log, 
        payload.escalated
    )
    return ticket

@router.get("/tickets/pending", response_model=List[SupportTicketResponse])
def list_pending_tickets(
    admin: AdminUser,
    service: SupportService = Depends(get_support_service)
):
    """
    Lista tickets escalados abertos para intervenção humana.
    """
    return service.repo.list_pending_escalated()

@router.patch("/tickets/{ticket_id}/status", response_model=SupportTicketResponse)
def update_status(
    ticket_id: str,
    payload: UpdateTicketStatusRequest,
    admin: AdminUser,
    service: SupportService = Depends(get_support_service)
):
    """
    Atualiza o estado de um ticket (Admin ou Super Admin).
    """
    ticket = service.repo.update_status(ticket_id, payload.status)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket não encontrado.")
    return ticket
