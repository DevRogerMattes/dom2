
-- Criar tabela para configurações de API
CREATE TABLE public.api_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  api_provider TEXT NOT NULL CHECK (api_provider IN ('openai', 'perplexity', 'anthropic', 'google')),
  api_key TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, api_provider)
);

-- Função para atualizar timestamps automaticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualização automática de timestamps
CREATE TRIGGER update_api_configurations_updated_at
  BEFORE UPDATE ON public.api_configurations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_api_configurations_user_id ON public.api_configurations(user_id);
CREATE INDEX idx_api_configurations_provider ON public.api_configurations(api_provider);
CREATE INDEX idx_api_configurations_active ON public.api_configurations(is_active);