# Deploy Domius em Produção via Docker/Portainer

1. Rede Docker `DomiusNet` já deve existir na VPS
2. As variáveis de ambiente já estão preenchidas para produção em `docker-compose.yml` e `.env.example`
   - Altere apenas a STRIPE_SECRET_KEY para sua chave real
3. Execute o build e deploy pelo Portainer ou Docker Compose
4. Os Dockerfiles já clonam o código do GitHub automaticamente (branch Dev)
5. Frontend será servido na porta 80, backend na 3001, Postgres na 5432
6. Para atualizar, basta rebuildar os containers (o clone será feito novamente)

Arquivos principais:
- Dockerfile.frontend (clona do GitHub)
- Dockerfile.backend (clona do GitHub)
- nginx.conf
- docker-compose.yml (já preenchido)
- .env.example (já preenchido)
