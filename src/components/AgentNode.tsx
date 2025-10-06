import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Play, Square, CheckCircle, AlertCircle, Settings, Crown, Trash2, Edit2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkflowNode, WorkflowNodeUnion } from '../types/agent';
import { useWorkflowStore } from '../stores/workflowStore';
import { AGENT_CATEGORIES } from '../data/categories';
import { AgentContextMenu } from './AgentContextMenu';
import { EditAgentDialog } from './EditAgentDialog';

interface AgentNodeProps {
  data: WorkflowNode['data'];
  id: string;
  selected?: boolean;
}

export const AgentNode: React.FC<AgentNodeProps> = ({ data, id, selected }) => {
  const { executeNode, selectNode, nodes, removeNode } = useWorkflowStore();
  const { agent, status = 'idle', error, isMainAgent } = data;
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

  const handleExecute = (e: React.MouseEvent) => {
    e.stopPropagation();
    executeNode(id);
  };

  const handleSelect = () => {
    const node = nodes.find(n => n.id === id);
    // Only select agent nodes, not result nodes
    if (node && node.type === 'agent') {
      selectNode(node as WorkflowNode);
    } else {
      selectNode(null);
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    setContextMenuPosition({
      x: rect.left + rect.width / 2,
      y: rect.top
    });
    setShowContextMenu(true);
  };

  const handleCloseContextMenu = () => {
    setShowContextMenu(false);
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <div className="loading-dots"><div></div><div></div><div></div></div>;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Square className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = () => {
    if (isMainAgent) {
      return 'border-slate-500 shadow-slate-200 bg-slate-50';
    }
    
    switch (status) {
      case 'processing':
        return 'border-orange-500 shadow-orange-200';
      case 'completed':
        return 'border-green-500 shadow-green-200';
      case 'error':
        return 'border-red-500 shadow-red-200';
      default:
        return 'border-border';
    }
  };

  const categoryInfo = AGENT_CATEGORIES[agent.category];

  const currentNode = nodes.find(n => n.id === id) as WorkflowNode;

  return (
    <>
      <Card 
        className={`min-w-[250px] cursor-pointer transition-all duration-200 ${getStatusColor()} ${
          selected ? 'ring-2 ring-orange-500 ring-opacity-50' : ''
        } hover:shadow-lg ${isMainAgent ? 'min-w-[300px]' : ''}`}
        onClick={handleSelect}
        onContextMenu={handleContextMenu}
      >
        {/* Input Handle - Hidden for main agent */}
        {!isMainAgent && (
          <Handle
            type="target"
            position={Position.Left}
            className="w-3 h-3 border-2 border-orange-500 bg-background"
          />
        )}

        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{agent.icon}</span>
              {isMainAgent && <Crown className="w-4 h-4 text-slate-600" />}
              <div>
                <h3 className={`font-medium text-sm ${isMainAgent ? 'text-slate-700 font-semibold' : ''}`}>
                  {agent.name}
                </h3>
                <Badge variant={isMainAgent ? "default" : "secondary"} className="text-xs mt-1">
                  {categoryInfo.icon} {categoryInfo.name.split('/')[0]}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {getStatusIcon()}
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleExecute}
                  disabled={status === 'processing'}
                  className="h-7 w-7 p-0 hover:bg-orange-50"
                >
                  <Play className="w-3 h-3 text-orange-500" />
                </Button>
                
                {/* Edit button for all agents */}
                <EditAgentDialog agent={agent}>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 hover:bg-blue-50"
                  >
                    <Edit2 className="w-3 h-3 text-blue-500" />
                  </Button>
                </EditAgentDialog>
                
                {!isMainAgent && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNode(id);
                    }}
                    className="h-7 w-7 p-0 hover:text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground mb-3">
            {agent.description}
          </p>

          {/* Main agent indicator */}
          {isMainAgent && (
            <div className="text-xs bg-slate-100 text-slate-700 p-2 rounded border border-slate-200 mb-2">
              🎯 <strong>Agente Principal</strong> - Define o contexto global do projeto
            </div>
          )}

          {/* Inputs/Outputs Info */}
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>{agent.inputs.length} inputs</span>
            <span>{agent.outputs.length} outputs</span>
          </div>

          {/* Progress Indicator */}
          {status === 'processing' && (
            <div className="w-full bg-muted rounded-full h-1 mb-2">
              <div className="bg-orange-500 h-1 rounded-full animate-pulse w-3/4"></div>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && error && (
            <div className="text-xs text-red-500 bg-red-50 p-2 rounded border border-red-200">
              {error}
            </div>
          )}

          {/* Success Indicator */}
          {status === 'completed' && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded border border-green-200">
              ✓ Processado com sucesso
            </div>
          )}
        </CardContent>

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 border-2 border-orange-500 bg-background"
        />
      </Card>

      {/* Context Menu */}
      {showContextMenu && currentNode && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={handleCloseContextMenu}
          />
          <AgentContextMenu
            node={currentNode}
            position={contextMenuPosition}
            onClose={handleCloseContextMenu}
          />
        </>
      )}
    </>
  );
};
