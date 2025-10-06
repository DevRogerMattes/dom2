import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AGENT_CATEGORIES } from '../data/categories';
import { Agent } from '../types/agent';

interface AgentListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agents: Agent[];
  loading?: boolean;
}

export const AgentListModal: React.FC<AgentListModalProps> = ({ open, onOpenChange, agents, loading }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Agentes</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="text-center py-12 text-foreground/50">Carregando agentes...</div>
        ) : (
          Object.entries(AGENT_CATEGORIES).map(([catKey, cat]) => {
            const agentsByCat = agents.filter(a => a.category === catKey);
            if (agentsByCat.length === 0) return null;
            return (
              <div key={catKey} className="mb-8">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <span>{cat.icon}</span> {cat.name}
                </h2>
                <div className="grid grid-cols-3 gap-4">
                  {agentsByCat.map(agent => (
                    <Card key={agent.id} className={`agent-card category-${agent.category} relative bg-background border-border`}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3 mb-2">
                          <span className="text-xl">{agent.icon}</span>
                          <h4 className="font-medium text-sm text-foreground">
                            {agent.name}
                          </h4>
                        </div>
                        {agent.description && (
                          <div className="text-xs text-foreground/70 mb-2">
                            {agent.description}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs bg-background/80 text-foreground border-border">
                            {cat.icon}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-xs text-foreground/50">
                          <span>{agent.inputs.length} inputs</span>
                          <span>{agent.outputs.length} outputs</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </DialogContent>
    </Dialog>
  );
};
