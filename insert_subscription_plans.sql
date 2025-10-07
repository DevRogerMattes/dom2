-- Script para inserir planos de assinatura
-- Execute este script para adicionar os planos ao banco de dados

-- Primeiro, limpar planos existentes (opcional)
DELETE FROM user_subscriptions WHERE plan_id IN (SELECT id FROM subscription_plans);
DELETE FROM subscription_plans;

-- Inserir Plano Lançamento Mensal
INSERT INTO subscription_plans (
    name, 
    description, 
    price_monthly, 
    price_yearly, 
    currency, 
    billing_cycle, 
    features, 
    is_active, 
    is_highlighted, 
    display_order, 
    badge_text
) VALUES (
    'Plano Lançamento Mensal',
    'Perfeito para começar sua jornada',
    47.00,
    NULL,
    'BRL',
    'monthly',
    '["Workflows ilimitados", "Agentes Padrões", "Área EAD Domius"]',
    true,
    false,
    1,
    NULL
);

-- Inserir Plano Anual Lançamento
INSERT INTO subscription_plans (
    name, 
    description, 
    price_monthly, 
    price_yearly, 
    currency, 
    billing_cycle, 
    features, 
    is_active, 
    is_highlighted, 
    display_order, 
    badge_text
) VALUES (
    'Plano Anual Lançamento',
    'Melhor custo-benefício do mercado',
    NULL,
    467.00,
    'BRL',
    'yearly',
    '["Tudo do Plano Mensal +", "Suporte via WhatsApp", "Área EAD Pro"]',
    true,
    true,
    2,
    'MELHOR OFERTA'
);

-- Verificar se os planos foram inseridos corretamente
SELECT 
    name,
    CASE 
        WHEN billing_cycle = 'monthly' THEN CONCAT('R$ ', price_monthly, '/mês')
        WHEN billing_cycle = 'yearly' THEN CONCAT('R$ ', price_yearly, '/ano')
    END as price,
    features,
    badge_text
FROM subscription_plans 
ORDER BY display_order;