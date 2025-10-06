import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useWorkflowStore } from '../stores/workflowStore';
import { useAgents } from '../hooks/useAgents';

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  agents: string[];
  connections: Array<{ from: string; to: string }>;
}

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'sales-funnel',
    name: 'Funil de Vendas Completo',
    description: 'Configuração → Headlines → Sales Copy → Landing Page → Email Sequence',
    category: 'Vendas',
    agents: ['project-setup', 'headline-generator', 'sales-copy-creator', 'landing-page-builder', 'email-sequence'],
    connections: [
      { from: 'project-setup', to: 'headline-generator' },
      { from: 'project-setup', to: 'sales-copy-creator' },
      { from: 'headline-generator', to: 'landing-page-builder' },
      { from: 'sales-copy-creator', to: 'landing-page-builder' },
      { from: 'project-setup', to: 'email-sequence' }
    ]
  },
  {
    id: 'course-launch',
    name: 'Lançamento de Curso',
    description: 'Configuração → Estrutura do Curso → Roteiros de Vídeo → Landing Page',
    category: 'Infoprodutos',
    agents: ['project-setup', 'course-outline-creator', 'video-script-writer', 'landing-page-builder'],
    connections: [
      { from: 'project-setup', to: 'course-outline-creator' },
      { from: 'course-outline-creator', to: 'video-script-writer' },
      { from: 'project-setup', to: 'landing-page-builder' }
    ]
  },
  {
    id: 'marketing-campaign',
    name: 'Campanha de Marketing',
    description: 'Configuração → Headlines → Email Marketing → Imagens → Landing Page',
    category: 'Marketing',
    agents: ['project-setup', 'headline-generator', 'email-sequence', 'image-generator', 'landing-page-builder'],
    connections: [
      { from: 'project-setup', to: 'headline-generator' },
      { from: 'project-setup', to: 'email-sequence' },
      { from: 'project-setup', to: 'image-generator' },
      { from: 'headline-generator', to: 'landing-page-builder' },
      { from: 'image-generator', to: 'landing-page-builder' }
    ]
  }
];

export const WorkflowTemplates: React.FC = () => {
  const { addNode, setEdges } = useWorkflowStore();
  const { agents } = useAgents();

  const createFromTemplate = (template: WorkflowTemplate) => {
    // Clear current workflow (keep only main agent)
    
    // Add agents with positions
    const positions = [
      { x: 100, y: 100 }, // Main agent position
      { x: 400, y: 50 },
      { x: 400, y: 200 },
      { x: 700, y: 100 },
      { x: 1000, y: 100 }
    ];

    template.agents.forEach((agentType, index) => {
      if (agentType === 'project-setup') return; // Skip main agent, already exists
      
      const agent = agents.find(a => a.type === agentType);
      if (agent && index < positions.length) {
        addNode(agent, positions[index]);
      }
    });

    // Add connections after a short delay to ensure nodes are created
    setTimeout(() => {
      const edges = template.connections.map((conn, index) => ({
        id: `template-edge-${index}`,
        source: conn.from === 'project-setup' ? 'main-agent' : `${conn.from}-${Date.now()}`,
        target: `${conn.to}-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
        style: { stroke: '#f97316', strokeWidth: 2 }
      }));
      
      setEdges(edges);
    }, 100);
  };

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Templates de Workflow</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {WORKFLOW_TEMPLATES.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">{template.name}</CardTitle>
                <Badge variant="secondary">{template.category}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                {template.description}
              </p>
              <div className="flex flex-wrap gap-1 mb-4">
                {template.agents.map((agentType) => {
                  const agent = agents.find(a => a.type === agentType);
                  return (
                    <Badge key={agentType} variant="outline" className="text-xs">
                      {agent?.icon} {agent?.name.split(' ')[0]}
                    </Badge>
                  );
                })}
              </div>
              <Button 
                size="sm" 
                onClick={() => createFromTemplate(template)}
                className="w-full bg-orange-500 hover:bg-orange-600"
              >
                Usar Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
