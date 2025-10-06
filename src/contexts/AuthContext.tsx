import React, { createContext, useContext, useEffect, useState } from 'react';
// Removido Supabase. Usuário será um objeto simples.

interface AuthContextType {
  user: any | null; // Pode ser adaptado conforme o backend
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  loading: boolean;
  updateThemePreference: (theme: string) => Promise<void>; // Added method definition
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tenta carregar usuário do localStorage ao iniciar
    const storedUser = localStorage.getItem('auth-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const applyUserTheme = (theme: string) => {
    console.log('Aplicando tema no DOM:', theme); // Log para depuração
    document.documentElement.setAttribute('data-theme', theme);
    document.body.classList.toggle('dark', theme === 'dark');
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.user) {
        console.log('Usuário logado:', data.user); // Log para verificar o usuário
        setUser(data.user);
        localStorage.setItem('auth-user', JSON.stringify(data.user));
        console.log('Tema recebido após login:', data.user.theme); // Log para verificar o tema recebido
        applyUserTheme(data.user.theme); // Aplica o tema do usuário após o login
        setLoading(false);
        return { error: null };
      } else {
        setLoading(false);
        return { error: data.error || 'Login falhou' };
      }
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (response.ok && data.user) {
        setUser(data.user);
        localStorage.setItem('auth-user', JSON.stringify(data.user));
        setLoading(false);
        return { error: null };
      } else {
        setLoading(false);
        return { error: data.error || 'Cadastro falhou' };
      }
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:3001/api/auth/logout', { method: 'POST' });
      setUser(null);
      localStorage.removeItem('auth-user');
      setLoading(false);
      return { error: null };
    } catch (error) {
      setLoading(false);
      return { error };
    }
  };

  const updateThemePreference = async (theme: string) => {
    if (!user) {
      console.error('Usuário não encontrado para atualizar tema.');
      return;
    }

    console.log('Atualizando tema para:', theme); // Log para depuração
    console.log('ID do usuário:', user.id); // Verificar se o ID do usuário está correto

    try {
      const response = await fetch(`http://localhost:3001/api/users/${user.id}/theme`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme })
      });

      if (response.ok) {
        const updatedUser = { ...user, theme };
        setUser(updatedUser);
        localStorage.setItem('auth-user', JSON.stringify(updatedUser));
        console.log('Tema atualizado com sucesso no banco de dados:', theme);
      } else {
        console.error('Erro ao atualizar tema no banco de dados:', await response.text());
      }
    } catch (error) {
      console.error('Erro ao atualizar tema:', error);
    }
  };

  useEffect(() => {
    if (user?.theme) {
      console.log('Tema carregado do usuário no useEffect:', user.theme); // Log para verificar o tema ao carregar o usuário
      applyUserTheme(user.theme);
    }
  }, [user]);

  const value = {
    user,
    signIn,
    signUp,
    signOut,
    loading,
    updateThemePreference
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};