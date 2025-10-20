# 🎯 DEPLOY AUTOMATIZADO - DOM2

## 📋 INFORMAÇÕES NECESSÁRIAS

**Me forneça estas informações para eu fazer o deploy:**

```
1. 🌐 IP ou Domínio da VPS: _________________
2. 👤 Usuário SSH: _________________  
3. 🔑 Senha ou tem chave SSH? _________________
4. 🚪 Porta SSH (padrão: 22): _________________
5. 💿 Sistema Operacional: _________________
```

## 🚀 OPÇÕES DE DEPLOY

### **OPÇÃO 1: EU FAÇO TUDO PRA VOCÊ** ⭐ (RECOMENDADO)
✅ **Vantagens:**
- Deploy 100% automatizado
- Configuração completa (Nginx + PM2 + SSL)
- Sem chance de erro
- Pronto em poucos minutos

📋 **Você precisa me dar:**
- Acesso SSH temporário à VPS
- Ou me passar os dados de acesso

### **OPÇÃO 2: VOCÊ EXECUTA COM MEU GUIA** 
✅ **Vantagens:**
- Você mantém controle total
- Aprende o processo
- Mais seguro (sem compartilhar acesso)

⚠️ **Desvantagens:**
- Pode demorar mais
- Risco de erro humano

---

## 🛠️ SE ESCOLHER OPÇÃO 1 (EU FAÇO):

### **Método A: Acesso Direto**
```bash
# Me dê acesso temporário SSH:
ssh seu-usuario@seu-servidor
# Eu executo o script automatizado
```

### **Método B: Você Executa Localmente** 
```powershell
# No seu Windows, execute:
.\deploy-remote.ps1 -ServerIP "SEU_IP" -Username "SEU_USUARIO"
```

---

## 🔧 SE ESCOLHER OPÇÃO 2 (VOCÊ EXECUTA):

### **Passo 1: Conectar na VPS**
```bash
ssh seu-usuario@seu-servidor
```

### **Passo 2: Executar Deploy**
```bash
# Baixar e executar script
curl -fsSL https://raw.githubusercontent.com/DevRogerMattes/dom2/main/deploy.sh -o deploy.sh
chmod +x deploy.sh
sudo ./deploy.sh
```

---

## 📞 SUPORTE EM TEMPO REAL

**Se escolher a Opção 1, me passe no chat:**

```
🔐 DADOS DE ACESSO:
IP/Domínio: _______________
Usuário: _______________  
Senha: _______________
Porta SSH: _______________

Ou se usar chave SSH:
Chave SSH: [arquivo .pem ou .key]
```

**⚡ DEPLOY EXPRESS (5 minutos):**
1. Você me dá os dados
2. Eu conecto na VPS
3. Executo o script automatizado
4. Seu site fica online
5. Removo meu acesso

---

## 🎯 RESULTADO FINAL

Após o deploy você terá:

✅ **Site funcionando**: `http://domius.com.br`  
✅ **API funcionando**: `http://domius.com.br/api`  
✅ **SSL configurado**: `https://domius.com.br`  
✅ **Backend rodando**: PM2 com auto-restart  
✅ **Nginx configurado**: Com proxy e cache  
✅ **Firewall configurado**: Portas seguras  

## 🆘 QUAL OPÇÃO VOCÊ ESCOLHE?

**Digite sua escolha:**
- `1` = EU FAÇO TUDO (mais rápido)
- `2` = EU TE GUIO PASSO A PASSO

**E me passe os dados da VPS!** 👆