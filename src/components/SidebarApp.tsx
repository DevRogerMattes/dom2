import React, { useState, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAgents } from '../hooks/useAgents';
import { AGENT_CATEGORIES } from '../data/categories';
import { Agent } from '../types/agent';
import { AddAgentDialog } from './AddAgentDialog';
import { EditAgentDialog } from './EditAgentDialog';
import { BackToWorkflowsButton } from './BackToWorkflowsButton';
import { PanelToggleButtons } from './PanelToggleButtons';

interface SidebarAppProps {
  onAgentDrag: (agent: Agent) => void;
}

export const SidebarApp: React.FC<SidebarAppProps> = ({ onAgentDrag }) => {
  const { agents, loading, refetch } = useAgents();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [forceUpdate, setForceUpdate] = useState(0);

  const handleForceUpdate = useCallback(() => {
    setForceUpdate(prev => prev + 1);
    refetch();
  }, [refetch]);

  React.useEffect(() => {
    const handleAgentCreated = () => {
      handleForceUpdate();
    };
    window.addEventListener('agentCreated', handleAgentCreated);
    return () => window.removeEventListener('agentCreated', handleAgentCreated);
  }, [handleForceUpdate]);

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    return matchesSearch && matchesCategory && agent.isActive && agent.category !== 'setup';
  });

  const handleDragStart = (event: React.DragEvent, agent: Agent) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(agent));
    event.dataTransfer.effectAllowed = 'move';
    onAgentDrag(agent);
  };

  return (
    <div className="w-80 h-full bg-white dark:bg-background text-foreground border-r border-border flex flex-col">
  {/* Botão de novo agente acima da busca removido para evitar duplicidade */}
      {/* Search by name */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center ml-8 gap-2">
          <div className="relative flex-1 flex items-center">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-orange-500 z-10" />
            <Input 
              placeholder="Procurar agente..." 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-7 pr-3 h-7 text-sm glass border-border text-black placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20 rounded-md w-48 bg-white" 
              style={{ backgroundColor: 'white' }} 
            />
            {/* Botão do menu retrátil (PanelToggleButtons) ao lado direito do campo de busca */}
            <div className="ml-2">
              <PanelToggleButtons isLeftPanelVisible={true} isRightPanelVisible={true} onToggleLeftPanel={() => {}} onToggleRightPanel={() => {}} />
            </div>
          </div>
        </div>
      </div>
      {/* Category select */}
        <div className="p-2 border-b border-white/10">
          <div className="flex items-center gap-2">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="px-2 py-1 rounded border border-border bg-white dark:bg-neutral-900 text-black dark:text-white text-xs flex-1"
            >
              <option value="all">Todas as categorias</option>
              {Object.entries(AGENT_CATEGORIES).map(([key, cat]) => (
                key !== 'setup' && (
                  <option key={key} value={key}>
                    {cat.icon} {cat.name}
                  </option>
                )
              ))}
            </select>
            <AddAgentDialog>
              <button
                className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white w-7 h-7 flex items-center justify-center shadow-glow text-base"
                title="Adicionar novo agente"
                type="button"
              >
                <Plus className="w-4 h-4" />
              </button>
            </AddAgentDialog>
          </div>
        </div>
      {/* Novo Agente Button */}
    {/* Botão de novo agente removido do menu lateral, agora está na TopBar */}
      {/* Agents List */}
      <ScrollArea className="flex-1 p-4 custom-scrollbar">
        <div className="grid grid-cols-2 gap-4">
          {loading && (
            <div className="col-span-2 text-center text-foreground/60 py-8">
              Carregando agentes...
            </div>
          )}
          {filteredAgents.map(agent => (
              <Card 
                key={agent.id} 
                className={`agent-card category-${agent.category} relative bg-background border-border min-h-[80px] max-h-[110px] h-[100px] p-0 flex-1`} 
                draggable 
                onDragStart={e => handleDragStart(e, agent)}
                style={{ minWidth: '110px', maxWidth: '150px', height: '100px', margin: '0' }}
              >
                <CardContent className="p-1 flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col items-center justify-center w-full mb-1">
                    <span className="text-base mb-1">{agent.icon}</span>
                    <h4 className="font-semibold text-[10px] text-foreground text-center w-full leading-tight break-words" style={{ maxWidth: '120px', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                      {agent.name}
                    </h4>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1 w-full">
                    <EditAgentDialog agent={agent}>
                      <button
                        className="p-1 rounded transition-colors text-foreground/50 hover:text-blue-400 text-[8px]"
                        title="Editar agente"
                        style={{ fontSize: '8px' }}
                      >
                        Editar
                      </button>
                    </EditAgentDialog>
                  </div>
                </CardContent>
              </Card>
          ))}
          {!loading && filteredAgents.length === 0 && (
            <div className="col-span-2 text-center py-12 text-foreground/50">
              <p className="text-sm mb-1">Nenhum agente encontrado</p>
              <p className="text-xs">Tente ajustar os filtros</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
