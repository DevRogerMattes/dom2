#!/bin/bash

echo "🚀 Iniciando deploy do DOM2..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para log
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERRO] $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[AVISO] $1${NC}"
}

# Verificar se está rodando como root ou com sudo
if [[ $EUID -eq 0 ]]; then
   warn "Rodando como root. Recomendamos usar um usuário não-root."
fi

# 1. Verificar dependências
log "Verificando dependências..."

# Node.js
if ! command -v node &> /dev/null; then
    error "Node.js não encontrado. Instale com: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
fi

# npm
if ! command -v npm &> /dev/null; then
    error "npm não encontrado. Instale o Node.js primeiro."
fi

# Git
if ! command -v git &> /dev/null; then
    error "Git não encontrado. Instale com: sudo apt update && sudo apt install git"
fi

log "✅ Dependências verificadas"

# 2. Clonar/atualizar repositório
REPO_DIR="/var/www/dom2"
if [ -d "$REPO_DIR" ]; then
    log "Atualizando repositório existente..."
    cd $REPO_DIR
    git pull origin main || error "Falha ao atualizar repositório"
else
    log "Clonando repositório..."
    sudo mkdir -p /var/www
    sudo git clone https://github.com/DevRogerMattes/dom2.git $REPO_DIR || error "Falha ao clonar repositório"
    sudo chown -R $USER:$USER $REPO_DIR
    cd $REPO_DIR
fi

# 3. Instalar dependências
log "Instalando dependências..."
npm install || error "Falha ao instalar dependências"

# 4. Configurar ambiente de produção
log "Configurando ambiente de produção..."
cp .env.example .env 2>/dev/null || warn "Arquivo .env.example não encontrado"

# Atualizar .env para produção
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

# 5. Build do frontend
log "Fazendo build do frontend..."
npm run build || error "Falha no build do frontend"

# 6. Instalar e configurar Nginx
log "Configurando Nginx..."
if ! command -v nginx &> /dev/null; then
    log "Instalando Nginx..."
    sudo apt update
    sudo apt install -y nginx
fi

# Criar configuração do Nginx
sudo tee /etc/nginx/sites-available/dom2 > /dev/null << 'EOF'
server {
    listen 80;
    server_name domius.com.br www.domius.com.br;
    
    root /var/www/dom2/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    
    # API proxy
    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # Static files with cache
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Logs
    access_log /var/log/nginx/dom2_access.log;
    error_log /var/log/nginx/dom2_error.log;
}
EOF

# Ativar site
sudo ln -sf /etc/nginx/sites-available/dom2 /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
sudo nginx -t || error "Configuração do Nginx inválida"

# Reiniciar Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx

# 7. Instalar e configurar PM2
log "Configurando PM2..."
if ! command -v pm2 &> /dev/null; then
    log "Instalando PM2..."
    sudo npm install -g pm2
fi

# Parar processos existentes do PM2
pm2 delete dom2-backend 2>/dev/null || true

# Criar arquivo de configuração do PM2
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'dom2-backend',
    script: 'src/server.ts',
    interpreter: 'npx',
    interpreter_args: 'tsx',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Criar diretório de logs
mkdir -p logs

# Iniciar aplicação com PM2
log "Iniciando backend com PM2..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup | grep -E '^sudo' | bash || warn "Falha ao configurar PM2 startup"

# 8. Configurar firewall (UFW)
log "Configurando firewall..."
if command -v ufw &> /dev/null; then
    sudo ufw allow 22/tcp   # SSH
    sudo ufw allow 80/tcp   # HTTP
    sudo ufw allow 443/tcp  # HTTPS
    sudo ufw --force enable 2>/dev/null || true
fi

# 9. Verificações finais
log "Realizando verificações finais..."

# Verificar se Nginx está rodando
if ! sudo systemctl is-active --quiet nginx; then
    error "Nginx não está rodando"
fi

# Verificar se PM2 está rodando
if ! pm2 list | grep -q "dom2-backend.*online"; then
    error "Backend não está rodando"
fi

# Testar endpoints
sleep 5
if curl -f http://localhost:3001/api/subscription-plans &>/dev/null; then
    log "✅ API está respondendo"
else
    warn "⚠️ API não está respondendo. Verifique os logs: pm2 logs"
fi

# 10. Configurar SSL com Let's Encrypt (opcional)
read -p "Deseja configurar SSL com Let's Encrypt? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    log "Configurando SSL..."
    
    # Instalar certbot
    sudo apt install -y snapd
    sudo snap install core; sudo snap refresh core
    sudo snap install --classic certbot
    sudo ln -sf /snap/bin/certbot /usr/bin/certbot
    
    # Obter certificado
    sudo certbot --nginx -d domius.com.br -d www.domius.com.br --non-interactive --agree-tos --email noreply@updatererp.cloud
    
    # Configurar renovação automática
    sudo systemctl enable --now snap.certbot.renew.timer
fi

echo ""
log "🎉 Deploy concluído com sucesso!"
echo ""
echo "📋 Resumo:"
echo "  • Frontend: http://domius.com.br"
echo "  • API: http://domius.com.br/api"
echo "  • Logs do backend: pm2 logs dom2-backend"
echo "  • Status dos serviços: pm2 status"
echo ""
echo "🔧 Comandos úteis:"
echo "  • Reiniciar backend: pm2 restart dom2-backend"
echo "  • Ver logs: pm2 logs"
echo "  • Status Nginx: sudo systemctl status nginx"
echo "  • Reiniciar Nginx: sudo systemctl restart nginx"
echo ""