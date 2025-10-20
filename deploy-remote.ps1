# Script de Deploy Remoto para Windows PowerShell
param(
    [Parameter(Mandatory=$true)]
    [string]$ServerIP,
    
    [Parameter(Mandatory=$true)]
    [string]$Username,
    
    [string]$SSHKeyPath = "",
    
    [int]$Port = 22
)

Write-Host "🚀 Iniciando deploy remoto do DOM2..." -ForegroundColor Green
Write-Host "📡 Servidor: $ServerIP" -ForegroundColor Cyan
Write-Host "👤 Usuário: $Username" -ForegroundColor Cyan

# Verificar se o SSH está disponível (requer OpenSSH ou PuTTY)
if (-not (Get-Command ssh -ErrorAction SilentlyContinue)) {
    Write-Error "SSH não encontrado. Instale o OpenSSH ou use PuTTY."
    exit 1
}

# Construir comando SSH
$sshParams = @()
if ($SSHKeyPath) {
    $sshParams += @("-i", $SSHKeyPath)
}
if ($Port -ne 22) {
    $sshParams += @("-p", $Port)
}

$sshTarget = "$Username@$ServerIP"

Write-Host "🔄 Conectando ao servidor..." -ForegroundColor Yellow

# Transferir script de deploy
Write-Host "📤 Enviando script de deploy..." -ForegroundColor Yellow
$deployScript = Get-Content "deploy.sh" -Raw
$encodedScript = [System.Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($deployScript))

# Executar deploy no servidor
$remoteCommands = @"
echo '$encodedScript' | base64 -d > /tmp/deploy.sh
chmod +x /tmp/deploy.sh
sudo /tmp/deploy.sh
"@

try {
    if ($SSHKeyPath) {
        ssh -i $SSHKeyPath -p $Port $sshTarget $remoteCommands
    } else {
        ssh -p $Port $sshTarget $remoteCommands
    }
    
    Write-Host "✅ Deploy concluído com sucesso!" -ForegroundColor Green
    Write-Host "🌐 Seu site deve estar disponível em: http://$ServerIP" -ForegroundColor Green
    
} catch {
    Write-Error "❌ Erro durante o deploy: $($_.Exception.Message)"
}

Write-Host ""
Write-Host "🔧 Para verificar o status:" -ForegroundColor Yellow
Write-Host "  ssh $sshTarget 'pm2 status'" -ForegroundColor White
Write-Host "  ssh $sshTarget 'sudo systemctl status nginx'" -ForegroundColor White