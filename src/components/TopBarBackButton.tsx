import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const TopBarBackButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      className="rounded-full border border-border bg-transparent text-orange-500 w-8 h-8 flex items-center justify-center hover:bg-orange-100 hover:text-orange-600 transition-all mr-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
      title="Voltar para Workflows"
      type="button"
      onClick={() => navigate('/workflows')}
    >
      <ArrowLeft className="w-5 h-5" />
    </button>
  );
};
