#!/bin/bash

echo "🚀 Configurando ambiente para produção..."

# Backup do arquivo .env atual
cp .env .env.backup

# Atualizar para URLs de produção
echo "📝 Atualizando URLs para produção..."

cat > .env << 'EOF'
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51S9bLKF7jruBxPaDj4YDVNM7fO0v23GIqiPL0pVBCRE2vxQQRAq5lPxdvVO48uNsLHyD7Ce3B4axKGd0KEGvPXi100zMPFCFjQ
STRIPE_SECRET_KEY=sk_test_51S9bLKF7jruBxPaDg2Sbe0akfhZXR7TsHkrLvwHHSZqVfeTsPfAWUDCMCiaSVM4NPYMlaIWInjIwoRif5lu71G2a00ISL344lk
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration
VITE_APP_URL=http://domius.com.br
FRONTEND_URL=http://domius.com.br
VITE_API_URL=http://domius.com.br/api

# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@updatererp.cloud
SMTP_PASS=Flk@230509

# Database Configuration (produção)
DATABASE_URL=postgres://domius:rGr@2291755@postgres:5432/domius_db
PORT=3001
EOF

echo "✅ Configuração de produção aplicada!"
echo "💡 Para voltar ao desenvolvimento, execute: cp .env.backup .env"
echo ""
echo "🔧 Próximos passos:"
echo "1. Execute: npm run build"
echo "2. Execute: npm run backend"
echo "3. Configure seu servidor web para servir os arquivos da pasta 'dist'"
echo "4. Configure proxy reverso para /api -> http://localhost:3001"