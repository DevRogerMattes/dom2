-- Atualizar planos conforme a nova estrutura da imagem
-- Mantendo os valores do banco atual mas atualizando descrições e recursos

-- Atualizar Plano Mensal
UPDATE subscription_plans 
SET 
  name = 'Plano Mensal',
  description = 'Perfeito para começar',
  price_monthly = 97.00,
  price_yearly = NULL,
  billing_cycle = 'monthly',
  features = '[
    "Workflows de IA ilimitados",
    "Criação de conteúdo com IA", 
    "Landing pages otimizadas",
    "Automação de email",
    "Suporte por chat",
    "Templates prontos"
  ]'::jsonb,
  is_highlighted = false,
  display_order = 1,
  badge_text = NULL
WHERE billing_cycle = 'monthly';

-- Atualizar Plano Anual
UPDATE subscription_plans 
SET 
  name = 'Plano Anual',
  description = 'Melhor custo-benefício',
  price_monthly = NULL,
  price_yearly = 67.00 * 12, -- R$ 804 por ano (R$ 67/mês)
  billing_cycle = 'yearly',
  features = '[
    "✨ Tudo do plano mensal",
    "🚀 4 meses completamente grátis",
    "🎯 Suporte prioritário", 
    "⚡ Novos recursos em primeira mão",
    "📈 Relatórios avançados",
    "🔥 Sessão de consultoria grátis"
  ]'::jsonb,
  is_highlighted = true,
  display_order = 2,
  badge_text = '💎 MAIS POPULAR'
WHERE billing_cycle = 'yearly';

-- Adicionar stripe_price_id se não existir
ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS stripe_price_id VARCHAR(255);

-- Atualizar com os Price IDs reais do Stripe (substitua pelos seus)
UPDATE subscription_plans 
SET stripe_price_id = 'price_1S9buYF7jruBxPaDPhPtcOeh' 
WHERE billing_cycle = 'monthly';

UPDATE subscription_plans 
SET stripe_price_id = 'price_1S9bvoF7jruBxPaDtXa5cXt1' 
WHERE billing_cycle = 'yearly';

-- Verificar os dados atualizados
SELECT 
  name,
  description,
  price_monthly,
  price_yearly,
  billing_cycle,
  features,
  is_highlighted,
  badge_text,
  stripe_price_id
FROM subscription_plans 
WHERE is_active = true
ORDER BY display_order;