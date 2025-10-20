Write-Host "🔧 Configurando ambiente para desenvolvimento..." -ForegroundColor Green

# Restaurar arquivo de desenvolvimento
$envContent = @"
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51S9bLKF7jruBxPaDj4YDVNM7fO0v23GIqiPL0pVBCRE2vxQQRAq5lPxdvVO48uNsLHyD7Ce3B4axKGd0KEGvPXi100zMPFCFjQ
STRIPE_SECRET_KEY=sk_test_51S9bLKF7jruBxPaDg2Sbe0akfhZXR7TsHkrLvwHHSZqVfeTsPfAWUDCMCiaSVM4NPYMlaIWInjIwoRif5lu71G2a00ISL344lk
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# App Configuration (desenvolvimento)
VITE_APP_URL=http://localhost:8080
FRONTEND_URL=http://localhost:8080
VITE_API_URL=

# Email Configuration
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=587
SMTP_USER=noreply@updatererp.cloud
SMTP_PASS=Flk@230509

# Database Configuration (desenvolvimento)
DATABASE_URL=postgres://username:password@localhost:5432/domius_db
PORT=3001
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "✅ Configuração de desenvolvimento aplicada!" -ForegroundColor Green
Write-Host "🚀 Para executar em desenvolvimento:" -ForegroundColor Yellow
Write-Host "1. Execute: npm run dev (frontend)" -ForegroundColor White
Write-Host "2. Execute: npm run backend (backend)" -ForegroundColor White