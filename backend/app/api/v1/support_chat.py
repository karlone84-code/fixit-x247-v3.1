from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import UserClaims, get_current_user_claims
from app.support.gemini_client import gemini_engine
from app.models.database import SupportTicket
from datetime import datetime, timedelta, timezone
import uuid

router = APIRouter(prefix="/support/chat", tags=["flix-ai"])

@router.post("/")
async def flix_chat_proxy(
    payload: dict,
    user: UserClaims = Depends(get_current_user_claims),
    db: Session = Depends(get_db)
):
    """
    Proxy Seguro Flix AI v3.1.
    Gere auditoria automática e regras de escalonamento Sentinel.
    """
    message = payload.get("message")
    history = payload.get("history", [])
    category = payload.get("category", "GENERAL").upper()

    if not message:
        raise HTTPException(status_code=400, detail="Mensagem vazia.")

    # Instrução de Sistema Canónica v3.1 - Personalidade Flix
    system_instr = (
        "És o Flix, o assistente IA oficial da Fix.it x247 em Almada e Setúbal. "
        "Operamos 24/7 em SOS, Serviços+, Emprego e UX247verse. "
        "Regras Absolutas:\n"
        "1. Responde sempre em Português de Portugal (PT-PT).\n"
        "2. Sê empático, curto e profissional.\n"
        "3. Usa SEMPRE 'Bonito Serviço' no fecho.\n"
        "4. Pagamentos: Apenas via App ou MB WAY 937 321 338.\n"
        "5. SOS: Recomenda urgência e contacto direto se houver perigo.\n"
        "6. Se houver queixa/disputa: 'Vou abrir um ticket prioritário para análise humana'."
    )

    # 1. Resposta IA
    reply = await gemini_engine.chat(message, history, system_instr)

    # 2. Lógica de Escalonamento Automático (Sentinel Protocol)
    critical_triggers = ["reembolso", "disputa", "policia", "burla", "advogado", "estorno", "mentira"]
    is_critical = any(trigger in message.lower() for trigger in critical_triggers)
    
    escalated = category in ["DISPUTE", "COMPLIANCE"] or is_critical
    status = "OPEN" if escalated else "IA_RESOLVED"

    # 3. Registo de Auditoria (Compliance 5 Anos)
    ticket_id = f"T-{str(uuid.uuid4())[:6].upper()}"
    new_ticket = SupportTicket(
        id=ticket_id,
        tenant_id=user.tenant_id,
        user_id=user.user_id,
        category=category,
        status=status,
        created_at=datetime.now(timezone.utc),
        retention_until=datetime.now(timezone.utc) + timedelta(days=5*365)
    )
    
    db.add(new_ticket)
    db.commit()

    if escalated:
        print(f"[SENTINEL ALERT] Suporte Escalonado: Ticket {ticket_id} para Utilizador {user.user_id}")

    return {
        "reply": reply,
        "ticket_id": ticket_id,
        "escalated": escalated,
        "status": status,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }