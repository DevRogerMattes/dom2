import React from 'react';

import type { ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 32, color: 'red', background: '#fff' }}>
        <h2>Ocorreu um erro inesperado.</h2>
        <p>Tente recarregar a página ou entrar em contato com o suporte.</p>
      </div>;
    }
    return this.props.children;
  }
}
