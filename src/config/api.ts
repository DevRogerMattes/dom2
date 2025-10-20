// Configuração da URL da API baseada no ambiente
const getApiUrl = () => {
  // Em desenvolvimento, usa o proxy do Vite
  if (import.meta.env.DEV) {
    return '';  // Usa o proxy configurado no vite.config.ts
  }
  
  // Em produção, usa a variável de ambiente ou fallback para o domínio atual
  return import.meta.env.VITE_API_URL || 
         (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}/api` : '');
};

export const API_URL = getApiUrl();

// Função auxiliar para construir URLs completas da API
export const buildApiUrl = (endpoint: string) => {
  // Remove a barra inicial se existir
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  
  if (API_URL) {
    return `${API_URL}/${cleanEndpoint}`;
  }
  
  // Fallback para desenvolvimento com proxy
  return `/api/${cleanEndpoint}`;
};