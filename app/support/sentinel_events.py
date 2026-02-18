
from __future__ import annotations
from datetime import datetime
from typing import Any

class SentinelEventEmitter:
    def emit(self, event_type: str, payload: dict[str, Any]) -> None:
        """
        MVP: Log em console para telemetria inicial.
        Futuro: Publicação em Event Mesh (Redis/Kafka) para dashboards em tempo real.
        """
        timestamp = datetime.utcnow().isoformat()
        print(f"[SENTINEL EVENT] {timestamp} | {event_type} | Payload: {payload}")
