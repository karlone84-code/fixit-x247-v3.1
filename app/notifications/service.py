
from typing import List, Dict, Optional
from datetime import datetime
from app.domain.notifications.models import Notification, NotificationType

class NotificationRepository:
    def __init__(self):
        self._notifications: Dict[str, Notification] = {}
        self._counter = 1

    def create(self, user_id: int, type: NotificationType, title: str, content: str, metadata: dict) -> Notification:
        notif_id = f"N-{self._counter:06d}"
        notif = Notification(
            id=notif_id,
            user_id=user_id,
            type=type,
            title=title,
            content=content,
            metadata=metadata
        )
        self._notifications[notif_id] = notif
        self._counter += 1
        return notif

    def list_by_user(self, user_id: int) -> List[Notification]:
        return sorted(
            [n for n in self._notifications.values() if n.user_id == user_id],
            key=lambda x: x.created_at,
            reverse=True
        )

    def mark_as_read(self, notif_id: str) -> Optional[Notification]:
        if notif_id in self._notifications:
            self._notifications[notif_id].is_read = True
            return self._notifications[notif_id]
        return None

# Singleton
_notif_repo = NotificationRepository()

class NotificationService:
    def __init__(self, repo: NotificationRepository):
        self.repo = repo

    def notify_order_update(self, user_id: int, order_id: int, status: str):
        return self.repo.create(
            user_id=user_id,
            type=NotificationType.ORDER_STATUS,
            title="Atualização de Pedido",
            content=f"O seu pedido #{order_id} mudou para: {status}",
            metadata={"order_id": order_id}
        )

    def notify_payment_success(self, user_id: int, order_id: int, amount: int):
        return self.repo.create(
            user_id=user_id,
            type=NotificationType.PAYMENT,
            title="Pagamento Confirmado",
            content=f"Recebemos o pagamento de {amount/100:.2f}€ para o pedido #{order_id}.",
            metadata={"order_id": order_id}
        )

notification_service = NotificationService(_notif_repo)
