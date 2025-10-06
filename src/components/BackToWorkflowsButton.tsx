import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const BackToWorkflowsButton: React.FC = () => {
  const navigate = useNavigate();
  return (
    <button
      className="rounded-full bg-gradient-to-r from-gray-300 to-gray-400 text-black w-7 h-7 flex items-center justify-center shadow text-base hover:bg-gray-500 transition-all"
      title="Voltar para Workflows"
      type="button"
      onClick={() => navigate('/workflows')}
      style={{ position: 'absolute', left: 16, top: 16, zIndex: 20 }}
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
  );
};
