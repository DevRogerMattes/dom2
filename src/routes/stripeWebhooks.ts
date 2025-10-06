import express from 'express';
import Stripe from 'stripe';
import { subscriptionService } from '../services/subscriptionService';
import { emailService } from '../services/emailService';
import pool from '../services/pgClient';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil' as any,
});

const router = express.Router();

// Webhook endpoint para processar eventos do Stripe
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']!;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Checkout completed for session:', session.id);
  
  if (session.mode === 'subscription' && session.subscription) {
    // Buscar detalhes da subscription
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
    const customerData = await stripe.customers.retrieve(session.customer as string);
    
    if (!customerData || 'deleted' in customerData) {
      console.error('Customer not found or was deleted');
      return;
    }
    
    const customer = customerData as Stripe.Customer;

    // Buscar o plano pelo price_id
    const priceId = subscription.items.data[0]?.price.id;
    const planResult = await pool.query(
      'SELECT * FROM subscription_plans WHERE stripe_price_id = $1',
      [priceId]
    );
    
    const plan = planResult.rows[0];
    if (!plan) {
      console.error('Plan not found for price_id:', priceId);
      return;
    }

    // Criar usuário se não existir
    const userEmail = customer.email!;
    const userName = customer.name || userEmail.split('@')[0];
    
    let userId: string;
    
    // Verificar se usuário já existe
    const existingUserResult = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [userEmail]
    );
    
    if (existingUserResult.rows.length > 0) {
      userId = existingUserResult.rows[0].id;
    } else {
      // Criar novo usuário
      const temporaryPassword = generateTemporaryPassword();
      const hashedPassword = await hashPassword(temporaryPassword);
      
      const newUserResult = await pool.query(`
        INSERT INTO users (email, name, password_hash, email_verified, created_at) 
        VALUES ($1, $2, $3, true, NOW()) 
        RETURNING id
      `, [userEmail, userName, hashedPassword]);
      
      userId = newUserResult.rows[0].id;
      
      // Enviar email de boas-vindas com credenciais
      await emailService.sendWelcomeEmail({
        userEmail,
        userName,
        planName: plan.name,
        loginUrl: `${process.env.FRONTEND_URL}/auth`,
        temporaryPassword,
      });
    }

    // Criar assinatura no banco
    await subscriptionService.createSubscription(
      userId,
      plan.id,
      customer.id,
      subscription.id
    );

    console.log('Subscription created successfully for user:', userEmail);
  }
}

async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('Subscription created:', subscription.id);
  // Lógica adicional se necessário
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Subscription updated:', subscription.id);
  
  // Atualizar status da assinatura no banco
  await pool.query(`
    UPDATE user_subscriptions 
    SET 
      status = $1,
      updated_at = NOW()
    WHERE stripe_subscription_id = $2
  `, [
    subscription.status === 'active' ? 'active' : 'cancelled',
    subscription.id
  ]);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Subscription deleted:', subscription.id);
  
  // Marcar assinatura como cancelada
  await pool.query(`
    UPDATE user_subscriptions 
    SET 
      status = 'cancelled',
      cancelled_at = NOW(),
      updated_at = NOW()
    WHERE stripe_subscription_id = $1
  `, [subscription.id]);
}

function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

async function hashPassword(password: string): Promise<string> {
  const bcrypt = require('bcrypt');
  return await bcrypt.hash(password, 10);
}

export default router;