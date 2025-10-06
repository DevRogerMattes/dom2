import { Pool } from 'pg';

// Configuração do pool PostgreSQL
const pool = new Pool({
  user: 'domius',
  host: 'localhost',
  database: 'domius',
  password: 'aA@2291755',
  port: 5432,
});

async function updateSubscriptionPlans() {
  try {
    console.log('Atualizando planos de assinatura...');

    // Atualizar Plano Mensal
    await pool.query(`
      UPDATE subscription_plans 
      SET 
        name = 'Plano Mensal',
        description = 'Perfeito para começar',
        price_monthly = 97.00,
        price_yearly = NULL,
        billing_cycle = 'monthly',
        features = $1::jsonb,
        is_highlighted = false,
        display_order = 1,
        badge_text = NULL
      WHERE billing_cycle = 'monthly'
    `, [JSON.stringify([
      "Workflows de IA ilimitados",
      "Criação de conteúdo com IA", 
      "Landing pages otimizadas",
      "Automação de email",
      "Suporte por chat",
      "Templates prontos"
    ])]);

    // Atualizar Plano Anual
    await pool.query(`
      UPDATE subscription_plans 
      SET 
        name = 'Plano Anual',
        description = 'Melhor custo-benefício',
        price_monthly = NULL,
        price_yearly = $1,
        billing_cycle = 'yearly',
        features = $2::jsonb,
        is_highlighted = true,
        display_order = 2,
        badge_text = '💎 MAIS POPULAR'
      WHERE billing_cycle = 'yearly'
    `, [
      67.00 * 12, // R$ 804 por ano (R$ 67/mês)
      JSON.stringify([
        "✨ Tudo do plano mensal",
        "🚀 4 meses completamente grátis",
        "🎯 Suporte prioritário", 
        "⚡ Novos recursos em primeira mão",
        "📈 Relatórios avançados",
        "🔥 Sessão de consultoria grátis"
      ])
    ]);

    // Adicionar coluna stripe_price_id se não existir
    await pool.query(`
      ALTER TABLE subscription_plans 
      ADD COLUMN IF NOT EXISTS stripe_price_id VARCHAR(255)
    `);

    // Atualizar com os Price IDs reais do Stripe
    await pool.query(`
      UPDATE subscription_plans 
      SET stripe_price_id = 'price_1S9buYF7jruBxPaDPhPtcOeh' 
      WHERE billing_cycle = 'monthly'
    `);

    await pool.query(`
      UPDATE subscription_plans 
      SET stripe_price_id = 'price_1S9bvoF7jruBxPaDtXa5cXt1' 
      WHERE billing_cycle = 'yearly'
    `);

    // Verificar os dados atualizados
    const result = await pool.query(`
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
      ORDER BY display_order
    `);

    console.log('Planos atualizados com sucesso:');
    console.table(result.rows);

    process.exit(0);
  } catch (error) {
    console.error('Erro ao atualizar planos:', error);
    process.exit(1);
  }
}

updateSubscriptionPlans();