import { useState, useEffect } from 'react';
import { Agent } from '@/types/agent';
import { useAuth } from '@/contexts/AuthContext';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Buscar agentes
  const fetchAgents = async () => {
    if (!user) {
      setAgents([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`/api/agents?userId=${user.id}`);
      if (!response.ok) throw new Error('Erro ao buscar agentes');
      const data = await response.json();
      setAgents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agentes');
    } finally {
      setLoading(false);
    }
  };

  // Criar agente
  const createAgent = async (agentData: Omit<Agent, 'id' | 'isFavorite'> & { template?: string }) => {
    if (!user) throw new Error('Usuário não autenticado');
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...agentData, userId: user.id })
      });
      if (!response.ok) throw new Error('Erro ao criar agente');
      const newAgent = await response.json();
      setAgents(prev => [...prev, newAgent]);
      setTimeout(() => { fetchAgents(); }, 500);
      return newAgent;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao criar agente');
    }
  };

  // Atualizar agente
  const updateAgent = async (id: string, updates: Partial<Agent>) => {
    if (!user) throw new Error('Usuário não autenticado');
    try {
      const response = await fetch(`/api/agents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...updates, userId: user.id })
      });
      if (!response.ok) throw new Error('Erro ao atualizar agente');
      const updatedAgent = await response.json();
      setAgents(prev => prev.map(agent => agent.id === id ? updatedAgent : agent));
      // Sincroniza com o backend para garantir que os inputs estejam atualizados
      await fetchAgents();
      return updatedAgent;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao atualizar agente');
    }
  };

  // Deletar agente
  const deleteAgent = async (id: string) => {
    if (!user) throw new Error('Usuário não autenticado');
    try {
      const response = await fetch(`/api/agents/${id}?userId=${user.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Erro ao deletar agente');
      setAgents(prev => prev.filter(agent => agent.id !== id));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Erro ao deletar agente');
    }
  };

  // Inicializar agentes padrão
  const initializeDefaultAgents = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/agents/default?userId=${user.id}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Erro ao inicializar agentes padrão');
      await fetchAgents();
    } catch (err) {
      console.error('Erro ao inicializar agentes padrão:', err);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, [user]);

  useEffect(() => {
    if (user && agents.length === 0 && !loading) {
      initializeDefaultAgents();
    }
  }, [user, agents.length, loading]);

  return {
    agents,
    loading,
    error,
    createAgent,
    updateAgent,
    deleteAgent,
    refetch: fetchAgents,
  };
}