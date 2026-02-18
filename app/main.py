
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import bonito_packs, admin, orders, support, support_chat, notifications, legal, ux247verse
from app.payments import router as payments_router
from app.payments import webhooks as payments_webhooks

app = FastAPI(
    title="Fix.it x247 API v3.1",
    description="Motor de serviços verticais, gestão administrativa e pagamentos x247.",
    version="3.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão de rotas
app.include_router(bonito_packs.router)
app.include_router(admin.router)
app.include_router(orders.router)
app.include_router(support.router)
app.include_router(support_chat.router)
app.include_router(notifications.router)
app.include_router(legal.router)
app.include_router(ux247verse.router)
app.include_router(payments_router.router)
app.include_router(payments_webhooks.router)

@app.get("/health")
def health_check():
    return {"status": "online", "engine": "Fix.it x247 v3.1", "sentinel": "active"}
