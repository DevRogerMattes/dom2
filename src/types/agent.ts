export interface AgentInput {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'file' | 'image' | 'array';
  required: boolean;
  description: string;
  placeholder?: string;
  defaultValue?: any;
}

export interface AgentOutput {
  id: string;
  name: string;
  type: 'text' | 'html' | 'markdown' | 'json' | 'image' | 'file';
  description: string;
}

export interface AgentConfig {
  tone: 'professional';
  audience?: string;
  keywords?: string[];
  language?: string;
  customPrompt?: string;
  model?: 'gpt-4' | 'gpt-image-1' | 'gpt-4o' | 'gpt-4o-mini' | 'gpt-4.1-mini';
  maxTokens?: number;
  temperature?: number;
  apiKey?: string;
}

export interface Agent {
  id: string;
  type: string;
  name: string;
  description: string;
  category: 'setup' | 'copywriting' | 'infoproduct' | 'seo' | 'document' | 'sales';
  icon: string;
  inputs: AgentInput[];
  outputs: AgentOutput[];
  config: AgentConfig;
  user_id?: string; // Adicionado para permitir filtro por usuário
  isActive: boolean;
  template?: string; // Adicionado para permitir template customizado
  isFavorite?: boolean;
  global_visibility?: string; // 'U' = universal/global, undefined/null = normal
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    agent: Agent;
    config?: Partial<AgentConfig>;
    inputs?: Record<string, any>;
    outputs?: Record<string, any>;
    status?: 'idle' | 'processing' | 'completed' | 'error';
    error?: string;
    isMainAgent?: boolean;
  };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  sourceHandle?: string;
  targetHandle?: string;
  animated: boolean;
  style?: {
    stroke: string;
    strokeWidth: number;
  };
}

export interface ResultNodeData {
  result: Record<string, any>;
  status: 'idle' | 'processing' | 'completed';
  [key: string]: any; // Index signature for ReactFlow compatibility
}

export interface ResultNode {
  id: string;
  type: 'result';
  position: { x: number; y: number };
  data: ResultNodeData;
}

export type WorkflowNodeUnion = WorkflowNode | ResultNode;

export interface Workflow {
  id: string;
  name: string;
  description: string;
  nodes: WorkflowNodeUnion[];
  edges: WorkflowEdge[];
  variables?: Record<string, any>;
  globalContext?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  user_id?: string; // Adicionado para permitir filtro por usuário
}

export interface ExecutionContext {
  workflowId: string;
  nodeId: string;
  inputs: Record<string, any>;
  variables: Record<string, any>;
  globalContext?: Record<string, any>;
  apiKey?: string;
}

export interface ExecutionResult {
  success: boolean;
  outputs?: Record<string, any>;
  error?: string;
  data?: any;
  usage?: {
    tokens?: number;
    cost?: number;
  };
}
