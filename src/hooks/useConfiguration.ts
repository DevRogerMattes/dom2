
import { useState, useEffect } from 'react';

export interface Configuration {
  apiKey: string;
  model: string;
}

const DEFAULT_CONFIG: Configuration = {
  apiKey: '',
  model: 'gpt-4o'
};

/**
 * Função para limpar e validar a chave da API
 */
function sanitizeApiKey(apiKey: string): string {
  if (!apiKey) return '';
  
  // Verificação simples: se a chave já começa com sk-, apenas retorna
  if (apiKey.startsWith('sk-')) {
    return apiKey.trim();
  }
  
  // Se a chave não começa com sk-, mas contém sk-, extrair a parte válida
  if (apiKey.includes('sk-')) {
    const match = apiKey.match(/sk-[a-zA-Z0-9]+/);
    if (match && match[0]) {
      return match[0];
    }
  }
  
  // Se não encontrou uma chave válida, retorna a original
  return apiKey.trim();
}

export const useConfiguration = () => {
  const [config, setConfig] = useState<Configuration>(DEFAULT_CONFIG);

  useEffect(() => {
    const savedConfig = localStorage.getItem('ai-agents-config');
    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        
        // Garantir que a chave da API seja tratada corretamente
        if (parsed.apiKey) {
          parsed.apiKey = sanitizeApiKey(parsed.apiKey);
        }
        
        setConfig({ ...DEFAULT_CONFIG, ...parsed });
      } catch (error) {
        console.error('Erro ao processar configuração salva:', error);
      }
    }
  }, []);

  const updateConfig = (newConfig: Partial<Configuration>) => {
    // Limpar e validar a chave da API antes de salvar
    if (newConfig.apiKey) {
      newConfig.apiKey = sanitizeApiKey(newConfig.apiKey);
    }
    
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    localStorage.setItem('ai-agents-config', JSON.stringify(updatedConfig));
    
    console.log('Configuração atualizada com sucesso');
  };

  return {
    config,
    updateConfig
  };
};
