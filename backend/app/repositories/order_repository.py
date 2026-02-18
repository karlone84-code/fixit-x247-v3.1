
from typing import List
from sqlalchemy.orm import Session
from sqlalchemy import select
from backend.app.models.database import Order, OrderStatus
from .base import BaseRepository

class OrderRepository(BaseRepository[Order]):
    def __init__(self, session: Session, tenant_id: int):
        super().__init__(Order, session, tenant_id)

    def list_by_client(self, client_id: int) -> List[Order]:
        """Lista pedidos de um cliente específico no tenant."""
        query = select(self.model).where(
            self.model.tenant_id == self.tenant_id,
            self.model.client_id == client_id
        ).order_by(self.model.created_at.desc())
        return list(self.session.execute(query).scalars().all())

    def list_by_pro(self, pro_id: int) -> List[Order]:
        """Lista pedidos atribuídos a um profissional no tenant."""
        query = select(self.model).where(
            self.model.tenant_id == self.tenant_id,
            self.model.pro_id == pro_id
        ).order_by(self.model.created_at.desc())
        return list(self.session.execute(query).scalars().all())

    def update_status(self, order_id: int, new_status: OrderStatus) -> Order | None:
        """Atualiza estado do pedido garantindo o contexto do tenant."""
        return self.update(order_id, status=new_status)
