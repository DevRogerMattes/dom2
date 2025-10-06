-- Insert default agents for all users
-- This function creates default agents for new users
CREATE OR REPLACE FUNCTION public.create_default_agents_for_user(user_id_param UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert default Project Setup agent
  INSERT INTO public.agents (
    user_id, type, name, description, category, icon, inputs, outputs, config, template, is_active
  ) VALUES (
    user_id_param,
    'project-setup',
    'Configuração do Projeto',
    'Define produto, nicho, público-alvo e objetivo principal',
    'setup',
    '🎯',
    '[
      {
        "id": "produto",
        "name": "Produto/Serviço",
        "type": "text",
        "required": true,
        "description": "Nome e descrição completa do produto ou serviço",
        "placeholder": "Ex: Curso de Marketing Digital para Iniciantes"
      },
      {
        "id": "nicho",
        "name": "Nicho de Mercado",
        "type": "text",
        "required": true,
        "description": "Segmento específico do mercado",
        "placeholder": "Ex: Marketing Digital, Emagrecimento"
      },
      {
        "id": "publico_alvo",
        "name": "Público-Alvo",
        "type": "text",
        "required": true,
        "description": "Características detalhadas do público-alvo",
        "placeholder": "Ex: Empreendedores 25-45 anos que querem vender online"
      },
      {
        "id": "dores_principais",
        "name": "Principais Dores/Problemas",
        "type": "text",
        "required": true,
        "description": "Problemas que o produto resolve",
        "placeholder": "Ex: Baixa atração de clientes, poucas vendas"
      },
      {
        "id": "beneficios_principais",
        "name": "Benefícios Principais",
        "type": "text",
        "required": true,
        "description": "Benefícios que o público obtém",
        "placeholder": "Ex: Aumentar vendas, gerar autoridade"
      },
      {
        "id": "objetivo_principal",
        "name": "Objetivo Principal",
        "type": "text",
        "required": true,
        "description": "Grande meta a atingir nos próximos 12 meses",
        "placeholder": "Ex: Faturar R$ 100k com o produto"
      }
    ]',
    '[
      {
        "id": "project_brief",
        "name": "Brief do Projeto",
        "type": "text",
        "description": "Resumo estratégico com insights e próximos passos"
      }
    ]',
    '{"tone": "concise"}',
    'Crie um resumo estratégico do produto {{produto}} no nicho {{nicho}} para o público {{publico_alvo}}.\n\n1. Contexto: descreva problema e solução ({{dores_principais}} / {{beneficios_principais}}).\n2. Objetivo principal: {{objetivo_principal}}.\n3. Próximos passos sugeridos (3-5 ações práticas).',
    true
  );
END;
$$;