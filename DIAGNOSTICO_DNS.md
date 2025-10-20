# Diagnóstico de DNS - domius.com.br

## 🔍 **Como verificar se o domínio está funcionando:**

### 1. **Verificar DNS**
Abra o prompt de comando e digite:
```bash
nslookup domius.com.br
```
**Deve retornar:** `103.199.187.43`

### 2. **Testar Ping**
```bash
ping domius.com.br
```
**Deve retornar:** Pacotes sendo enviados para `103.199.187.43`

### 3. **Verificar no Navegador**
- Acesse: `http://domius.com.br`
- Acesse: `http://103.199.187.43` (deve funcionar)

## ⚙️ **Status Atual:**

✅ **Servidor funcionando**: http://103.199.187.43  
✅ **API funcionando**: http://103.199.187.43/api/subscription-plans  
✅ **Frontend funcionando**: Carregando corretamente  
✅ **Nginx configurado**: Para aceitar domius.com.br e www.domius.com.br  

❓ **DNS**: Precisa verificar se domius.com.br aponta para 103.199.187.43

## 🛠️ **Se o DNS não estiver funcionando:**

### **Opção 1: Configurar DNS no provedor do domínio**
1. Acesse o painel de controle do seu provedor de domínio
2. Vá em "Gerenciar DNS" ou "DNS Management"
3. Crie/edite os registros:
   - **A Record**: `domius.com.br` → `103.199.187.43`
   - **A Record**: `www.domius.com.br` → `103.199.187.43`
4. Aguarde propagação (pode levar até 24h)

### **Opção 2: Testar localmente (temporário)**
Adicione no arquivo hosts do Windows:
1. Abra como administrador: `C:\Windows\System32\drivers\etc\hosts`
2. Adicione a linha: `103.199.187.43 domius.com.br www.domius.com.br`
3. Salve o arquivo
4. Teste: `http://domius.com.br`

## 🧪 **Comandos de teste:**

```bash
# Testar API diretamente
curl http://103.199.187.43/api/subscription-plans

# Testar com o domínio (quando DNS funcionar)
curl http://domius.com.br/api/subscription-plans

# Ver logs do backend
ssh root@103.199.187.43 "pm2 logs dom2-backend --lines 50"

# Ver logs do Nginx
ssh root@103.199.187.43 "tail -f /var/log/nginx/dom2_error.log"
```

## 📋 **Checklist de Funcionamento:**

- [x] Servidor online na VPS
- [x] Frontend buildado e servindo
- [x] Backend rodando na porta 3001
- [x] Nginx fazendo proxy da API
- [x] Site acessível via IP (103.199.187.43)
- [ ] DNS do domínio configurado
- [ ] Site acessível via domínio (domius.com.br)

## 🔧 **Próximos passos:**

1. **Configure o DNS** no seu provedor de domínio
2. **Aguarde propagação** (até 24h)
3. **Teste o domínio** `http://domius.com.br`
4. **Configure SSL** com Let's Encrypt (opcional)

---

**Seu site está FUNCIONANDO perfeitamente via IP!**  
O único passo restante é configurar o DNS do domínio.