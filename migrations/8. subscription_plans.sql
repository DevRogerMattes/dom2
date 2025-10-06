-- 8. subscription_plans.sql
-- Tabela de planos de assinatura
CREATE TABLE subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price_monthly NUMERIC(10,2),
    price_yearly NUMERIC(10,2),
    currency VARCHAR(3) DEFAULT 'BRL',
    billing_cycle VARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
    features JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    is_highlighted BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    badge_text VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de assinaturas dos usuários
CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'cancelled', 'expired'
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX idx_subscription_plans_order ON subscription_plans(display_order);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);

-- Inserir planos iniciais
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, billing_cycle, features, is_active, is_highlighted, display_order, badge_text) VALUES
(
    'Plano Lançamento Mensal',
    'Perfeito para começar',
    47.00,
    NULL,
    'monthly',
    '["Workflows ilimitados", "Agentes Padrões", "Área EAD Domius"]',
    true,
    false,
    1,
    NULL
),
(
    'Plano Anual Lançamento',
    'Melhor custo-benefício',
    NULL,
    467.00,
    'yearly',
    '["Tudo do Plano Mensal +", "Suporte via WhatsApp", "Área EAD Pro"]',
    true,
    true,
    2,
    'MELHOR OFERTA'
);