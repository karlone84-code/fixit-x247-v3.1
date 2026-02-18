
import asyncio
import json
from fastapi import APIRouter, Request, Depends, WebSocket, WebSocketDisconnect
from fastapi.responses import StreamingResponse
from app.core.security import UserClaims, get_current_user_claims
from datetime import datetime, timezone
from typing import Generator, Set

router = APIRouter(prefix="/realtime", tags=["events"])

class RadarManager:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except:
                continue

radar_manager = RadarManager()

@router.websocket("/sos-radar/{tenant_id}")
async def sos_radar_socket(websocket: WebSocket, tenant_id: int):
    """
    WebSocket Radar: Updates de 50ms (simulados) para telemetria de Pros e SOS ativos.
    """
    await radar_manager.connect(websocket)
    try:
        while True:
            # Em produção: Queries SQL agregadas com cache Redis
            radar_data = {
                "type": "RADAR_SYNC",
                "payload": {
                    "pros_online": 23,
                    "sos_active": 4,
                    "eta_avg": "6.5 min",
                    "system_load": "LOW"
                }
            }
            await websocket.send_json(radar_data)
            await asyncio.sleep(2) # Intervalo de atualização do Radar
    except WebSocketDisconnect:
        radar_manager.disconnect(websocket)

@router.get("/stream")
async def stream_events(
    request: Request, 
    user: UserClaims = Depends(get_current_user_claims)
):
    """
    SSE Stream: Eventos de mudança de estado de pedidos e notificações globais.
    """
    async def event_generator():
        try:
            while True:
                if await request.is_disconnected():
                    break
                
                # Mock de eventos reativos do ecossistema
                events = [
                    {
                        "type": "ORDER_UPDATE",
                        "payload": {"id": "sos-123", "status": "ASSIGNED", "pro": "Mário Canalizador"}
                    }
                ]
                
                for event in events:
                    yield f"data: {json.dumps(event)}\n\n"
                
                await asyncio.sleep(5)
        except asyncio.CancelledError:
            pass

    return StreamingResponse(event_generator(), media_type="text/event-stream")
