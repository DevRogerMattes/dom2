# Deploy Domius em Produção via Docker/Portainer

1. Configure a rede Docker chamada `DomiusNet` (já existente na VPS)
2. Ajuste variáveis de ambiente do banco em `docker-compose.yml` e `.env.example`
3. Execute o build e deploy pelo Portainer
4. Frontend será servido na porta 80, backend na 3001, Postgres na 5432
5. Para atualizar, basta rebuildar os containers

Arquivos principais:
- Dockerfile.frontend
- Dockerfile.backend
- nginx.conf
- docker-compose.yml
- .dockerignore
