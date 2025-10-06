initWorkflowsFromApi: () => Promise<void>;
import { create } from 'zustand';
import { WorkflowNode, WorkflowEdge, Workflow, Agent, WorkflowNodeUnion, ResultNode } from '../types/agent';
export type { Workflow } from '../types/agent';
import { apiService } from '../services/apiService';
import { useAuth } from '@/contexts/AuthContext';

interface WorkflowUpdateData {
  name?: string;
  description?: string;
}

interface WorkflowStore {
  initWorkflowsFromApi: () => Promise<void>;
  searchTerm: string;
  // Current workflow state - using union type for nodes
  nodes: WorkflowNodeUnion[];
  edges: WorkflowEdge[];
  selectedNode: WorkflowNode | null;
  globalContext: Record<string, any>;
  
  // Favorites
  favoriteAgents: string[];
  
  // Workflow management
  workflows: Workflow[];
  currentWorkflow: Workflow | null;
  
  // UI state
  isExecuting: boolean;
  executionProgress: Record<string, 'idle' | 'processing' | 'completed' | 'error'>;
  finalOutput: Record<string, any> | null;
  
  // Actions
  setNodes: (nodes: WorkflowNodeUnion[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  addNode: (agent: Agent, position: { x: number; y: number }) => void;
  removeNode: (nodeId: string) => void;
  deleteNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNode['data']>) => void;
  selectNode: (node: WorkflowNode | null) => void;
  initializeMainAgent: (agents: Agent[]) => void;
  
  // Favorites
  toggleFavorite: (agentId: string) => void;
  
  // Workflow management
  createWorkflow: (name: string, description: string) => void;
  saveWorkflow: () => void;
  loadWorkflow: (workflowId: string) => void;
  deleteWorkflow: (workflowId: string) => void;
  updateWorkflow: (workflowId: string, data: WorkflowUpdateData) => void;
  
  // Execution
  executeWorkflow: (userId: string) => Promise<void>;
  executeNode: (nodeId: string, userId: string) => Promise<Record<string, any>>;
  resetExecution: () => void;
  setSearchTerm: (term: string) => void;
  
  // CRUD via API
  fetchWorkflowsFromApi: (userId: string) => Promise<any[]>;
  createWorkflowApi: (userId: string, name: string, description: string, nodes: any[], edges: any[], variables?: any, globalContext?: any) => Promise<any>;
  updateWorkflowApi: (id: string, data: any) => Promise<any>;
  deleteWorkflowApi: (id: string) => Promise<boolean>;
}

// Atualizar workflows para usar API em vez de localStorage
const loadWorkflowsFromStorage = async (): Promise<Workflow[]> => {
  const userId = localStorage.getItem('auth-user-id'); // Exemplo de como obter userId
  if (!userId) {
    console.error('User ID não encontrado para carregar workflows.');
    return [];
  }

  try {
    const workflows = await apiService.get(`/api/workflows?user_id=${userId}`);
    return workflows.data || [];
  } catch (err) {
    console.error('Erro ao carregar workflows da API:', err);
    return [];
  }
};

const saveWorkflowsToStorage = async (workflows: Workflow[]) => {
  const userId = localStorage.getItem('auth-user-id'); // Exemplo de como obter userId
  if (!userId) {
    console.error('User ID não encontrado para salvar workflows.');
    return;
  }

  try {
    await Promise.all(
      workflows.map((workflow) =>
        apiService.post('/api/workflows', {
          user_id: userId,
          ...workflow,
        })
      )
    );
  } catch (err) {
    console.error('Erro ao salvar workflows na API:', err);
  }
};

// Load favorites from localStorage
const loadFavoritesFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  
  const saved = localStorage.getItem('agent-favorites');
  if (!saved) return [];
  
  try {
    return JSON.parse(saved);
  } catch (err) {
    console.error('Erro ao carregar favoritos:', err);
    return [];
  }
};

