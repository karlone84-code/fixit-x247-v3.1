
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import AdminUser, SuperAdminUser
from app.domain.admin.models import KillswitchFlags, AuditLogEntry, SentinelStatus

router = APIRouter(
    prefix="/admin/governance",
    tags=["admin-governance"],
)

# Mock Storage (Em produção: Redis/Postgres)
CURRENT_FLAGS = KillswitchFlags()
AUDIT_LOGS: List[AuditLogEntry] = []

@router.get("/flags", response_model=KillswitchFlags)
def get_feature_flags(admin: AdminUser):
    """Retorna o estado atual dos módulos (Killswitch)."""
    return CURRENT_FLAGS

@router.post("/flags/toggle/{flag_name}", response_model=KillswitchFlags)
def toggle_feature_flag(flag_name: str, super_admin: SuperAdminUser):
    """
    Super Admin: Liga/Desliga um módulo global.
    Emite evento para o Sentinel e gera log de auditoria.
    """
    global CURRENT_FLAGS
    if not hasattr(CURRENT_FLAGS, flag_name):
        raise HTTPException(status_code=404, detail="Módulo não encontrado.")
    
    old_val = getattr(CURRENT_FLAGS, flag_name)
    new_val = not old_val
    setattr(CURRENT_FLAGS, flag_name, new_val)
    
    # Simular emissão de evento e log
    log = AuditLogEntry(
        id=str(len(AUDIT_LOGS) + 1),
        admin_id=super_admin.id,
        admin_name=super_admin.email,
        action=f"TOGGLE_{flag_name.upper()}",
        module="KILLSWITCH",
        before=str(old_val),
        after=str(new_val)
    )
    AUDIT_LOGS.append(log)
    
    return CURRENT_FLAGS

@router.get("/sentinel/status", response_model=SentinelStatus)
def get_sentinel_status(admin: AdminUser):
    """Métricas de saúde do sistema em tempo real."""
    return SentinelStatus(
        api_latency_ms=42,
        system_health_percent=99,
        active_connections=156,
        last_critical_alert=None
    )

@router.get("/audit", response_model=List[AuditLogEntry])
def get_audit_trail(super_admin: SuperAdminUser):
    """Trilho de auditoria completo (Exclusivo Super Admin)."""
    return AUDIT_LOGS
