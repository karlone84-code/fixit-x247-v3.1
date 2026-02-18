
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class KillswitchFlags(BaseModel):
    sos_enabled: bool = True
    bonito_enabled: bool = True
    feed_enabled: bool = True
    payment_gateway_enabled: bool = True
    pro_catalog_enabled: bool = True
    jobs_enabled: bool = True
    verse_enabled: bool = True
    ads_enabled: bool = True


class AuditLogEntry(BaseModel):
    id: str
    admin_id: int
    admin_name: str
    action: str
    module: str
    before: str
    after: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class SentinelStatus(BaseModel):
    api_latency_ms: int
    system_health_percent: int
    active_connections: int
    last_critical_alert: Optional[str] = None
