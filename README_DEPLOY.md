# Deploy Domius em Produção via Docker/Portainer (Linux Ubuntu)

## Passo a passo completo

1. **Crie a rede Docker (se ainda não existir):**
   ```bash
   sudo docker network create DomiusNet
   ```

2. **Configure as variáveis de ambiente:**
   - As chaves do Stripe e URLs já estão preenchidas em `.env.example`.
   - Renomeie `.env.example` para `.env` e carregue no Portainer ao criar a stack.

3. **Build e envio das imagens Docker:**
   - Gere as imagens localmente:
     ```bash
     # Backend
     sudo docker build -t domius-backend:latest -f Dockerfile.backend .
     # Frontend
     sudo docker build -t domius-frontend:latest -f Dockerfile.frontend .
     ```
   - (Opcional) Envie para o Docker Hub:
     ```bash
     sudo docker tag domius-backend:latest seuusuario/domius-backend:latest
     sudo docker tag domius-frontend:latest seuusuario/domius-frontend:latest
     sudo docker push seuusuario/domius-backend:latest
     sudo docker push seuusuario/domius-frontend:latest
     ```
   - No `docker-compose.yml`, use o nome das imagens criadas/localmente ou do Docker Hub.

4. **Deploy pelo Portainer:**
   - Crie um novo stack e cole o conteúdo do `docker-compose.yml`.
   - Carregue o arquivo `.env` para preencher as variáveis.
   - Inicie a stack.

5. **Acesso aos serviços:**
   - Frontend: http://domius.com.br
   - Backend: http://domius.com.br:3001
   - Postgres: porta 5432

6. **Atualizar o sistema:**
   - Para atualizar o código, gere novas imagens e envie para o Docker Hub/local, depois reinicie a stack no Portainer.

## Arquivos principais
- Dockerfile.frontend (gera imagem do frontend)
- Dockerfile.backend (gera imagem do backend)
- nginx.conf
- docker-compose.yml (referencia as imagens)
- .env.example (preenchido, renomear para .env)
