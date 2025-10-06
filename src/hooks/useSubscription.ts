// src/hooks/useSubscription.ts
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: string | null;
  price_yearly: string | null;
  currency: string;
  billing_cycle: string;
  features: string[];
  is_active: boolean;
  is_highlighted: boolean;
  display_order: number;
  badge_text: string | null;
  stripe_price_id: string | null;
}

export interface UserSubscription {
  id: string;
  status: string;
  started_at: string;
  expires_at: string;
  plan_name: string;
  plan_description: string;
  price_monthly: string | null;
  price_yearly: string | null;
  billing_cycle: string;
  features: string[];
}

export const useSubscription = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPlans = useCallback(async () => {
    try {
      console.log('🔄 Buscando planos...');
      const response = await fetch('http://localhost:3001/api/subscription-plans');
      if (!response.ok) {
        throw new Error('Erro ao buscar planos');
      }
      const data = await response.json();
      console.log('✅ Planos carregados:', data);
      setPlans(data);
    } catch (err: any) {
      console.error('❌ Erro ao buscar planos:', err);
      setError(err.message);
    }
  }, []);

  const fetchUserSubscription = useCallback(async () => {
    if (!user?.id) {
      console.log('⚠️ Usuário não tem ID, pulando busca de assinatura:', user);
      return;
    }
    
    try {
      console.log('🔄 Buscando assinatura do usuário:', user.id);
      const response = await fetch(`http://localhost:3001/api/user-subscription/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Assinatura encontrada:', data);
        setUserSubscription(data);
      } else if (response.status === 404) {
        console.log('ℹ️ Usuário não tem assinatura ativa');
        // Usuário não tem assinatura ativa
        setUserSubscription(null);
      } else {
        throw new Error('Erro ao buscar assinatura do usuário');
      }
    } catch (err: any) {
      console.error('❌ Erro ao buscar assinatura:', err);
      // Não definir como erro se for apenas ausência de assinatura
    }
  }, [user?.id]);

  const subscribeToPlan = async (planId: string) => {
    if (!user?.id) {
      throw new Error('Usuário não autenticado');
    }

    try {
      const response = await fetch('http://localhost:3001/api/user-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          plan_id: planId,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao assinar plano');
      }

      const data = await response.json();
      await fetchUserSubscription(); // Recarregar assinatura do usuário
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🚀 Iniciando carregamento de dados de assinatura');
        setLoading(true);
        await Promise.all([fetchPlans(), fetchUserSubscription()]);
        console.log('✅ Dados de assinatura carregados com sucesso');
      } catch (err) {
        console.error('❌ Erro ao carregar dados de assinatura:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchPlans, fetchUserSubscription]);

  const hasActiveSubscription = userSubscription && userSubscription.status === 'active';

  return {
    plans,
    userSubscription,
    loading,
    error,
    hasActiveSubscription,
    subscribeToPlan,
    refreshData: () => {
      fetchPlans();
      fetchUserSubscription();
    },
  };
};