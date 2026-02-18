
import json
from pathlib import Path
from typing import Any, Optional, Dict, List
from app.domain.orders.models import Order, OrderStatus, ManualProContact
from app.orders.repository import OrderRepository

class BridgePartnerNotFound(Exception):
    pass

class BridgeService:
    def __init__(self, order_repo: OrderRepository, config_path: Path) -> None:
        self._order_repo = order_repo
        self._config_path = config_path
        self._partners_config = self._load_partners_config()

    def _load_partners_config(self) -> List[Dict[str, Any]]:
        if not self._config_path.exists():
            return []
        with self._config_path.open("r", encoding="utf-8") as f:
            return json.load(f)

    def _find_bridge_partner(self, category: str, area: str) -> Optional[Dict[str, str]]:
        for entry in self._partners_config:
            if entry.get("category") == category and entry.get("area") == area:
                pros = entry.get("pros", [])
                return pros[0] if pros else None
        return None

    def create_order(self, category: str, area: str, client_id: int) -> Order:
        return self._order_repo.create(category=category, area=area, client_id=client_id)

    def manual_bridge(self, order_id: int) -> Dict[str, Any]:
        order = self._order_repo.get(order_id)
        partner = self._find_bridge_partner(order.category, order.area)
        
        if not partner:
            raise BridgePartnerNotFound(
                f"Nenhum parceiro Bridge manual para {order.category} em {order.area}"
            )

        contact = ManualProContact(
            name=partner["name"],
            phone=partner["phone"],
            source="partner_list",
        )

        order.status = OrderStatus.MANUAL_FORWARDING
        order.manual_pro_contact = contact
        order.manual_bridge_commission = 0.10  # 10% primeira utilização (Canon)
        self._order_repo.save(order)

        whatsapp_phone = contact.phone.replace("+", "")
        whatsapp_link = f"https://wa.me/{whatsapp_phone}"

        return {
            "orderId": order.id,
            "status": order.status.value,
            "proContact": {
                "name": contact.name,
                "phone": contact.phone,
                "whatsapp": whatsapp_link,
                "source": contact.source,
            },
            "commission": "10% primeira utilização",
            "paymentLink": f"stripe://checkout/order/{order.id}",
        }
