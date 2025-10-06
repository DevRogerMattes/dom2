// Hook para integração com Stripe
import { useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

// Inicializar Stripe com a chave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface StripeCheckoutParams {
  priceId: string;
  planName: string;
}

export const useStripeCheckout = () => {
  const { user } = useAuth();

  const redirectToCheckout = useCallback(async ({ priceId, planName }: StripeCheckoutParams) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não está logado');
      }

      console.log('Criando sessão de checkout para:', { priceId, planName, userId: user.id });

      // Criar sessão de checkout no backend
      const response = await apiService.post('/api/stripe/create-checkout-session', {
        priceId,
        userId: user.id,
        planName,
      });

      if (!response.data?.sessionId) {
        throw new Error('Erro ao criar sessão de checkout');
      }

      // Redirecionar para o Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Erro ao carregar Stripe');
      }

      console.log('Redirecionando para checkout:', response.data.sessionId);

      const { error } = await stripe.redirectToCheckout({
        sessionId: response.data.sessionId,
      });

      if (error) {
        console.error('Erro ao redirecionar para checkout:', error);
        throw error;
      }

    } catch (error) {
      console.error('Erro no processo de checkout:', error);
      throw error;
    }
  }, [user]);

  const createPortalSession = useCallback(async (customerId: string) => {
    try {
      const response = await apiService.post('/api/stripe/create-portal-session', {
        customerId,
      });

      if (response.data?.url) {
        window.open(response.data.url, '_blank');
      } else {
        throw new Error('Erro ao criar sessão do portal');
      }

    } catch (error) {
      console.error('Erro ao abrir portal de gerenciamento:', error);
      throw error;
    }
  }, []);

  return {
    redirectToCheckout,
    createPortalSession,
    isStripeLoaded: !!stripePromise,
  };
};