// Save favorites to localStorage
const saveFavoritesToStorage = (favorites: string[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('agent-favorites', JSON.stringify(favorites));
  } catch (err) {
    console.error('Erro ao salvar favoritos:', err);
  }
};

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  // CRUD via API
  fetchWorkflowsFromApi: async (userId: string) => {
    if (!userId) return [];
    const response = await apiService.get(`/api/workflows?user_id=${userId}`);
    if (response && response.data) {
      set({ workflows: response.data });
      return response.data;
    }
    return [];
  },

  createWorkflowApi: async (userId: string, name: string, description: string, nodes: any[], edges: any[], variables?: any, globalContext?: any) => {
    if (!userId) return null;
    const response = await apiService.post('/api/workflows', {
      user_id: userId,
      name,
      description,
      nodes: Array.isArray(nodes) ? nodes : [],
      edges: Array.isArray(edges) ? edges : [],
      variables: variables || {},
      global_context: globalContext || {}
    });
    if (response && response.data) {
      set((state) => ({ workflows: [response.data, ...state.workflows] }));
      return response.data;
    }
    return null;
  },

  updateWorkflowApi: async (id: string, data: any) => {
    console.log('🌐 [API] updateWorkflowApi chamado com:', { id, data: { ...data, nodes: data.nodes?.length + ' nodes', edges: data.edges?.length + ' edges' } });
    
    // Busca workflow atual para garantir envio dos campos obrigatórios
    const state = get();
    const current = state.workflows.find(w => w.id === id);
    if (!current) {
      console.error('❌ [API] Workflow atual não encontrado para ID:', id);
      return null;
    }
    
    const payload = {
      ...current,
      ...data,
      nodes: data.nodes || current.nodes || [],
      edges: data.edges || current.edges || [],
      variables: current.variables || {},
      global_context: data.globalContext || current.globalContext || {},
    };
    
    console.log('📡 [API] Enviando payload:', {
      id,
      nodesCount: payload.nodes.length,
      edgesCount: payload.edges.length,
      edges: payload.edges
    });
    
    const response = await apiService.put(`/api/workflows/${id}`, payload);
    if (response && response.data) {
      set((state) => ({
        workflows: state.workflows.map(w => w.id === id ? response.data : w)
      }));
      return response.data;
    }
    return null;
  },

  deleteWorkflowApi: async (id: string) => {
    const response = await apiService.delete(`/api/workflows/${id}`);
    if (response && response.data && response.data.success) {
      set((state) => ({
        workflows: state.workflows.filter(w => w.id !== id)
      }));
      return true;
    }
    return false;
  },
  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),
  // Initial state
  nodes: [],
  edges: [],
  selectedNode: null,
  globalContext: {},
  favoriteAgents: loadFavoritesFromStorage(),
  workflows: [],
  currentWorkflow: null,
  isExecuting: false,
  executionProgress: {},
  finalOutput: null,

  // Actions
  setNodes: (nodes) => set({ nodes }),
  
  setEdges: (edges) => set({ edges }),
  
  toggleFavorite: (agentId) => {
    const { favoriteAgents } = get();
    const newFavorites = favoriteAgents.includes(agentId)
      ? favoriteAgents.filter(id => id !== agentId)
      : [...favoriteAgents, agentId];
    
    set({ favoriteAgents: newFavorites });
    saveFavoritesToStorage(newFavorites);
  },
  
  addNode: (agent, position) => {
    console.log('Adding node:', agent.name, 'at position:', position);
    
    const newNodeId = `${agent.type}-${Date.now()}`;
    const newNode: WorkflowNode = {
      id: newNodeId,
      type: 'agent',
      position,
      data: {
        agent,
        status: 'idle',
        inputs: {},
        outputs: {},
        isMainAgent: false
      }
    };
    
    console.log('Creating new node:', newNode);
    console.log('Node will NOT be connected automatically - user can choose where to connect');
    
    set((state) => ({
      nodes: [...state.nodes, newNode]
      // edges permanecem inalteradas - sem conexão automática
    }));
    
    // Save workflow after adding node
    setTimeout(() => get().saveWorkflow(), 100);
  },
  
  initializeMainAgent: (agents: Agent[]) => {
    const mainAgent = agents.find(agent => agent.category === 'setup');
    if (!mainAgent) return;

    const mainNode: WorkflowNode = {
      id: 'main-agent',
      type: 'agent',
      position: { x: 250, y: 100 },
      data: {
        agent: mainAgent,
        status: 'idle',
        inputs: {},
        outputs: {},
        isMainAgent: true
      }
    };

    console.log('Initializing main agent:', mainNode);
    set({ nodes: [mainNode], edges: [], finalOutput: null });
  },
  
  removeNode: (nodeId) => {
    const { nodes } = get();
    const nodeToRemove = nodes.find(n => n.id === nodeId);
    
    // Prevent removal of main agent
    if (nodeToRemove?.type === 'agent' && (nodeToRemove as WorkflowNode).data.isMainAgent) {
      console.warn('Cannot remove main agent');
      return;
    }

    set((state) => ({
      nodes: state.nodes.filter(node => node.id !== nodeId),
      edges: state.edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId),
      selectedNode: state.selectedNode?.id === nodeId ? null : state.selectedNode
    }));
  },

  deleteNode: (nodeId) => {
    // Use the same logic as removeNode
    get().removeNode(nodeId);
  },

  duplicateNode: (nodeId) => {
    const { nodes } = get();
    const nodeToDuplicate = nodes.find(n => n.id === nodeId && n.type === 'agent') as WorkflowNode;
    
    if (!nodeToDuplicate || nodeToDuplicate.data.isMainAgent) {
      console.warn('Cannot duplicate main agent or node not found');
      return;
    }

    // Create new position slightly offset from original
    const newPosition = {
      x: nodeToDuplicate.position.x + 50,
      y: nodeToDuplicate.position.y + 50
    };

    // Use existing addNode method to add the duplicate
    get().addNode(nodeToDuplicate.data.agent, newPosition);
  },
  
  updateNodeData: (nodeId, data) => {
    set((state) => {
      const updatedNodes = state.nodes.map(node => {
        if (node.id === nodeId && node.type === 'agent') {
          const workflowNode = node as WorkflowNode;
          return {
            ...workflowNode,
            data: { ...workflowNode.data, ...data }
          };
        }
        return node;
      });

      // If updating main agent outputs, update global context
      const updatedNode = updatedNodes.find(n => n.id === nodeId && n.type === 'agent') as WorkflowNode;
      let newGlobalContext = { ...state.globalContext };
      
      if (updatedNode?.data.isMainAgent && data.outputs) {
        newGlobalContext = { ...newGlobalContext, ...data.outputs.contexto_global };
      }

      // Atualizar o contexto global com os outputs do agente
      if (data.outputs) {
        newGlobalContext.agentResults = {
          ...newGlobalContext.agentResults,
          [nodeId]: data.outputs
        };
      }

      return {
        nodes: updatedNodes,
        globalContext: newGlobalContext
      };
    });
  },
  
  selectNode: (node) => set({ selectedNode: node }),
  
  createWorkflow: async (name, description) => {
    // Tenta obter userId do localStorage (persistido pelo login)
    let userId = undefined;
    try {
      const authData = localStorage.getItem('auth-user');
      if (authData) {
        const userObj = JSON.parse(authData);
        userId = userObj?.id;
      }
    } catch (err) {
      console.error('[workflowStore] Erro ao ler auth-user do localStorage:', err);
      alert('Erro ao acessar dados de autenticação. Faça login novamente.');
      return;
    }
    if (!userId) {
      console.error('[workflowStore] Nenhum usuário logado. Não é possível criar workflow.');
      alert('Você precisa estar logado para criar um workflow.');
      return;
    }
    try {
      console.log('[workflowStore] Criando workflow:', { userId, name, description });
  const created = await get().createWorkflowApi(userId, name, description, [], [], {}, {});
      console.log('[workflowStore] Resultado da criação:', created);
      if (created) {
        set({
          currentWorkflow: created,
          nodes: [],
          edges: [],
          globalContext: {},
          finalOutput: null
        });
        // Buscar workflows do banco após criar
        const updatedList = await get().fetchWorkflowsFromApi(userId);
        console.log('[workflowStore] Lista de workflows após criação:', updatedList);
      if (!Array.isArray(updatedList)) {
        console.error('[workflowStore] fetchWorkflowsFromApi retornou valor não-array:', updatedList);
        set({ workflows: [] });
      } else {
        set({ workflows: updatedList });
      }
      } else {
        console.warn('[workflowStore] Falha ao criar workflow.');
        alert('Erro ao criar workflow. Tente novamente.');
      }
    } catch (err) {
      console.error('[workflowStore] Erro inesperado ao criar workflow:', err);
      alert('Erro inesperado ao criar workflow. Veja o console para detalhes.');
    }
  },
  // Buscar workflows do banco ao inicializar
  initWorkflowsFromApi: async () => {
    let userId = undefined;
    try {
      const authData = localStorage.getItem('auth-user');
      if (authData) {
        const userObj = JSON.parse(authData);
        userId = userObj?.id;
      }
    } catch {}
    if (userId) {
      const list = await get().fetchWorkflowsFromApi(userId);
      set({ workflows: list });
    }
  },
  
  saveWorkflow: async () => {
    const { currentWorkflow, nodes, edges, globalContext, updateWorkflowApi, workflows } = get();
    
    console.log('🔄 [SaveWorkflow] Iniciando salvamento:', {
      currentWorkflowId: currentWorkflow?.id,
      nodesCount: nodes.length,
      edgesCount: edges.length,
      edges: edges
    });
    
    // Recupera variáveis do workflow atual ou do estado
    let variables = {};
    if (currentWorkflow && currentWorkflow.variables) {
      variables = currentWorkflow.variables;
    } else {
      // Tenta buscar do workflow na lista
      const wf = workflows.find(w => w.id === currentWorkflow?.id);
      if (wf && wf.variables) variables = wf.variables;
    }
    if (!currentWorkflow) {
      console.error('❌ [SaveWorkflow] Nenhum workflow atual encontrado');
      return;
    }
    const updatedWorkflow = {
      ...currentWorkflow,
      nodes,
      edges,
      variables,
      globalContext,
      updatedAt: new Date()
    };
    
    console.log('📤 [SaveWorkflow] Enviando para API:', {
      workflowId: currentWorkflow.id,
      updatedWorkflow: {
        ...updatedWorkflow,
        nodes: updatedWorkflow.nodes.length + ' nodes',
        edges: updatedWorkflow.edges.length + ' edges'
      }
    });
    
    // Persiste no banco
    await updateWorkflowApi(currentWorkflow.id, updatedWorkflow);
    set((state) => {
      const newState = {
        workflows: state.workflows.map(w =>
          w.id === currentWorkflow.id ? updatedWorkflow : w
        ),
        currentWorkflow: updatedWorkflow
      };
      // Salvar no localStorage
      saveWorkflowsToStorage(newState.workflows);
      return newState;
    });
  },
  
  loadWorkflow: (workflowId) => {
    const { workflows } = get();
    const workflow = workflows.find(w => w.id === workflowId);
    
    if (workflow) {
      set({
        currentWorkflow: workflow,
        nodes: workflow.nodes || [],
        edges: workflow.edges || [],
        globalContext: workflow.globalContext || {},
        finalOutput: null,
        executionProgress: {}
      });
    }
  },
  
  deleteWorkflow: async (workflowId) => {
    const deleted = await get().deleteWorkflowApi(workflowId);
    if (deleted) {
      set((state) => {
        const newState = {
          workflows: state.workflows.filter(w => w.id !== workflowId),
          currentWorkflow: state.currentWorkflow?.id === workflowId ? null : state.currentWorkflow,
          nodes: state.currentWorkflow?.id === workflowId ? [] : state.nodes,
          edges: state.currentWorkflow?.id === workflowId ? [] : state.edges,
          globalContext: state.currentWorkflow?.id === workflowId ? {} : state.globalContext
        };
        // Salvar no localStorage
        saveWorkflowsToStorage(newState.workflows);
        return newState;
      });
    }
  },
  
  updateWorkflow: async (workflowId, data) => {
    // Atualiza no backend
    const updated = await get().updateWorkflowApi(workflowId, data);
    if (updated) {
      set((state) => {
        const updatedWorkflows = state.workflows.map(w => w.id === workflowId ? updated : w);
        // Salvar no localStorage
        saveWorkflowsToStorage(updatedWorkflows);
        return {
          workflows: updatedWorkflows,
          currentWorkflow: state.currentWorkflow?.id === workflowId ? updated : state.currentWorkflow
        };
      });
    }
  },
  
  resetExecution: () => {
    set((state) => ({
      nodes: state.nodes.map(node => {
        if (node.type === 'agent') {
          const workflowNode = node as WorkflowNode;
          return {
            ...workflowNode,
            data: { ...workflowNode.data, status: 'idle' as const, outputs: {} }
          };
        }
        return node;
      }).filter(node => node.type !== 'result'), // Removes result nodes
      finalOutput: null,
      executionProgress: {}
    }));
  },
  
  executeWorkflow: async (userId: string) => {
    console.log('[workflowStore] userId recebido em executeWorkflow:', userId);
    const { nodes, edges } = get();

    console.log('🚀 Iniciando execução sequencial do workflow');
    
    // Reset previous execution
    get().resetExecution();

    set({ isExecuting: true, finalOutput: null });

    // Remove any existing result node
    const nonResultNodes = nodes.filter(n => n.type !== 'result') as WorkflowNode[];
    set({ nodes: nonResultNodes });

    try {
      // Step 1: Execute main agent first
      const mainAgent = nonResultNodes.find(n => n.data.isMainAgent);
      if (!mainAgent) {
        throw new Error('Agente principal não encontrado');
      }

      console.log('📋 Executando agente principal:', mainAgent.data.agent.name);
      await get().executeNode(mainAgent.id, userId);

      // Step 2: Build execution order for connected agents only
      const connectedNodes = getConnectedAgents(nonResultNodes, edges, mainAgent.id);
      const executionOrder = buildExecutionOrder(connectedNodes, edges);

      console.log('📊 Ordem de execução:', executionOrder.map(id => {
        const node = get().nodes.find(n => n.id === id && n.type === 'agent') as WorkflowNode;
        return node?.data.agent.name;
      }));

      // Step 3: Execute agents sequentially, passing context
      let accumulatedContext = get().globalContext;

      for (const nodeId of executionOrder) {
        const currentNode = get().nodes.find(n => n.id === nodeId && n.type === 'agent') as WorkflowNode;
        if (!currentNode) continue;

        console.log(`⚡ Executando: ${currentNode.data.agent.name}`);

        // Update node with accumulated context
        get().updateNodeData(nodeId, { inputs: { ...currentNode.data.inputs, ...accumulatedContext } });

        // Execute the node (garante busca da chave de API para cada nó)
        await get().executeNode(nodeId, userId);

        // Get updated node with outputs
        const updatedNode = get().nodes.find(n => n.id === nodeId && n.type === 'agent') as WorkflowNode;
        if (updatedNode?.data.outputs) {
          accumulatedContext = { ...accumulatedContext, ...updatedNode.data.outputs };
        }
      }

      // Step 4: Create result node with final output
      if (executionOrder.length > 0) {
        const lastNodeId = executionOrder[executionOrder.length - 1];
        const lastNode = get().nodes.find(n => n.id === lastNodeId && n.type === 'agent') as WorkflowNode;

        if (lastNode?.data.outputs) {
          console.log('🎯 Criando node de resultado:', lastNode.data.outputs);

          // Find position for result node (to the right of the last executed node)
          const resultPosition = {
            x: lastNode.position.x + 350,
            y: lastNode.position.y
          };

          // Create result node with proper typing
          const resultNode: ResultNode = {
            id: 'result-node',
            type: 'result',
            position: resultPosition,
            data: {
              result: {
                ...lastNode.data.outputs,
                model_used: 'gpt-4.1-2025-04-14',
                timestamp: new Date().toISOString()
              },
              status: 'completed'
            }
          };

          // Create edge to result node
          const resultEdge: WorkflowEdge = {
            id: `edge-${lastNodeId}-result`,
            source: lastNodeId,
            target: 'result-node',
            type: 'smoothstep',
            animated: true,
            style: { stroke: '#10b981', strokeWidth: 3 }
          };

          // Add result node and edge
          set(state => ({
            nodes: [...state.nodes, resultNode],
            edges: [...state.edges, resultEdge],
            finalOutput: {
              ...lastNode.data.outputs,
              model_used: 'gpt-4.1-2025-04-14',
              timestamp: new Date().toISOString()
            }
          }));
        }
      }

    } catch (error) {
      console.error('❌ Erro na execução do workflow:', error);
    } finally {
      set({ isExecuting: false });
    }
  },
  
  executeNode: async (nodeId, userId) => {
    const { nodes, edges, globalContext } = get();
    const node = nodes.find(n => n.id === nodeId && n.type === 'agent') as WorkflowNode;
    
    if (!node) return {};
    
    // Carrega configurações do banco de dados via REST API
    let config = { apiKey: '', model: 'gpt-4.1-2025-04-14' };
    if (userId) {
      const response = await apiService.get(`/api/configuration?provider=openai&user_id=${userId}`);
      console.log('[workflowStore] response recebido da configuração:', response);
      if (response && response.data) {
        console.log('[workflowStore] response.data recebido da configuração:', response.data);
        config.apiKey = response.data.api_key;
      } else {
        console.warn('[workflowStore] Nenhuma configuração encontrada para user_id:', userId);
      }
    }
    console.log('[workflowStore] config.apiKey antes da validação:', config.apiKey);
    // Pular validação da chave de API para o agente productAgent
    if (node.data.agent.type === 'productAgent') {
      console.log('Agente productAgent detectado. Pulando validação da chave de API.');
    } else {
      if (!config.apiKey) {
        console.warn('Chave de API não configurada');
        throw new Error('Chave de API não configurada. Configure sua chave nas configurações.');
      }
    }
    
    // Atualiza status do nó para processando
    get().updateNodeData(nodeId, { status: 'processing' });
    
    try {
      // Coleta inputs de nós conectados e contexto global
      const inputs: Record<string, any> = { ...node.data.inputs };
      
      // Adiciona o contexto global ao inputs
      if (globalContext && Object.keys(globalContext).length > 0) {
        Object.assign(inputs, globalContext);
      }
      
      // Para agentes não principais, coleta outputs dos nós de origem
      if (!node.data.isMainAgent) {
        const sourceNodes = edges
          .filter(e => e.target === nodeId)
          .map(edge => nodes.find(n => n.id === edge.source && n.type === 'agent') as WorkflowNode)
          .filter(Boolean);
        
        // Processa os outputs dos nós de origem
        for (const sourceNode of sourceNodes) {
          if (sourceNode?.data.outputs) {
            // Processar os outputs de acordo com o tipo de agente
            const sourceAgentType = sourceNode.data.agent.type;
            
            // Caso especial para o agente principal (project-setup)
            if (sourceAgentType === 'project-setup') {
              // Se tiver contexto_global estruturado
              if (sourceNode.data.outputs.contexto_global && typeof sourceNode.data.outputs.contexto_global === 'object') {
                const contextoGlobal = sourceNode.data.outputs.contexto_global;
                // Adiciona cada campo do contexto global como input individual
                Object.keys(contextoGlobal).forEach(key => {
                  inputs[key] = contextoGlobal[key];
                });
              } 
              // Se o contexto_global for uma string (resposta em texto)
              else if (sourceNode.data.outputs.contexto_global) {
                // Usar os inputs originais do agente principal
                const mainAgentInputs = sourceNode.data.inputs || {};
                Object.keys(mainAgentInputs).forEach(key => {
                  inputs[key] = mainAgentInputs[key];
                });
                
                // Adicionar o conteúdo como uma propriedade separada
                inputs.contexto = sourceNode.data.outputs.contexto_global;
              }
              
              // Garantir que todos os campos necessários estejam presentes
              // Usar valores padrão dos inputs do agente atual se necessário
              node.data.agent.inputs?.forEach(inputDef => {
                if (inputDef.id && (inputs[inputDef.id] === undefined || inputs[inputDef.id] === null)) {
                  inputs[inputDef.id] = inputDef.defaultValue || '';
                }
              });
            } 
            // Para outros agentes, processar normalmente
            else {
              // Adicionar cada output como input individual
              Object.entries(sourceNode.data.outputs).forEach(([key, value]) => {
                inputs[key] = value;
              });
            }
          }
        }
      }
      
      // Processar variáveis no template se existir
      let processedTemplate = node.data.agent.template;
      
      // IMPORTANTE: Aqui precisamos processar primeiro os valores dos inputs que têm variáveis
      const processedInputs = { ...inputs };
      
      // Para cada input do agente, verificar se há variáveis para substituir
      if (node.data.inputs) {
        Object.entries(node.data.inputs).forEach(([inputKey, inputValue]) => {
          if (typeof inputValue === 'string' && inputValue.includes('{{')) {
            // Este input tem variáveis - vamos substituir pelos valores dos outputs anteriores
            let processedValue = inputValue;
            
            // Buscar outputs do agente anterior
            const sourceNodes = edges
              .filter(edge => edge.target === nodeId)
              .map(edge => nodes.find(n => n.id === edge.source))
              .filter(Boolean);
              
            sourceNodes.forEach(sourceNode => {
              if (sourceNode?.data.outputs) {
                console.log(`🔗 Processando outputs do agente anterior: ${sourceNode.data.agent.name}`);
                console.log(`📤 Outputs disponíveis:`, sourceNode.data.outputs);
                
                Object.entries(sourceNode.data.outputs).forEach(([outputKey, outputValue]) => {
                  const variablePattern = new RegExp(`\\{\\{${outputKey}\\}\\}`, 'g');
                  const valueStr = typeof outputValue === 'object' ? JSON.stringify(outputValue) : String(outputValue);
                  
                  if (processedValue.includes(`{{${outputKey}}}`)) {
                    console.log(`🔄 Substituindo variável {{${outputKey}}} por: ${valueStr}`);
                  }
                  
                  processedValue = processedValue.replace(variablePattern, valueStr);
                });
              }
              
              // IMPORTANTE: Também processar inputs do agente anterior se disponível
              if (sourceNode?.data.inputs) {
                Object.entries(sourceNode.data.inputs).forEach(([inputKey, inputValue]) => {
                  const variablePattern = new RegExp(`\\{\\{${inputKey}\\}\\}`, 'g');
                  const valueStr = typeof inputValue === 'object' ? JSON.stringify(inputValue) : String(inputValue);
                  
                  if (processedValue.includes(`{{${inputKey}}}`)) {
                    console.log(`🔄 Substituindo variável {{${inputKey}}} por: ${valueStr}`);
                  }
                  
                  processedValue = processedValue.replace(variablePattern, valueStr);
                });
              }
            });
            
            // Atualizar o valor processado
            processedInputs[inputKey] = processedValue;
          }
        });
      }
      
      if (processedTemplate && Object.keys(processedInputs).length > 0) {
        // Substituir variáveis no template usando os inputs processados
        Object.entries(processedInputs).forEach(([key, value]) => {
          // Substituir tanto formato {{variable}} quanto {variable}
          const doubleVariablePattern = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
          const singleVariablePattern = new RegExp(`\\{${key}\\}`, 'g');
          const valueStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
          
          processedTemplate = processedTemplate?.replace(doubleVariablePattern, valueStr);
          processedTemplate = processedTemplate?.replace(singleVariablePattern, valueStr);
        });
        
        console.log(`📝 Template processado para ${node.data.agent.name}:`, processedTemplate);
        console.log(`📊 Inputs processados:`, processedInputs);
      }
      
      // Log detalhado dos inputs para debug
      console.log(`Inputs processados para ${node.data.agent.name}:`, JSON.stringify(inputs, null, 2));
      
      console.log(`🔄 Processando ${node.data.agent.name} com inputs:`, inputs);
      console.log(`🤖 Usando modelo: ${config.model}`);
      
      // Configuração do agente
      const agentConfig = {
        ...node.data.agent.config,
        ...node.data.config,
        model: config.model as 'gpt-4o-mini' | 'gpt-image-1' | 'gpt-4.1-mini',
        apiKey: config.apiKey
      };
      console.log('[workflowStore] apiKey usada para execução:', agentConfig.apiKey);
      
      // Executa o agente com a API real, passando o template processado
      const agentWithProcessedTemplate = {
        ...node.data.agent,
        template: processedTemplate || node.data.agent.template
      };

      // Executa o agente com a API real, passando o template processado
      const result = await apiService.executeAgent(
        agentWithProcessedTemplate,
        inputs,
        { ...globalContext, user: { id: userId } },
        agentConfig
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Erro desconhecido na execução do agente');
      }
      
      // Adiciona metadados à resposta
      const output = {
        ...result.outputs,
        _metadata: {
          model: config.model,
          timestamp: new Date().toISOString(),
          agent_type: node.data.agent.type,
          usage: result.usage
        }
      };
      
      console.log(`✅ ${node.data.agent.name} concluído. Output:`, output);
      
      // Atualiza o output do nó
      const outputs = result.outputs;
      const startTime = Date.now() - 1000; // Tempo aproximado para cálculo da duração
      
      // Caso especial para o agente principal (project-setup)
      if (node.data.agent.type === 'project-setup') {
        // Garantir que os dados do formulário sejam preservados no output
        if (outputs && outputs.contexto_global) {
          // Garantir que tom_voz e cores_marca sejam incluídos no output
          if (!outputs.contexto_global.tom_voz && inputs.tom_voz) {
            outputs.contexto_global.tom_voz = inputs.tom_voz;
          }
          
          if (!outputs.contexto_global.cores_marca && inputs.cores_marca) {
            outputs.contexto_global.cores_marca = inputs.cores_marca;
          }
          
          // Garantir que todos os campos do input estejam no output
          Object.keys(inputs).forEach(key => {
            if (inputs[key] && !outputs.contexto_global[key]) {
              outputs.contexto_global[key] = inputs[key];
            }
          });
          
          console.log('Outputs do agente principal após processamento:', outputs);
        }
      }
      
      // Atualiza o output do nó
      get().updateNodeData(nodeId, {
        status: 'completed',
        outputs: outputs
      });
      
      // Registra o tempo de execução e uso em log
      console.log(`Tempo de execução: ${Date.now() - startTime}ms`);
      console.log(`Uso de tokens: ${result.usage?.tokens || 0}`);
      
      console.log(`🔄 Retornando output do nó ${nodeId} (${node.data.agent.name}):`, output);
      
      return output;
    } catch (error) {
      console.error(`❌ Erro ao executar ${node.data.agent.name}:`, error);
      get().updateNodeData(nodeId, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      });
      throw error;
    }
  }
}));

