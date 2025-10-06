import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Copy, Trash, X } from 'lucide-react';
import { WorkflowNode } from '../types/agent';
import { useWorkflowStore } from '../stores/workflowStore';

interface AgentContextMenuProps {
  node: WorkflowNode;
  position: { x: number; y: number };
  onClose: () => void;
}

export const AgentContextMenu: React.FC<AgentContextMenuProps> = ({
  node,
  position,
  onClose
}) => {
  const { executeNode, duplicateNode, deleteNode } = useWorkflowStore();

  const handleExecute = async () => {
    let userId = undefined;
    try {
      const authData = localStorage.getItem('auth-user');
      if (authData) {
        const userObj = JSON.parse(authData);
        userId = userObj?.id;
      }
    } catch {}

    const outputs = await executeNode(node.id, userId);
    console.log('Outputs retornados:', outputs);

    if (outputs && Object.keys(outputs).length > 0) {
      alert(`Outputs: ${JSON.stringify(outputs)}`); // Exibe os outputs em um alerta
    } else {
      alert('Nenhum output retornado ou outputs vazios.');
    }

    onClose();
  };

  const handleDuplicate = () => {
    duplicateNode(node.id);
    onClose();
  };

  const handleDelete = () => {
    // Don't allow deleting the main agent
    if (!node.data.isMainAgent) {
      deleteNode(node.id);
    }
    onClose();
  };

  React.useEffect(() => {
    const menu = document.querySelector('.glass') as HTMLElement;
    if (menu) {
      const rect = menu.getBoundingClientRect();
      const overflowX = rect.right > window.innerWidth;
      const overflowY = rect.bottom > window.innerHeight;

      if (overflowX || overflowY) {
        menu.style.left = overflowX ? `${Math.min(position.x, window.innerWidth - rect.width)}px` : `${position.x}px`;
        menu.style.top = overflowY ? `${Math.min(position.y, window.innerHeight - rect.height)}px` : `${position.y}px`;
      }
    }
  }, [position]);

  return (
    <Card 
      className="glass border border-white/20 shadow-glass absolute z-50 p-4 min-w-[240px] min-h-[120px] max-h-[400px] overflow-y-auto"
      style={{
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)', // Centraliza o menu em relação ao ponto de clique
      }}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-foreground font-medium">
            {node.data.agent.name}
          </span>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-6 w-6 p-0 text-foreground/70 hover:text-primary hover:bg-accent"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
        {/* Descrição do agente */}
        {node.data.agent.description && (
          <div className="text-xs text-foreground/70 mb-1">
            {node.data.agent.description}
          </div>
        )}
        {/* Quantidade de inputs e outputs */}
        <div className="flex gap-2 mb-2">
          <span className="text-xs text-foreground/70">
            Inputs: {Array.isArray(node.data.agent.inputs) ? node.data.agent.inputs.length : 0}
          </span>
          <span className="text-xs text-foreground/70">
            Outputs: {Array.isArray(node.data.agent.outputs) ? node.data.agent.outputs.length : 0}
          </span>
        </div>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={handleExecute}
          disabled={node.data.status === 'processing'}
          className="justify-start text-foreground hover:text-primary hover:bg-orange-500/20 hover:border-orange-500/30"
        >
          <Play className="w-3 h-3 mr-2" />
          Executar
        </Button>
        
        <Button
          size="sm"
          variant="ghost"
          onClick={handleDuplicate}
          className="justify-start text-foreground hover:text-blue-500 hover:bg-blue-500/20 hover:border-blue-500/30"
        >
          <Copy className="w-3 h-3 mr-2" />
          Duplicar
        </Button>
        
        {!node.data.isMainAgent && node.data.agent.global_visibility !== 'U' && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleDelete}
            className="justify-start text-red-400 hover:text-red-300 hover:bg-red-500/20 hover:border-red-500/30"
          >
            <Trash className="w-3 h-3 mr-2" />
            Deletar
          </Button>
        )}
        {!node.data.isMainAgent && node.data.agent.global_visibility === 'U' && (
          <Button
            size="sm"
            variant="ghost"
            disabled
            className="justify-start text-gray-400 cursor-not-allowed"
            title="Este agente é global e não pode ser deletado pelo sistema."
          >
            <Trash className="w-3 h-3 mr-2" />
            Deletar (Global)
          </Button>
        )}
      </div>
    </Card>
  );
};
