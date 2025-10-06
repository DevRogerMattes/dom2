import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/apiService';

export interface ApiConfiguration {
  id?: string;
  api_provider: 'openai' | 'perplexity' | 'anthropic' | 'google';
  api_key: string;
  is_active: boolean;
}

export interface Configuration {
  apiKey: string;
  model: string;
}

const DEFAULT_CONFIG: Configuration = {
  apiKey: '',
  model: 'gpt-4.1-2025-04-14'
};

export const useConfiguration = () => {
  const [config, setConfig] = useState<Configuration>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Carregar configurações do backend via REST API
  useEffect(() => {
    if (!user) {
      setConfig(DEFAULT_CONFIG);
      setLoading(false);
      return;
    }
    loadConfigFromApi();
  }, [user]);

  const loadConfigFromApi = async () => {
    try {
      setLoading(true);
      // Buscar configuração ativa do OpenAI para o usuário via REST API
      const response = await apiService.get(`/api/configuration?provider=openai&user_id=${user?.id}`);
      if (response && response.data) {
        console.log('[useApiConfiguration] Configuração recebida do backend:', response.data);
        setConfig({
          apiKey: response.data.api_key,
          model: DEFAULT_CONFIG.model
        });
      } else {
        // Fallback para localStorage (migração)
        const savedConfig = localStorage.getItem('ai-agents-config');
        if (savedConfig) {
          try {
            const parsed = JSON.parse(savedConfig);
            if (parsed.apiKey) {
              await saveConfigToApi('openai', parsed.apiKey);
              setConfig(parsed);
              localStorage.removeItem('ai-agents-config');
              console.log('Configuração migrada do localStorage para o backend');
            }
          } catch (error) {
            console.error('Erro ao migrar configuração do localStorage:', error);
          }
        }
        setConfig(DEFAULT_CONFIG);
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error);
      setConfig(DEFAULT_CONFIG);
    } finally {
      setLoading(false);
    }
  };

  const saveConfigToApi = async (provider: string, apiKey: string) => {
    if (!user) {
      console.error('Usuário não autenticado');
      return false;
    }
    try {
      // Enviar para o backend via REST API
      const response = await apiService.post('/api/configuration', {
        user_id: user.id,
        api_provider: provider,
        api_key: apiKey,
        is_active: true
      });
      if (response && response.status === 200) {
        console.log('Configuração salva no backend com sucesso');
        return true;
      } else {
        console.error('Erro ao salvar configuração no backend:', response?.data);
        return false;
      }
    } catch (error) {
      console.error('Erro ao salvar configuração:', error);
      return false;
    }
  };

  const updateConfig = async (newConfig: Partial<Configuration>) => {
    if (!user) {
      console.error('Usuário não autenticado');
      return;
    }

    const updatedConfig = { ...config, ...newConfig };
    
    // Se tem uma nova chave de API, salvar no backend
    if (newConfig.apiKey && newConfig.apiKey !== config.apiKey) {
      const success = await saveConfigToApi('openai', newConfig.apiKey);
      if (!success) {
        console.error('Falha ao salvar configuração no backend');
        return;
      }
    }
    setConfig(updatedConfig);
    console.log('Configuração atualizada com sucesso');
  };

  const getApiKey = async (provider: 'openai' | 'perplexity' | 'anthropic' | 'google' = 'openai'): Promise<string | null> => {
    if (!user) return null;
    try {
      const response = await apiService.get(`/api/configuration?provider=${provider}&user_id=${user.id}`);
      if (response && response.data) {
        return response.data.api_key || null;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar chave da API:', error);
      return null;
    }
  };

  return {
    config,
    updateConfig,
    getApiKey,
    loading
  };
};