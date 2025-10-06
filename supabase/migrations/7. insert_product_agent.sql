-- Insert Product Agent
INSERT INTO public.agents (
  user_id, type, name, description, category, icon, inputs, outputs, config, template, is_active, is_favorite
)
VALUES (
  'c649c8e9-80be-4701-97f3-2e942f18583c', -- Substitua pelo user_id correto
  'productAgent',
  'Agente de Cadastro de Produtos',
  'Este agente cadastra produtos automaticamente com base nos dados fornecidos.',
  'executor', -- Nova categoria para agentes de execução
  '📦',
  '[
  {
    "name": "Nome",
    "type": "text",
    "fields": {
      "nome": "string",
      "preco": "number"
    },
    "required": true,
    "description": "Nome do Produto",
    "placeholder": "Nome do Produto"
  },
  {
    "id": "input_1758331029437",
    "name": "Preco",
    "type": "text",
    "required": true,
    "description": "Preco do Produto",
    "placeholder": "Preco do Produto"
  }
]',
  '[
  {
    "id": "Nome",
    "name": "Nome do Produto",
    "type": "text",
    "description": "Nome do produto cadastrado"
  },
  {
    "id": "Preco", 
    "name": "Preço do Produto",
    "type": "text",
    "description": "Preço do produto cadastrado"
  },
  {
    "id": "ID",
    "name": "ID do Produto", 
    "type": "text",
    "description": "ID único do produto cadastrado"
  }
]',
  '{ "defaultConfig": true}',
  NULL,
  true,
  false
);