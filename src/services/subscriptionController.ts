// src/services/subscriptionController.ts
import express from 'express';
import pool from './pgClient';

type Request = express.Request;
type Response = express.Response;

// GET /api/subscription-plans
export async function getSubscriptionPlans(req: Request, res: Response) {
  try {
    const result = await pool.query(`
      SELECT 
        id,
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
        badge_text,
        stripe_price_id
      FROM subscription_plans 
      WHERE is_active = true 
      ORDER BY display_order ASC
    `);
    
    console.log('🔍 [DEBUG] Dados retornados do banco:', result.rows);
    
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar planos:', err);
    return res.status(500).json({ error: 'Erro ao buscar planos de assinatura.' });
  }
}

// GET /api/user-subscription/:user_id
export async function getUserSubscription(req: Request, res: Response) {
  try {
    const { user_id } = req.params;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id é obrigatório.' });
    }

    const result = await pool.query(`
      SELECT 
        us.id,
        us.status,
        us.started_at,
        us.expires_at,
        sp.name as plan_name,
        sp.description as plan_description,
        sp.price_monthly,
        sp.price_yearly,
        sp.billing_cycle,
        sp.features
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE us.user_id = $1 AND us.status = 'active'
      ORDER BY us.created_at DESC
      LIMIT 1
    `, [user_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Nenhuma assinatura ativa encontrada.' });
    }
    
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao buscar assinatura do usuário:', err);
    return res.status(500).json({ error: 'Erro ao buscar assinatura do usuário.' });
  }
}

// POST /api/user-subscription
export async function createUserSubscription(req: Request, res: Response) {
  try {
    const { user_id, plan_id } = req.body;
    
    if (!user_id || !plan_id) {
      return res.status(400).json({ error: 'user_id e plan_id são obrigatórios.' });
    }

    // Verificar se o plano existe
    const planResult = await pool.query('SELECT * FROM subscription_plans WHERE id = $1 AND is_active = true', [plan_id]);
    if (planResult.rows.length === 0) {
      return res.status(404).json({ error: 'Plano não encontrado.' });
    }

    // Cancelar assinatura ativa anterior
    await pool.query(
      `UPDATE user_subscriptions SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $1 AND status = 'active'`,
      [user_id]
    );

    // Calcular data de expiração
    const plan = planResult.rows[0];
    let expiresAt;
    if (plan.billing_cycle === 'monthly') {
      expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (plan.billing_cycle === 'yearly') {
      expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    // Criar nova assinatura
    const result = await pool.query(`
      INSERT INTO user_subscriptions (user_id, plan_id, status, expires_at)
      VALUES ($1, $2, 'active', $3)
      RETURNING *
    `, [user_id, plan_id, expiresAt]);
    
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar assinatura:', err);
    return res.status(500).json({ error: 'Erro ao criar assinatura.' });
  }
}

// PUT /api/subscription-plans/:id
export async function updateSubscriptionPlan(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { 
      name, 
      description, 
      price_monthly, 
      price_yearly, 
      billing_cycle, 
      features, 
      is_active, 
      is_highlighted, 
      display_order, 
      badge_text 
    } = req.body;
    
    const result = await pool.query(`
      UPDATE subscription_plans 
      SET 
        name = COALESCE($1, name),
        description = COALESCE($2, description),
        price_monthly = COALESCE($3, price_monthly),
        price_yearly = COALESCE($4, price_yearly),
        billing_cycle = COALESCE($5, billing_cycle),
        features = COALESCE($6, features),
        is_active = COALESCE($7, is_active),
        is_highlighted = COALESCE($8, is_highlighted),
        display_order = COALESCE($9, display_order),
        badge_text = COALESCE($10, badge_text),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
    `, [name, description, price_monthly, price_yearly, billing_cycle, features, is_active, is_highlighted, display_order, badge_text, id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Plano não encontrado.' });
    }
    
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar plano:', err);
    return res.status(500).json({ error: 'Erro ao atualizar plano.' });
  }
}