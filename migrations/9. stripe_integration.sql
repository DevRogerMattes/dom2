-- Adicionar coluna stripe_price_id na tabela subscription_plans
ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS stripe_price_id VARCHAR(255);

-- Adicionar colunas para integração com Stripe na tabela user_subscriptions
ALTER TABLE user_subscriptions 
ADD COLUMN IF NOT EXISTS stripe_subscription_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS current_period_start TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS current_period_end TIMESTAMP WITH TIME ZONE;

-- Índices para otimização das consultas Stripe
CREATE INDEX IF NOT EXISTS idx_subscription_plans_stripe_price_id ON subscription_plans(stripe_price_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_subscription_id ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer_id ON user_subscriptions(stripe_customer_id);

-- Atualizar planos existentes com stripe_price_id (substitua pelos IDs reais do Stripe)
-- Você precisa substituir estes IDs pelos seus próprios do Stripe Dashboard
-- UPDATE subscription_plans SET stripe_price_id = 'price_1ABC123' WHERE name = 'Plano Lançamento Mensal';
-- UPDATE subscription_plans SET stripe_price_id = 'price_1DEF456' WHERE name = 'Plano Anual Lançamento';