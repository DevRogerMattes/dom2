import { useState, useCallback } from 'react';
import { useWorkflowStore } from '@/stores/workflowStore';
import { useAuth } from '@/contexts/AuthContext';
import { WorkflowNode } from '@/types/agent';

interface ExecutionResult {
  nodeId: string;
  outputs?: Record<string, any>;
  error?: string;
}

export function useVisualExecution() {
  const { user } = useAuth();
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [results, setResults] = useState<ExecutionResult[]>([]);
  
  const { nodes, edges, executeNode, updateNodeData } = useWorkflowStore();

  const buildExecutionOrder = useCallback((startNodeId: string): string[] => {
    const visited = new Set<string>();
    const order: string[] = [];

    function visit(nodeId: string) {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const outgoingEdges = edges.filter(edge => edge.source === nodeId);

      for (const edge of outgoingEdges) {
        visit(edge.target);
      }

      order.push(nodeId);
    }

    visit(startNodeId);
    return order.reverse();
  }, [edges]);

  const executeWorkflowVisually = useCallback(async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    setResults([]);
    setCurrentNodeId(null);

    try {
      // Encontra o agente principal
      const mainAgent = nodes.find(
        n => n.type === 'agent' && (n as WorkflowNode).data.isMainAgent
      );

      if (!mainAgent) {
        throw new Error('Agente principal não encontrado');
      }

      const executionOrder = buildExecutionOrder(mainAgent.id);
      console.log('Ordem de execução:', executionOrder);

      for (const nodeId of executionOrder) {
        setCurrentNodeId(nodeId);
        updateNodeData(nodeId, { status: 'processing' });
        
        try {
          // Aguarda 500ms para efeito visual
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const result = await executeNode(nodeId, user?.id);
          
          console.log(`Resultado do nó ${nodeId}:`, result);
          
          // Atualiza status do nó e adiciona resultado
          updateNodeData(nodeId, { 
            status: 'completed',
            outputs: result
          });
          
          setResults(prevResults => {
            const updatedResults = [...prevResults, { 
              nodeId, 
              outputs: result,
              error: null
            }];
            console.log('Resultados atualizados:', updatedResults);
            return updatedResults;
          });
          
        } catch (error) {
          console.error(`Erro ao executar nó ${nodeId}:`, error);
          
          // Atualiza status do nó com erro
          updateNodeData(nodeId, { 
            status: 'error',
            error: String(error)
          });
          
          setResults(prevResults => [
            ...prevResults, 
            { nodeId, outputs: {}, error: String(error) }
          ]);
        }
      }
    } catch (error) {
      console.error('Erro na execução do workflow:', error);
    } finally {
      setIsExecuting(false);
      setCurrentNodeId(null);
    }
  }, [isExecuting, nodes, edges, executeNode, updateNodeData, buildExecutionOrder]);

  return {
    isExecuting,
    currentNodeId,
    results,
    executeWorkflowVisually
  };
};
