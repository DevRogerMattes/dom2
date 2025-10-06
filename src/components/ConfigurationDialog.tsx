import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useConfiguration } from '../hooks/useApiConfiguration';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface ConfigurationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ConfigurationDialog: React.FC<ConfigurationDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const { config, updateConfig, loading } = useConfiguration();
  const [tempApiKey, setTempApiKey] = useState('');
  const [tempModel, setTempModel] = useState('gpt-4.1-2025-04-14');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (open && config) {
      setTempApiKey(config.apiKey || '');
      setTempModel(config.model || 'gpt-4.1-2025-04-14');
      setError('');
      setSuccess(false);
    }
  }, [open, config]);

  const maskApiKey = (key: string) => {
    if (!key) return '';
    if (key.length <= 10) return key;
    return key.substring(0, 10) + '•'.repeat(Math.min(20, key.length - 10));
  };

  const handleSave = async () => {
    if (!tempApiKey.trim()) {
      setError('Por favor, insira uma chave de API válida');
      return;
    }
    
    if (!tempApiKey.startsWith('sk-')) {
      setError('A chave da API deve começar com "sk-"');
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      await updateConfig({ 
        apiKey: tempApiKey.trim(),
        model: tempModel 
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onOpenChange(false);
      }, 1500);
    } catch (error) {
      setError('Erro ao salvar configuração. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            ⚙️ Configurações de API
            {config.apiKey && (
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Configurado
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Configure sua chave de API da OpenAI e modelo para usar com os agentes. Suas configurações são salvas de forma segura no banco de dados.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            {/* Chave da API */}
            <div className="grid gap-2">
              <Label htmlFor="apiKey">Chave da API OpenAI *</Label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="sk-..."
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {config.apiKey && !tempApiKey && (
                <p className="text-xs text-muted-foreground">
                  Chave atual: {maskApiKey(config.apiKey)}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Você pode obter sua chave em{' '}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline"
                >
                  platform.openai.com/api-keys
                </a>
              </p>
            </div>

            {/* Modelo */}
            <div className="grid gap-2">
              <Label htmlFor="model">Modelo de IA</Label>
              <Select value={tempModel} onValueChange={setTempModel}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modelo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4.1-2025-04-14">GPT-4.1 (Recomendado)</SelectItem>
                  <SelectItem value="o3-2025-04-16">O3 (Raciocínio Avançado)</SelectItem>
                  <SelectItem value="o4-mini-2025-04-16">O4 Mini (Rápido)</SelectItem>
                  <SelectItem value="gpt-4.1-mini-2025-04-14">GPT-4.1 Mini</SelectItem>
                  <SelectItem value="gpt-4o">GPT-4o (Legado)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  Configuração salva com sucesso!
                </AlertDescription>
              </Alert>
            )}
            
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !tempApiKey.trim()}
            className="min-w-[100px]"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Salvando...
              </div>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};