
from pathlib import Path
from fastapi import APIRouter, HTTPException, status
from app.core.security import AdminUser
from app.orders.bridge_service import BridgePartnerNotFound, BridgeService, InMemoryOrderRepository
from app.orders.schemas import CreateOrderRequest, ManualBridgeResponse

router = APIRouter(prefix="/orders", tags=["orders"])

# Persistência em memória para MVP
_ORDER_REPO = InMemoryOrderRepository()
_CONFIG_PATH = Path("config/partners_bridge.json")
_BRIDGE_SERVICE = BridgeService(order_repo=_ORDER_REPO, config_path=_CONFIG_PATH)

@router.post("/", response_model=dict)
def create_order(payload: CreateOrderRequest):
    order = _BRIDGE_SERVICE.create_order(
        category=payload.category, area=payload.area, client_id=payload.client_id
    )
    return {"order": order.model_dump()}

@router.post(
    "/manual-bridge/{order_id}",
    response_model=ManualBridgeResponse,
    status_code=status.HTTP_200_OK,
)
def manual_bridge(order_id: int, current_admin: AdminUser):
    """
    Aciona o encaminhamento manual para um parceiro externo.
    Regra Canónica: Apenas Administradores podem acionar esta porta de fallback.
    """
    try:
        result = _BRIDGE_SERVICE.manual_bridge(order_id=order_id)
        return ManualBridgeResponse(**result)
    except KeyError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pedido {order_id} não encontrado no sistema.",
        )
    except BridgePartnerNotFound as exc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(exc),
        )
