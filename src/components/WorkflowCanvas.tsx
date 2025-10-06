import React, { useCallback, useRef, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  ReactFlowInstance,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { AgentNode } from './AgentNode';
import { ResultNode } from './ResultNode';
import { CustomEdge } from './CustomEdge';
import { useWorkflowStore } from '../stores/workflowStore';
import { useAgents } from '../hooks/useAgents';
import { Agent, WorkflowNode } from '../types/agent';

const nodeTypes = {
  agent: AgentNode,
  result: ResultNode,
};

const edgeTypes = {
  default: CustomEdge,
  smoothstep: CustomEdge,
};

export const WorkflowCanvas: React.FC = () => {
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    addNode,
    saveWorkflow,
    loadWorkflow,
    workflows,
    currentWorkflow,
    initializeMainAgent
  } = useWorkflowStore();
  
  const { agents } = useAgents();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const previousViewport = useRef({ x: 0, y: 0, zoom: 1 });

  // Cast nodes to Node[] for ReactFlow compatibility
  const reactFlowNodes = nodes as Node[];

  const [localNodes, setLocalNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [localEdges, setLocalEdges, onEdgesChange] = useEdgesState(edges);

  // Carregar último workflow salvo ou inicializar main agent se não houver workflows
  useEffect(() => {
    if (workflows.length > 0 && !currentWorkflow) {
      // Encontrar o workflow mais recente (assumindo que o último da lista é o mais recente)
      const lastWorkflow = workflows[workflows.length - 1];
      console.log('Carregando último workflow salvo:', lastWorkflow.name);
      loadWorkflow(lastWorkflow.id);
    } else if (nodes.length === 0 && agents.length > 0) {
      console.log('Inicializando agente principal');
      initializeMainAgent(agents);
    }
  }, [workflows, currentWorkflow, nodes.length, loadWorkflow, initializeMainAgent, agents]);

  // Sync with store
  React.useEffect(() => {
    setLocalNodes(nodes as Node[]);
  }, [nodes, setLocalNodes]);

  React.useEffect(() => {
    setLocalEdges(edges);
  }, [edges, setLocalEdges]);

  React.useEffect(() => {
    setNodes(localNodes as any);
  }, [localNodes, setNodes]);

  React.useEffect(() => {
    setEdges(localEdges);
  }, [localEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      console.log('🔗 [WorkflowCanvas] Nova conexão criada:', params);
      
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
        style: { 
          stroke: '#f97316', 
          strokeWidth: 2,
          filter: 'drop-shadow(0 0 6px rgba(249, 115, 22, 0.6))'
        }
      };
      
      console.log('🔗 [WorkflowCanvas] Edge criada:', newEdge);
      
      setLocalEdges((eds) => {
        const updatedEdges = addEdge(newEdge, eds);
        console.log('🔗 [WorkflowCanvas] Todas as edges após adição:', updatedEdges);
        return updatedEdges;
      });
      
      // Salvar após um pequeno delay para garantir que o estado foi atualizado
      setTimeout(() => {
        console.log('🔗 [WorkflowCanvas] Salvando workflow após conexão...');
        saveWorkflow();
      }, 100);
    },
    [setLocalEdges, saveWorkflow]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
        console.log('ReactFlow wrapper or instance not ready');
        return;
      }

      try {
        const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
        if (!reactFlowBounds) {
          console.error('ReactFlow bounds not found');
          alert('Ocorreu um erro inesperado. Tente recarregar a página ou entrar em contato com o suporte.');
          return;
        }

        const agentData = event.dataTransfer.getData('application/reactflow');
        if (!agentData) {
          console.error('No agent data found in drop event');
          alert('Ocorreu um erro inesperado ao arrastar o fluxo. Tente novamente ou entre em contato com o suporte.');
          return;
        }

        const agent: Agent = JSON.parse(agentData);
        console.log('Dropping agent:', agent);

        if (agent.category === 'setup') {
          console.warn('Setup agent already exists');
          alert('Não é possível adicionar múltiplos agentes de configuração.');
          return;
        }

        const position = reactFlowInstance?.screenToFlowPosition({
          x: Math.max(0, Math.min(event.clientX - reactFlowBounds.left, reactFlowBounds.width)),
          y: Math.max(0, Math.min(event.clientY - reactFlowBounds.top, reactFlowBounds.height)),
        });

        if (!position) {
          console.error('Failed to calculate drop position');
          alert('Ocorreu um erro inesperado ao calcular a posição do fluxo.');
          return;
        }

        console.log('Drop position:', position);
        addNode(agent, position);

        // Verificar se o fluxo está fora dos limites visíveis
        const viewport = reactFlowInstance?.getViewport();
        if (viewport) {
          const isOutOfBounds =
            position.x < viewport.x ||
            position.y < viewport.y ||
            position.x > viewport.x + reactFlowBounds.width ||
            position.y > viewport.y + reactFlowBounds.height;

          if (isOutOfBounds) {
            console.warn('Fluxo fora dos limites visíveis, reposicionando...');
            reactFlowInstance?.fitView({ padding: 0.2 });
          }
        }
      } catch (error) {
        console.error('Error during drop event:', error);
        alert('Ocorreu um erro inesperado. Tente recarregar a página ou entrar em contato com o suporte.');
      }
    },
    [reactFlowInstance, addNode]
  );

  const onInit = useCallback((instance: ReactFlowInstance) => {
    console.log('ReactFlow instance initialized');
    setReactFlowInstance(instance);
  }, []);

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (reactFlowInstance) {
      console.log('Node clicked:', node);
      reactFlowInstance.fitView({ nodes: [node], padding: 0.2 });
    }
  }, [reactFlowInstance]);

  return (
  <div className="w-full h-full bg-white dark:bg-fusion-darker" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={localNodes}
        edges={localEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={handleNodeClick} // Added node click handler
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
  className="bg-white dark:bg-fusion-darker"
        style={{
          background: 'radial-gradient(circle at 20% 80%, rgba(249, 115, 22, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(234, 88, 12, 0.08) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(220, 38, 38, 0.04) 0%, transparent 50%)'
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={4}
        snapToGrid={true}
        snapGrid={[15, 15]}
        nodesDraggable={true}
        elementsSelectable={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        panOnScroll={true}
        panOnDrag={true}
      >
        <Background 
          color="rgba(0,0,0,0.07)"
          gap={20} 
          size={1}
          className="opacity-30"
        />
        <Controls 
          className="border border-orange-500 bg-white dark:bg-black [&>button]:bg-black [&>button]:border-orange-500 [&>button]:text-white [&>button]:rounded-xl dark:[&>button]:shadow-lg [&>button:hover]:bg-orange-500 [&>button:hover]:text-white [&>button:hover]:border-orange-600"
          showInteractive={false}
        />
        <MiniMap 
          className="glass border border-border shadow-glass"
          pannable={true} // Enable panning on the MiniMap
          nodeColor={(node) => {
            if ((node as any).type === 'result') return '#10b981';
            
            const agent = (node as any).data?.agent;
            if (!agent) return '#64748b';
            
            const colorMap = {
              setup: '#f97316',
              copywriting: '#3b82f6',
              infoproduct: '#10b981',
              seo: '#f59e0b',
              document: '#ef4444',
              sales: '#f97316'
            };
            
            return colorMap[agent.category] || '#64748b';
          }}
          maskColor={window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)"}
          style={{
            background: window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'rgba(12, 12, 12, 0.9)' : '#fff',
            border: '1px solid var(--border)'
          }}
        />
      </ReactFlow>
    </div>
  );
};

export const WorkflowCanvasProvider: React.FC = () => {
  return (
    <ReactFlowProvider>
      <WorkflowCanvas />
    </ReactFlowProvider>
  );
};
