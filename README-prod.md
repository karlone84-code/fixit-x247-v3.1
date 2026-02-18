# Fix.it x247 v3.1 — Produção 🔴

## Stack de Infraestrutura
- **Backend:** FastAPI + SQLAlchemy (Postgres) + Redis (SSE Events)
- **Frontend:** React + Tailwind (Neo-Brutalism/Glassmorphism)
- **IA:** Gemini 3 Flash (Kernel Intelligence)
- **Pagamentos:** Stripe (Escrow Engine)

## Variáveis de Ambiente (.env.prod)
| Variável | Descrição |
|----------|-----------|
| `API_KEY` | Chave Google Gemini (Obrigatória) |
| `DATABASE_URL` | String de conexão Postgres (Prod) |
| `STRIPE_SECRET_KEY` | Chave Privada Stripe LIVE |
| `STRIPE_WEBHOOK_SECRET` | Chave para validação de webhooks |
| `JWT_SECRET` | Chave mestre de encriptação de tokens |

## Comandos Críticos
```bash
# Iniciar Ecossistema em Prod
chmod +x scripts/deploy-prod.sh
./scripts/deploy-prod.sh

# Verificar logs do Sentinel
docker-compose logs -f backend

# Rollback de migrações
docker-compose run backend alembic downgrade -1
```

## Monitorização
- **Swagger UI:** `https://api.fixitx247.pt/docs`
- **Health Check:** `https://api.fixitx247.pt/health` ✅