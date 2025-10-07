# Instalação do Domius SEM Docker (Ubuntu 24.04 LTS)

Este guia é para quem quer rodar o sistema Domius direto na VPS, sem usar Docker.

## Passo a passo para leigos

### 1. Instalar dependências
Abra o terminal da VPS e execute:
```bash
sudo apt update
sudo apt install nodejs npm postgresql nginx git -y
```

### 2. Clonar o projeto
```bash
git clone https://github.com/DevRogerMattes/Domius.git
cd Domius
```

### 3. Configurar o banco de dados
```bash
sudo -u postgres psql
CREATE DATABASE domius_db;
CREATE USER domius WITH PASSWORD 'sua_senha_forte';
GRANT ALL PRIVILEGES ON DATABASE domius_db TO domius;
\q
```

### 4. Configurar variáveis de ambiente
- Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```
- Edite o arquivo `.env` e coloque as chaves reais do Stripe, dados do banco e URLs corretas.

### 5. Instalar dependências do backend
```bash
cd src
npm install
npm run build
```

### 6. Iniciar o backend
```bash
npm start
# ou
node dist/server.js
```

### 7. Instalar e rodar o frontend
```bash
cd ../
npm install
npm run build
npx serve -s dist
```

### 8. Configurar Nginx para produção
- Edite o arquivo de configuração do nginx para servir o frontend e fazer proxy para o backend.
- Exemplo básico:
```nginx
server {
    listen 80;
    server_name domius.com.br;
    root /caminho/para/Domius/dist;
    index index.html;
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
- Reinicie o nginx:
```bash
sudo systemctl restart nginx
```

Pronto! Agora acesse http://domius.com.br e o sistema estará rodando sem Docker.

Se tiver dúvidas, envie o erro ou mensagem que aparece para receber ajuda personalizada.