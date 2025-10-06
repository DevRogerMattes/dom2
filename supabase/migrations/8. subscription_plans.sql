-- Migração para criar tabelas de planos de assinatura e assinaturas de usuários

-- Criar tabela de planos de assinatura
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_monthly DECIMAL(10,2),
    price_yearly DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'BRL',
    billing_cycle VARCHAR(20) CHECK (billing_cycle IN ('monthly', 'yearly', 'one-time')),
    features JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    is_highlighted BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    badge_text VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Criar tabela de assinaturas de usuários
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL,
    plan_id UUID REFERENCES subscription_plans(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    expires_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(50),
    payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_order ON subscription_plans(display_order);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_status ON user_subscriptions(user_id, status);

-- Inserir planos de exemplo
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, billing_cycle, features, is_highlighted, display_order, badge_text) VALUES
('Plano Lançamento Mensal', 'Perfeito para começar sua jornada', 47.00, NULL, 'monthly', 
 '["Workflows ilimitados", "Agentes Padrões", "Área EAD Domius"]'::jsonb, 
 false, 1, NULL),
('Plano Anual Lançamento', 'Melhor custo-benefício do mercado', NULL, 467.00, 'yearly', 
 '["Tudo do Plano Mensal +", "Suporte via WhatsApp", "Área EAD Pro"]'::jsonb, 
 true, 2, 'MELHOR OFERTA')
ON CONFLICT DO NOTHING;