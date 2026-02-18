
from __future__ import annotations
from fastapi import APIRouter, HTTPException, Request, status, Depends
from app.orders.repository import OrderRepository, get_order_repository
from app.domain.orders.models import OrderStatus
from app.wallet.service import WalletService, get_wallet_service
from app.wallet.models import WalletTransactionType

router = APIRouter(prefix="/payments/webhooks", tags=["payments-webhooks"])

@router.post("/stripe", status_code=status.HTTP_200_OK)
async def stripe_webhook(
    request: Request,
    order_repo: OrderRepository = Depends(get_order_repository),
    wallet_service: WalletService = Depends(get_wallet_service)
) -> dict:
    """
    Handler de sucesso do Stripe.
    - Atualiza Ordem para o estado de pagamento confirmado.
    - Regista entrada em Escrow na Wallet do sistema.
    """
    payload = await request.json()
    event_type = payload.get("type")
    data_object = payload.get("data", {}).get("object", {})

    if event_type != "payment_intent.succeeded":
        return {"received": True, "action": "ignored"}

    metadata = data_object.get("metadata") or {}
    order_id_str = metadata.get("order_id")
    commission_rate_str = metadata.get("commission_rate")
    model = metadata.get("model")

    if not order_id_str:
        raise HTTPException(status_code=400, detail="Metadata 'order_id' em falta.")

    order_id = int(order_id_str)
    amount = data_object.get("amount_received")

    try:
        order = order_repo.get(order_id)
    except KeyError:
        return {"received": True, "error": "Order not found during webhook"}

    # Idempotência
    if order.status not in (OrderStatus.PENDING, OrderStatus.MANUAL_FORWARDING):
        return {"received": True, "status": "already_processed"}

    # Atualizar Order
    order.status = OrderStatus.ASSIGNED # No canon, após pagamento é Assigned
    order_repo.save(order)

    # Wallet Entry
    wallet_service.add_transaction(
        order_id=order.id,
        user_id=order.client_id,
        amount_cents=amount,
        tx_type=WalletTransactionType.ESCROW_IN,
        model=model or "INTERNAL",
        commission_rate=float(commission_rate_str) if commission_rate_str else 0.15
    )

    print(f"[SENTINEL] Payment Confirmed: Order #{order_id} | Escrow Locked: {amount/100}€")
    return {"received": True, "order_id": order_id, "escrow": "active"}
