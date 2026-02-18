
from typing import Dict
from app.domain.orders.models import Order, OrderStatus

class OrderRepository:
    def __init__(self) -> None:
        self._orders: Dict[int, Order] = {}
        self._counter: int = 1

    def create(self, category: str, area: str, client_id: int) -> Order:
        order = Order(
            id=self._counter,
            category=category,
            area=area,
            status=OrderStatus.PENDING,
            client_id=client_id,
        )
        self._orders[self._counter] = order
        self._counter += 1
        return order

    def get(self, order_id: int) -> Order:
        if order_id not in self._orders:
            raise KeyError(f"Order {order_id} not found")
        return self._orders[order_id]

    def save(self, order: Order) -> Order:
        self._orders[order.id] = order
        return order

# Singleton instance for the system
order_repo = OrderRepository()

def get_order_repository() -> OrderRepository:
    return order_repo
