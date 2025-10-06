import React, { useState, useCallback } from 'react';
import { Search, Folder, Star, Edit, Trash2, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useWorkflowStore } from '../stores/workflowStore';
import { useAgents } from '../hooks/useAgents';
import { AGENT_CATEGORIES } from '../data/categories';
import { Agent } from '../types/agent';
import { AddAgentDialog } from './AddAgentDialog';
import { EditAgentDialog } from './EditAgentDialog';

interface SidebarProps {
  onAgentDrag: (agent: Agent) => void;
  searchByNameOnly?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ onAgentDrag, searchByNameOnly = false }) => {
  React.useEffect(() => {
    let userId = undefined;
    try {
      const authData = localStorage.getItem('auth');
      if (authData) {
        const auth = JSON.parse(authData);
        userId = auth?.user?.id;
      }
    } catch {}
    if (userId) {
      useWorkflowStore.getState().fetchWorkflowsFromApi(userId);
    }
  }, []);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const { 
    searchTerm: storeSearchTerm, 
    setSearchTerm, 
    createWorkflow, 
    workflows, 
    favoriteAgents, 
    toggleFavorite, 
    globalContext 
  } = useWorkflowStore();
  const { agents, loading, refetch, deleteAgent } = useAgents();
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
    const matchesSearch = searchByNameOnly
      ? agent.name.toLowerCase().includes(storeSearchTerm.toLowerCase())
      : agent.name.toLowerCase().includes(storeSearchTerm.toLowerCase()) || agent.description.toLowerCase().includes(storeSearchTerm.toLowerCase());
    let matchesCategory;
    if (selectedCategory === 'favorites') {
      matchesCategory = favoriteAgents.includes(agent.id);
    } else {
      matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
    }
  const isNotSetup = agent.category !== 'setup';
  const result = matchesSearch && matchesCategory && agent.isActive && isNotSetup;
    return result;
  });

  const handleDragStart = (event: React.DragEvent, agent: Agent) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(agent));
    event.dataTransfer.effectAllowed = 'move';
    onAgentDrag(agent);
  };

  const handleToggleFavorite = (event: React.MouseEvent, agentId: string) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(agentId);
  };

  const handleDeleteAgent = async (event: React.MouseEvent, agentId: string, agentName: string) => {
    event.preventDefault();
    event.stopPropagation();
    if (window.confirm(`Tem certeza que deseja deletar o agente "${agentName}"? Esta ação não pode ser desfeita.`)) {
      try {
        await deleteAgent(agentId);
      } catch (error) {
        alert('Erro ao deletar agente. Tente novamente.');
      }
    }
  };

  const agentOutputs = globalContext?.agentResults || {};

  React.useEffect(() => {
    console.log('Outputs dos agentes:', agentOutputs);
  }, [agentOutputs]);

  return (
    <div className="w-80 h-full bg-white dark:bg-background text-foreground border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="relative ml-8">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-orange-500 z-10" />
          <Input 
            placeholder="Procurar..." 
            value={storeSearchTerm} 
            onChange={e => setSearchTerm(e.target.value)} 
            className="pl-7 pr-3 h-7 text-sm glass border-border text-black placeholder:text-gray-500 focus:border-orange-500 focus:ring-orange-500/20 rounded-md w-48 bg-white" 
            style={{ backgroundColor: 'white' }} 
          />
        </div>
      </div>
      {/* Navigation */}
      <div className="p-4 border-b border-white/10">
        <div className="space-y-2">
          <Button 
            variant={selectedCategory === 'all' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setSelectedCategory('all')} 
            className={`w-full justify-start transition-all duration-200 ${selectedCategory === 'all' ? 'bg-gradient-orange text-white shadow-glow' : 'text-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}
          >
            <Folder className="w-4 h-4 mr-2" />
            Todos os Agentes
          </Button>
          <Button 
            variant={selectedCategory === 'favorites' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setSelectedCategory('favorites')} 
            className={`w-full justify-start transition-all duration-200 ${selectedCategory === 'favorites' ? 'bg-gradient-orange text-white shadow-glow' : 'text-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}
          >
            <Star className="w-4 h-4 mr-2" />
            Favoritos
            {favoriteAgents.length > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs bg-background/80 text-foreground border-border">
                {favoriteAgents.length}
              </Badge>
            )}
          </Button>
          {Object.entries(AGENT_CATEGORIES).map(([key, category]) => {
            if (key === 'setup') return null;
            const isSelected = selectedCategory === key;
            return (
              <Button 
                key={key} 
                variant="ghost"
                size="sm" 
                onClick={() => setSelectedCategory(key)} 
                className={`w-full justify-start transition-all duration-200 ${isSelected ? 'bg-gradient-orange text-white shadow-glow' : 'text-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}
              >
                <span className="mr-2">{(category as any).icon}</span>
                {(category as any).name.split('/')[0]}
              </Button>
            );
          })}
        </div>
      </div>
      {/* Add Agent Button */}
      <div className="p-4 border-b border-white/10">
        <AddAgentDialog />
      </div>
      {/* Agents List */}
      <ScrollArea className="flex-1 p-4 custom-scrollbar">
        <div className="space-y-4">
          {selectedCategory === 'favorites' && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/60 mb-3">
                Agentes Favoritos
              </h3>
            </div>
          )}
          {selectedCategory !== 'all' && selectedCategory !== 'setup' && selectedCategory !== 'favorites' && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-white/60 mb-3">
                {AGENT_CATEGORIES[selectedCategory as keyof typeof AGENT_CATEGORIES]?.name}
              </h3>
            </div>
          )}
          <div className="mb-6 p-4 glass rounded-xl border border-white/10 bg-white text-black">
            <div className="text-xs text-orange-400 mb-2 font-medium">
              💡 <strong>Como usar:</strong>
            </div>
            <div className="text-xs text-black">
              Arraste os agentes da lista para o canvas. Clique na estrela para favoritar agentes.
            </div>
          </div>
          {loading && (
            <div className="text-center text-foreground/60 py-8">
              Carregando agentes...
            </div>
          )}
          {filteredAgents.map(agent => (
            <Card 
              key={agent.id} 
              className={`agent-card category-${agent.category} relative bg-background border-border`}
              draggable 
              onDragStart={e => handleDragStart(e, agent)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{agent.icon}</span>
                    <h4 className="font-medium text-sm text-foreground">
                      {agent.name}
                    </h4>
                  </div>
                </div>
                {agent.description && (
                  <div className="text-xs text-foreground/70 mb-2">
                    {agent.description}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <EditAgentDialog agent={agent}>
                    <button
                      className="p-1 rounded transition-colors text-foreground/50 hover:text-blue-400"
                      title="Editar agente"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </EditAgentDialog>
                  <button
                    onClick={(e) => handleDeleteAgent(e, agent.id, agent.name)}
                    className="p-1 rounded transition-colors text-foreground/50 hover:text-red-400"
                    title="Deletar agente"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleToggleFavorite(e, agent.id)}
                    className={`p-1 rounded transition-colors ${favoriteAgents.includes(agent.id) ? 'text-yellow-400 hover:text-yellow-300' : 'text-foreground/50 hover:text-yellow-400'}`}
                  >
                    <Star className="w-4 h-4" fill={favoriteAgents.includes(agent.id) ? 'currentColor' : 'none'} />
                  </button>
                  <Badge 
                    variant="secondary" 
                    className="text-xs bg-background/80 text-foreground border-border"
                  >
                    {AGENT_CATEGORIES[agent.category].icon}
                  </Badge>
                </div>
                <p className="text-xs text-foreground/70 mb-3">
                  {agent.description}
                </p>
                <div className="flex items-center justify-between text-xs text-foreground/50">
                  <span>{agent.inputs.length} inputs</span>
                  <span>{agent.outputs.length} outputs</span>
                </div>
              </CardContent>
            </Card>
          ))}
          {!loading && filteredAgents.length === 0 && (
            <div className="text-center py-12 text-foreground/50">
              {selectedCategory === 'favorites' ? (
                <>
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm mb-1">Nenhum agente favorito</p>
                  <p className="text-xs">Clique na estrela para favoritar agentes</p>
                </>
              ) : (
                <>
                  <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="text-sm mb-1">Nenhum agente encontrado</p>
                  <p className="text-xs">Tente ajustar os filtros</p>
                </>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};