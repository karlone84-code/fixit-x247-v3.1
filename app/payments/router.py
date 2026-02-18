
from __future__ import annotations
from fastapi import APIRouter, HTTPException, status, Depends
from pydantic import BaseModel, Field
from app.payments.domain import calculate_split
from app.orders.repository import OrderRepository, get_order_repository
from app.domain.orders.models import OrderStatus
from app.domain.payments.models import CommissionModel

router = APIRouter(prefix="/payments", tags=["payments"])

class CheckoutRequest(BaseModel):
    order_id: int
    amount_cents: int = Field(..., ge=100)
    commission_rate: float = Field(..., ge=0.0, le=0.5)
    model: str = Field(..., pattern="^(INTERNAL|BRIDGE)$")

class CheckoutResponse(BaseModel):
    client_secret: str
    split: dict

@router.post("/checkout", response_model=CheckoutResponse)
def create_checkout_session(
    payload: CheckoutRequest, 
    order_repo: OrderRepository = Depends(get_order_repository)
) -> CheckoutResponse:
    """
    Inicia o fluxo de pagamento para uma Ordem.
    Valida estado e prepara metadados para reconciliação no Webhook.
    """
    try:
        order = order_repo.get(payload.order_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Ordem não encontrada.")

    if order.status not in (OrderStatus.PENDING, OrderStatus.MANUAL_FORWARDING):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Ordem {order.id} em estado inválido para pagamento: {order.status}."
        )

    # 2. Calcular split 90/10 ou 85/15
    split = calculate_split(
        total_amount=payload.amount_cents,
        commission_rate=payload.commission_rate,
        model=CommissionModel(payload.model)
    )

    # 3. Metadados para Stripe
    metadata = {
        "order_id": str(order.id),
        "commission_rate": str(payload.commission_rate),
        "model": payload.model
    }

    # Placeholder para o Stripe PaymentIntent
    client_secret = f"pi_test_{order.id}_secret_{payload.amount_cents}"

    return CheckoutResponse(
        client_secret=client_secret,
        split={
            "total_amount": split.total_amount,
            "platform_amount": split.platform_amount,
            "pro_amount": split.pro_amount,
            "model": split.model,
            "metadata": metadata
        }
    )
