// Rotas para integração com Stripe
import express, { Router } from 'express';
import { stripeService } from '../services/stripeService';
import pool from '../services/pgClient';

const router = Router();

// Criar sessão de checkout
router.post('/api/stripe/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, planName } = req.body;

    if (!priceId || !userId || !planName) {
      return res.status(400).json({ 
        error: 'priceId, userId e planName são obrigatórios' 
      });
    }

    // Buscar dados do usuário
    const userResult = await pool.query(
      'SELECT email FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const userEmail = userResult.rows[0].email;
    const baseUrl = process.env.VITE_APP_URL || 'http://localhost:5173';

    const session = await stripeService.createCheckoutSession({
      priceId,
      userId,
      userEmail,
      planName,
      successUrl: `${baseUrl}/app?payment=success`,
      cancelUrl: `${baseUrl}/app?payment=cancelled`,
    });

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// Criar sessão de checkout pública (sem necessidade de login)
router.post('/api/stripe/create-public-session', async (req, res) => {
  try {
    const { priceId, planName } = req.body;

    if (!priceId || !planName) {
      return res.status(400).json({ 
        error: 'priceId e planName são obrigatórios' 
      });
    }

    console.log('Criando sessão pública para:', { priceId, planName });

    const session = await stripeService.createPublicCheckoutSession({
      priceId,
      planName,
      successUrl: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/app?payment=success`,
      cancelUrl: `${process.env.VITE_APP_URL || 'http://localhost:5173'}/?payment=cancelled`,
    });

    console.log('Sessão criada com sucesso:', session.id);

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });

  } catch (error) {
    console.error('Erro ao criar sessão pública:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// Webhook para processar eventos do Stripe
router.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    
    if (!signature) {
      return res.status(400).json({ error: 'Assinatura do webhook não encontrada' });
    }

    const event = await stripeService.constructEvent(
      req.body.toString(),
      signature
    );

    console.log('Webhook recebido:', event.type);

    // Processar diferentes tipos de eventos
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        console.log('Checkout session completada:', session.id);
        
        if (session.mode === 'subscription') {
          await handleSubscriptionCreated(session);
        }
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        console.log('Subscription criada/atualizada:', subscription.id);
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        console.log('Subscription cancelada:', subscription.id);
        await handleSubscriptionCancelled(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        console.log('Pagamento bem-sucedido:', invoice.id);
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.log('Pagamento falhou:', invoice.id);
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    res.json({ received: true });

  } catch (error) {
    console.error('Erro ao processar webhook:', error);
    res.status(400).json({ 
      error: 'Erro ao processar webhook' 
    });
  }
});

// Criar portal de gerenciamento de assinatura
router.post('/api/stripe/create-portal-session', async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ 
        error: 'customerId é obrigatório' 
      });
    }

    const baseUrl = process.env.VITE_APP_URL || 'http://localhost:5173';
    
    const portalSession = await stripeService.createPortalSession(
      customerId,
      `${baseUrl}/app`
    );

    res.json({ 
      url: portalSession.url 
    });

  } catch (error) {
    console.error('Erro ao criar portal session:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor' 
    });
  }
});

// Funções auxiliares para processar webhooks
async function handleSubscriptionCreated(session: any) {
  try {
    const userId = session.metadata?.userId;
    const planName = session.metadata?.planName;
    
    if (!userId || !planName) {
      console.error('Metadata inválida na sessão:', session.metadata);
      return;
    }

    // Buscar o plano no banco
    const planResult = await pool.query(
      'SELECT id FROM subscription_plans WHERE name = $1',
      [planName]
    );

    if (planResult.rows.length === 0) {
      console.error('Plano não encontrado:', planName);
      return;
    }

    const planId = planResult.rows[0].id;

    // Criar nova assinatura
    await pool.query(`
      INSERT INTO user_subscriptions (
        user_id, 
        plan_id, 
        stripe_subscription_id, 
        stripe_customer_id,
        status, 
        current_period_start, 
        current_period_end
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW() + INTERVAL '1 month')
    `, [
      userId,
      planId,
      session.subscription,
      session.customer,
      'active'
    ]);

    console.log('Assinatura criada com sucesso para usuário:', userId);

  } catch (error) {
    console.error('Erro ao criar assinatura:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  try {
    const stripeSubscriptionId = subscription.id;
    
    await pool.query(`
      UPDATE user_subscriptions 
      SET 
        status = $1,
        current_period_start = to_timestamp($2),
        current_period_end = to_timestamp($3),
        updated_at = NOW()
      WHERE stripe_subscription_id = $4
    `, [
      subscription.status,
      subscription.current_period_start,
      subscription.current_period_end,
      stripeSubscriptionId
    ]);

    console.log('Assinatura atualizada:', stripeSubscriptionId);

  } catch (error) {
    console.error('Erro ao atualizar assinatura:', error);
  }
}

async function handleSubscriptionCancelled(subscription: any) {
  try {
    const stripeSubscriptionId = subscription.id;
    
    await pool.query(`
      UPDATE user_subscriptions 
      SET 
        status = 'cancelled',
        updated_at = NOW()
      WHERE stripe_subscription_id = $1
    `, [stripeSubscriptionId]);

    console.log('Assinatura cancelada:', stripeSubscriptionId);

  } catch (error) {
    console.error('Erro ao cancelar assinatura:', error);
  }
}

async function handlePaymentSucceeded(invoice: any) {
  try {
    const subscriptionId = invoice.subscription;
    
    if (subscriptionId) {
      await pool.query(`
        UPDATE user_subscriptions 
        SET 
          status = 'active',
          updated_at = NOW()
        WHERE stripe_subscription_id = $1
      `, [subscriptionId]);

      console.log('Pagamento confirmado para subscription:', subscriptionId);
    }

  } catch (error) {
    console.error('Erro ao confirmar pagamento:', error);
  }
}

async function handlePaymentFailed(invoice: any) {
  try {
    const subscriptionId = invoice.subscription;
    
    if (subscriptionId) {
      await pool.query(`
        UPDATE user_subscriptions 
        SET 
          status = 'past_due',
          updated_at = NOW()
        WHERE stripe_subscription_id = $1
      `, [subscriptionId]);

      console.log('Pagamento falhou para subscription:', subscriptionId);
    }

  } catch (error) {
    console.error('Erro ao processar pagamento falho:', error);
  }
}

export default router;