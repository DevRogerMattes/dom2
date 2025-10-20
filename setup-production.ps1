Write-Host "🚀 Configurando ambiente para produção..." -ForegroundColor Green

# Backup do arquivo .env atual
Copy-Item ".env" ".env.backup" -Force

Write-Host "📝 Atualizando URLs para produção..." -ForegroundColor Yellow

# Atualizar para URLs de produção
$envContent = @"
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
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8

Write-Host "✅ Configuração de produção aplicada!" -ForegroundColor Green
Write-Host "💡 Para voltar ao desenvolvimento, execute: Copy-Item '.env.backup' '.env' -Force" -ForegroundColor Cyan
Write-Host ""
Write-Host "🔧 Próximos passos:" -ForegroundColor Yellow
Write-Host "1. Execute: npm run build" -ForegroundColor White
Write-Host "2. Execute: npm run backend" -ForegroundColor White
Write-Host "3. Configure seu servidor web para servir os arquivos da pasta 'dist'" -ForegroundColor White
Write-Host "4. Configure proxy reverso para /api -> http://localhost:3001" -ForegroundColor White