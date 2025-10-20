# 🚀 Guia de Deploy - Correção do Erro ERR_CONNECTION_REFUSED

## ❌ Problema Identificado
O erro `net::ERR_CONNECTION_REFUSED` ocorre porque o frontend está tentando fazer chamadas para `localhost:3001` quando está rodando na VPS. Em produção, essas URLs precisam apontar para o domínio correto.

## ✅ Soluções Implementadas

### 1. **Configuração Dinâmica de API**
Criamos o arquivo `src/config/api.ts` que detecta automaticamente o ambiente:
- **Desenvolvimento**: Usa proxy do Vite (`/api`)
- **Produção**: Usa variável de ambiente ou constrói URL baseada no domínio atual

### 2. **Arquivos Atualizados**
Todos os arquivos que faziam chamadas diretas para `localhost:3001` foram atualizados:
- ✅ `src/hooks/useSubscription.ts`
- ✅ `src/pages/Institucional.tsx`  
- ✅ `src/pages/ProdutosCriados.tsx`
- ✅ `src/contexts/AuthContext.tsx`

### 3. **Scripts de Configuração**
Criamos scripts para facilitar a troca entre ambientes:
- `setup-production.ps1` - Configura para produção
- `setup-development.ps1` - Volta para desenvolvimento

## 🔧 Deploy na VPS

### Passo 1: Configurar Produção
```powershell
# Execute no PowerShell
.\setup-production.ps1
```

### Passo 2: Build do Frontend
```bash
npm run build
```

### Passo 3: Configurar Servidor Web (Nginx)
```nginx
server {
    listen 80;
    server_name domius.com.br;
    
    # Servir arquivos estáticos do frontend
    root /caminho/para/dom2/dist;
    index index.html;
    
    # Proxy para API do backend
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
    }
    
    # Fallback para SPA (Single Page Application)
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Passo 4: Iniciar Backend
```bash
npm run backend
# ou para manter rodando em background:
nohup npm run backend > backend.log 2>&1 &
```

### Passo 5: Configurar PM2 (Recomendado)
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar com PM2
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save
pm2 startup
```

## 🌍 Variáveis de Ambiente

### Produção (.env)
```env
VITE_APP_URL=http://domius.com.br
FRONTEND_URL=http://domius.com.br
VITE_API_URL=http://domius.com.br/api
```

### Desenvolvimento (.env)
```env
VITE_APP_URL=http://localhost:8080
FRONTEND_URL=http://localhost:8080
VITE_API_URL=
```

## 🔍 Verificação

### 1. Testar API
```bash
curl http://domius.com.br/api/subscription-plans
```

### 2. Verificar Frontend
- Abra `http://domius.com.br`
- Verifique se não há erros no console do navegador
- Teste o login/cadastro

### 3. Logs do Backend
```bash
# Com PM2
pm2 logs backend

# Direto
tail -f backend.log
```

## 🛠️ Troubleshooting

### Problema: Ainda recebo ERR_CONNECTION_REFUSED
**Solução**: 
1. Verifique se o backend está rodando: `pm2 status`
2. Teste a API diretamente: `curl http://localhost:3001/api/subscription-plans`
3. Verifique configuração do Nginx: `nginx -t`

### Problema: 404 nas rotas da API
**Solução**: 
1. Verifique se o proxy do Nginx está correto
2. Certifique-se que o backend está respondendo na porta 3001

### Problema: CORS Error
**Solução**: 
1. Verifique as configurações de CORS no backend
2. Certifique-se que `FRONTEND_URL` está configurado corretamente

## 📋 Checklist de Deploy
- [ ] Executar `setup-production.ps1`
- [ ] Executar `npm run build`
- [ ] Configurar Nginx
- [ ] Iniciar backend com PM2
- [ ] Testar API endpoints
- [ ] Verificar frontend funciona
- [ ] Configurar SSL (Let's Encrypt)
- [ ] Testar todas as funcionalidades

## 🔄 Para Voltar ao Desenvolvimento
```powershell
.\setup-development.ps1
npm run dev
npm run backend
```