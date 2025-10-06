// Stripe service for payment processing
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-08-27.basil',
});

export interface CreateCheckoutSessionParams {
  priceId: string;
  userId: string;
  userEmail: string;
  planName: string;
  successUrl: string;
  cancelUrl: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

class StripeService {
  async createCheckoutSession(params: CreateCheckoutSessionParams) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: [
          'card'            // Cartão de crédito/débito
        ],
        line_items: [
          {
            price: params.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        customer_email: params.userEmail,
        locale: 'pt-BR',    // Interface em português
        currency: 'brl',    // Moeda brasileira
        metadata: {
          userId: params.userId,
          planName: params.planName,
        },
        subscription_data: {
          metadata: {
            userId: params.userId,
            planName: params.planName,
          },
        },
        // Configurações específicas para cartões
        payment_method_options: {
          card: {
            request_three_d_secure: 'automatic', // 3D Secure automático para cartões
          },
        },
      });

      return session;
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
      throw error;
    }
  }

  async constructEvent(payload: string, signature: string) {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (error) {
      console.error('Erro ao verificar webhook:', error);
      throw error;
    }
  }

  async retrieveSubscription(subscriptionId: string) {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      console.error('Erro ao buscar subscription:', error);
      throw error;
    }
  }

  async retrieveCustomer(customerId: string) {
    try {
      return await stripe.customers.retrieve(customerId);
    } catch (error) {
      console.error('Erro ao buscar customer:', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      return await stripe.subscriptions.cancel(subscriptionId);
    } catch (error) {
      console.error('Erro ao cancelar subscription:', error);
      throw error;
    }
  }

  async createPortalSession(customerId: string, returnUrl: string) {
    try {
      return await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
    } catch (error) {
      console.error('Erro ao criar portal session:', error);
      throw error;
    }
  }

  async createPublicCheckoutSession(params: { priceId: string; planName: string; successUrl: string; cancelUrl: string; }) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: [
          'card'            // Cartão de crédito/débito
        ],
        line_items: [
          {
            price: params.priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        locale: 'pt-BR',    // Interface em português
        currency: 'brl',    // Moeda brasileira
        metadata: {
          planName: params.planName,
          isPublic: 'true'
        },
        subscription_data: {
          metadata: {
            planName: params.planName,
            isPublic: 'true'
          },
        },
        // Configurações específicas para cartões
        payment_method_options: {
          card: {
            request_three_d_secure: 'automatic', // 3D Secure automático para cartões
          },
        },
      });

      return session;
    } catch (error) {
      console.error('Erro ao criar public checkout session:', error);
      throw error;
    }
  }
}

export const stripeService = new StripeService();
export default stripe;