
from pydantic import BaseModel, Field

class CreateOrderRequest(BaseModel):
    category: str = Field(..., example="Canalização")
    area: str = Field(..., example="Almada")
    client_id: int = Field(..., ge=1, example=123)

class ManualBridgeResponseProContact(BaseModel):
    name: str
    phone: str
    whatsapp: str
    source: str

class ManualBridgeResponse(BaseModel):
    orderId: int
    status: str
    proContact: ManualBridgeResponseProContact
    commission: str
    paymentLink: str
