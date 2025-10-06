import pool from './pgClient';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number | null;
  price_yearly: number | null;
  currency: string;
  billing_cycle: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  is_active: boolean;
  is_highlighted: boolean;
  display_order: number;
  badge_text: string | null;
  stripe_price_id: string | null;
}

export class SubscriptionService {
  async getActivePlans(): Promise<SubscriptionPlan[]> {
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

      return result.rows;
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
      throw error;
    }
  }

  async getPlanById(planId: string): Promise<SubscriptionPlan | null> {
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
        WHERE id = $1 AND is_active = true
      `, [planId]);

      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching plan by ID:', error);
      return null;
    }
  }

  async createSubscription(userId: string, planId: string, stripeCustomerId: string, stripeSubscriptionId: string) {
    try {
      const result = await pool.query(`
        INSERT INTO user_subscriptions (
          user_id, 
          plan_id, 
          status, 
          stripe_customer_id, 
          stripe_subscription_id, 
          started_at
        ) 
        VALUES ($1, $2, 'active', $3, $4, NOW()) 
        RETURNING *
      `, [userId, planId, stripeCustomerId, stripeSubscriptionId]);

      return result.rows[0];
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async getUserSubscription(userId: string) {
    try {
      const result = await pool.query(`
        SELECT 
          us.*,
          sp.name as plan_name,
          sp.description as plan_description,
          sp.price_monthly,
          sp.price_yearly,
          sp.features as plan_features
        FROM user_subscriptions us
        JOIN subscription_plans sp ON us.plan_id = sp.id
        WHERE us.user_id = $1 AND us.status = 'active'
        ORDER BY us.created_at DESC
        LIMIT 1
      `, [userId]);

      return result.rows[0] || null;
    } catch (error) {
      console.error('Error fetching user subscription:', error);
      return null;
    }
  }
}

export const subscriptionService = new SubscriptionService();