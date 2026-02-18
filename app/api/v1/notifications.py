
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.core.security import GenericUser, get_current_user
from app.notifications.service import _notif_repo
from app.domain.notifications.models import Notification

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/", response_model=List[Notification])
def get_my_notifications(user: GenericUser = Depends(get_current_user)):
    """Lista as notificações do utilizador autenticado."""
    return _notif_repo.list_by_user(user.id)

@router.patch("/{notif_id}/read", response_model=Notification)
def mark_read(notif_id: str, user: GenericUser = Depends(get_current_user)):
    """Marca uma notificação como lida."""
    notif = _notif_repo.mark_as_read(notif_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notificação não encontrada.")
    return notif
