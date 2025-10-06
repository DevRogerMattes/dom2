-- ===============================================
-- AGENTE PARA HEADLINES, TAGS E PALAVRAS-CHAVE
-- ===============================================
-- Execute este arquivo após fazer login para adicionar o agente especializado
-- IMPORTANTE: Substitua 'SEU_USER_ID_AQUI' pelo seu ID de usuário real

INSERT INTO public.agents (
  user_id, type, name, description, category, icon, inputs, outputs, config, template, is_active
) VALUES
(
  'c649c8e9-80be-4701-97f3-2e942f18583c',
  'headline-tags-keywords-creator',
  'Criador de Headlines, Tags e Palavras-Chave',
  'Gera headlines irresistíveis, tags de busca e listas de palavras-chave otimizadas para SEO e mídias sociais',
  'copywriting',
  '🏷️',
  '[
    {
      "id": "subject",
      "name": "Assunto",
      "type": "text",
      "required": true,
      "description": "Tema principal do conteúdo",
      "placeholder": "Ex: Curso de Inglês Online"
    },
    {
      "id": "audience",
      "name": "Público-Alvo",
      "type": "text",
      "required": true,
      "description": "Destinatários do conteúdo",
      "placeholder": "Ex: Profissionais que desejam promoção"
    },
    {
      "id": "main_benefit",
      "name": "Benefício Principal",
      "type": "text",
      "required": true,
      "description": "Valor central entregue",
      "placeholder": "Ex: Fluência em 6 meses"
    },
    {
      "id": "tone_style",
      "name": "Tom e Estilo",
      "type": "text",
      "required": false,
      "description": "Estilo de comunicação desejado",
      "placeholder": "Ex: Profissional, Inspirador, Divertido"
    }
  ]',
  '[
    {
      "id": "headlines",
      "name": "Headlines Geradas",
      "type": "text",
      "description": "Lista de 10 headlines persuasivas"
    },
    {
      "id": "search_tags",
      "name": "Tags de Busca",
      "type": "json",
      "description": "Array com 20 tags relevantes"
    },
    {
      "id": "keywords",
      "name": "Palavras-Chave",
      "type": "json",
      "description": "Array com 30 palavras-chave otimizadas"
    }
  ]',
  '{"tone": "professional"}',
  'Crie 10 HEADLINES irresistíveis para {{subject}} direcionadas a {{audience}} destacando {{main_benefit}} e utilizando tom {{tone_style}}.\n\n📌 FORMATO DE SAÍDA:\nHEADLINES:\n1. ...\n2. ... (até 10)\n\nTAGS_DE_BUSCA (JSON array com 20 itens):\n["tag1", "tag2", ...]\n\nPALAVRAS_CHAVE (JSON array com 30 itens):\n["keyword1", "keyword2", ...]\n\nREQUISITOS:\n- Headlines com até 60 caracteres.\n- Use números, perguntas ou gatilhos de curiosidade quando possível.\n- Tags e palavras-chave sem espaços extras, minúsculas, sem caracteres especiais.\n- Não repetir termos entre si.\n- Conteúdo em português-brasileiro.',
  true
);
