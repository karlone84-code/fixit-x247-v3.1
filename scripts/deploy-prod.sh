#!/bin/bash
# Kernel Deployment Protocol x247 v3.1
# Autor: Senior Frontend/Backend Engineer

set -e

echo "🚀 Iniciando Deployment de Produção - Fix.it x247 v3.1"

# 1. Validação de Ambiente
if [ -z "$API_KEY" ]; then
    echo "❌ Erro: API_KEY do Gemini não detectada."
    exit 1
fi

# 2. Limpeza de Cache & Node Modules (Nuclear Fix)
echo "🧹 Limpando caches e garantindo integridade dos módulos..."
rm -rf node_modules .expo dist
npm install

# 3. Build Backend (FastAPI)
echo "📦 Building Backend Image..."
docker build -t fixit-backend-prod:latest -f backend/Dockerfile .

# 4. Build Frontend (React Web-Hybrid)
echo "📦 Building Frontend Assets..."
npm run build

# 5. Migrações de Base de Dados
echo "⚙️ Executando migrações SQL (Alembic)..."
docker-compose run --rm backend alembic upgrade head

# 6. Startup de Infraestrutura
echo "🛰️ Lançando Sentinel e Motor Central..."
docker-compose -f docker-compose.yml up -d

echo "✅ Ecossistema Online em: https://api.fixitx247.pt"
echo "✅ Frontend Distribuído via CDN Vercel/Railway."