// Helper function to build execution order using topological sort
function buildExecutionOrder(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const inDegree = new Map(nodes.map(n => [n.id, 0]));
  
  // Calculate in-degrees
  edges.forEach(edge => {
    if (nodeMap.has(edge.target)) {
      const currentDegree = inDegree.get(edge.target) || 0;
      inDegree.set(edge.target, currentDegree + 1);
    }
  });
  
  // Start with nodes that have no dependencies
  const queue = nodes.filter(n => (inDegree.get(n.id) || 0) === 0);
  const executionOrder: string[] = [];
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    executionOrder.push(current.id);
    
    // Update in-degrees for dependent nodes
    edges
      .filter(e => e.source === current.id)
      .forEach(edge => {
        if (nodeMap.has(edge.target)) {
          const targetDegree = inDegree.get(edge.target)! - 1;
          inDegree.set(edge.target, targetDegree);
          
          if (targetDegree === 0) {
            const targetNode = nodeMap.get(edge.target)!;
            queue.push(targetNode);
          }
        }
      });
  }
  
  return executionOrder;
}

// Helper function to get only connected agents
function getConnectedAgents(nodes: WorkflowNode[], edges: WorkflowEdge[], startNodeId: string): WorkflowNode[] {
  const visited = new Set<string>();
  const connectedNodes: WorkflowNode[] = [];
  
  function traverse(nodeId: string) {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    
    const node = nodes.find(n => n.id === nodeId);
    if (node && !node.data.isMainAgent) {
      connectedNodes.push(node);
    }
    
    // Find connected nodes
    edges
      .filter(e => e.source === nodeId)
      .forEach(edge => traverse(edge.target));
  }
  
  // Start traversal from main agent
  traverse(startNodeId);
  
  return connectedNodes;
}

// Esta função foi removida pois agora estamos usando a API real

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const savedWorkflows = localStorage.getItem('workflows');
  
  if (savedWorkflows) {
    try {
      const workflows = JSON.parse(savedWorkflows);
      useWorkflowStore.setState({ workflows });
    } catch (error) {
      console.error('Error loading workflows from localStorage:', error);
    }
  }
}
