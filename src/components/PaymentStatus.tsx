// Componente para mostrar status do pagamento
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

interface PaymentStatusProps {
  onClose?: () => void;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({ onClose }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<'success' | 'cancelled' | 'processing' | null>(null);

  useEffect(() => {
    const paymentStatus = searchParams.get('payment');
    
    if (paymentStatus === 'success') {
      setStatus('success');
      // Remove o parâmetro da URL após 3 segundos
      setTimeout(() => {
        searchParams.delete('payment');
        setSearchParams(searchParams);
        setStatus(null);
        onClose?.();
      }, 5000);
    } else if (paymentStatus === 'cancelled') {
      setStatus('cancelled');
      // Remove o parâmetro da URL após 3 segundos  
      setTimeout(() => {
        searchParams.delete('payment');
        setSearchParams(searchParams);
        setStatus(null);
        onClose?.();
      }, 5000);
    }
  }, [searchParams, setSearchParams, onClose]);

  if (!status) return null;

  const getStatusConfig = () => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          title: 'Pagamento Aprovado!',
          message: 'Sua assinatura foi ativada com sucesso. Agora você tem acesso a todas as funcionalidades.',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-800 dark:text-green-200'
        };
      case 'cancelled':
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          title: 'Pagamento Cancelado',
          message: 'O pagamento foi cancelado. Você pode tentar novamente a qualquer momento.',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-800 dark:text-red-200'
        };
      case 'processing':
        return {
          icon: <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />,
          title: 'Processando Pagamento...',
          message: 'Estamos confirmando seu pagamento. Isso pode levar alguns minutos.',
          bgColor: 'bg-blue-50 dark:bg-blue-900/20',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-800 dark:text-blue-200'
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-6 shadow-lg`}>
        <div className="flex items-start gap-4">
          {config.icon}
          <div className="flex-1">
            <h3 className={`font-semibold text-lg ${config.textColor} mb-2`}>
              {config.title}
            </h3>
            <p className={`text-sm ${config.textColor} opacity-90`}>
              {config.message}
            </p>
          </div>
          <button
            onClick={() => {
              searchParams.delete('payment');
              setSearchParams(searchParams);
              setStatus(null);
              onClose?.();
            }}
            className={`${config.textColor} hover:opacity-70 text-xl leading-none`}
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};