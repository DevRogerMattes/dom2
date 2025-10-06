import React, { useState } from 'react';
import { X, Play, Save, Settings, FileText, Image, Hash, ToggleLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useWorkflowStore } from '../stores/workflowStore';
import { AgentInput, AgentOutput, WorkflowNode } from '../types/agent';
import { useAuth } from '@/contexts/AuthContext';

export const PropertyPanel: React.FC = () => {
  const { selectedNode, updateNodeData, executeNode, selectNode, nodes, edges } = useWorkflowStore();
  const { user } = useAuth();
  const [localInputs, setLocalInputs] = useState<Record<string, any>>({});
  const [showVariables, setShowVariables] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    if (selectedNode?.data.inputs) {
      setLocalInputs(selectedNode.data.inputs);
    }
  }, [selectedNode]);

  // Função para obter variáveis disponíveis do agente anterior
  const getAvailableVariables = () => {
    if (!selectedNode) return {};
    
    // Encontrar a edge que conecta ao nó atual
    const incomingEdge = edges.find(edge => edge.target === selectedNode.id);
    if (!incomingEdge) return {};
    
    // Encontrar o nó de origem
    const sourceNode = nodes.find(node => node.id === incomingEdge.source && node.type === 'agent') as WorkflowNode;
    if (!sourceNode) return {};
    
    console.log('🔍 Buscando variáveis do nó:', sourceNode.data.agent.name);
    console.log('📊 Outputs disponíveis:', sourceNode.data.outputs);
    console.log('📥 Inputs disponíveis:', sourceNode.data.inputs);
    
    // Retornar os outputs e inputs do nó anterior como variáveis disponíveis
    const variables: Record<string, any> = {};
    
    // SEMPRE adicionar outputs do agente anterior baseado na definição (mesmo antes da execução)
    if (sourceNode.data.agent.outputs) {
      sourceNode.data.agent.outputs.forEach(output => {
        // Se já foi executado, usar valor real; senão usar placeholder
        const realValue = sourceNode.data.outputs?.[output.id];
        variables[output.id] = realValue !== undefined ? realValue : `[${output.name}]`;
      });
    }
    
    // Adicionar outputs reais se existirem (após execução)
    if (sourceNode.data.outputs) {
      Object.entries(sourceNode.data.outputs).forEach(([key, value]) => {
        variables[key] = value;
      });
    }
    
    // Adicionar inputs do agente anterior (importantes para antes da execução)
    if (sourceNode.data.inputs) {
      Object.entries(sourceNode.data.inputs).forEach(([key, value]) => {
        // Só adicionar se não for uma variável processada (que contém {{...}})
        if (typeof value !== 'string' || !value.includes('{{')) {
          variables[key] = value;
        }
      });
    }
    
    // Se for agente principal, também adicionar suas configurações/template
    if (sourceNode.data.isMainAgent && sourceNode.data.agent.config) {
      Object.entries(sourceNode.data.agent.config).forEach(([key, value]) => {
        variables[key] = value;
      });
    }
    
    console.log('✨ Variáveis finais disponíveis:', variables);
    return variables;
  };

  const availableVariables = getAvailableVariables();

  const insertVariable = (inputId: string, variableName: string, variableValue: any) => {
    const currentValue = localInputs[inputId] || '';
    const newValue = typeof currentValue === 'string' 
      ? `${currentValue}{{${variableName}}}`
      : variableValue;
    
    handleInputChange(inputId, newValue);
  };

  if (!selectedNode) {
    return (
      <div className="w-80 h-full bg-card border-l border-border flex flex-col items-center justify-center text-muted-foreground">
        <Settings className="w-12 h-12 mb-4 opacity-30" />
        <p className="text-sm text-center">
          Selecione um agente no canvas para configurar suas propriedades
        </p>
      </div>
    );
  }

  const { agent, status, outputs, error } = selectedNode.data;

  const handleInputChange = (inputId: string, value: any) => {
    const newInputs = { ...localInputs, [inputId]: value };
    setLocalInputs(newInputs);
    updateNodeData(selectedNode.id, { inputs: newInputs });
  };

  const handleExecute = () => {
  console.log('[PropertyPanel] user.id usado na execução:', user?.id);
  executeNode(selectedNode.id, user?.id);
  };

  const getInputIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <FileText className="w-4 h-4" />;
      case 'number':
        return <Hash className="w-4 h-4" />;
      case 'boolean':
        return <ToggleLeft className="w-4 h-4" />;
      case 'image':
        return <Image className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const renderInput = (input: AgentInput) => {
    const value = localInputs[input.id] || input.defaultValue || '';

    switch (input.type) {
      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(input.id, parseInt(e.target.value) || 0)}
            placeholder={input.placeholder}
          />
        );
      
      case 'boolean':
        return (
          <Select
            value={value.toString()}
            onValueChange={(val) => handleInputChange(input.id, val === 'true')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Sim</SelectItem>
              <SelectItem value="false">Não</SelectItem>
            </SelectContent>
          </Select>
        );
      
      case 'text':
      default:
        if (input.placeholder && input.placeholder.length > 50) {
          return (
            <Textarea
              value={value}
              onChange={(e) => handleInputChange(input.id, e.target.value)}
              placeholder={input.placeholder}
              rows={3}
            />
          );
        }
        return (
          <Input
            value={value}
            onChange={(e) => handleInputChange(input.id, e.target.value)}
            placeholder={input.placeholder}
          />
        );
    }
  };

  const renderOutput = (output: AgentOutput, value: any) => {
    console.log(`Renderizando output ${output.id} (${output.name}) com valor:`, value);
    
    if (value === undefined || value === null) {
      return (
        <div className="text-xs bg-muted p-2 rounded text-muted-foreground">
          Valor não disponível
        </div>
      );
    }

    switch (output.type) {
      case 'json':
        return (
          <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(value, null, 2)}
          </pre>
        );
      
      case 'html':
        return (
          <div className="text-xs bg-muted p-2 rounded max-h-32 overflow-auto">
            <div dangerouslySetInnerHTML={{ __html: value }} />
          </div>
        );
      
      case 'image':
        return (
          <div className="text-xs">
            <img src={value} alt="Generated" className="max-w-full h-32 object-cover rounded" />
          </div>
        );
      
      default:
        return (
          <div className="text-xs bg-muted p-2 rounded max-h-32 overflow-auto">
            {value.toString()}
          </div>
        );
    }
  };

  return (
    <div className="w-80 h-full bg-card border-l border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{agent.icon}</span>
            <h3 className="font-semibold text-sm">{agent.name}</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => selectNode(null)}
            className="h-7 w-7 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground mb-3">
          {agent.description}
        </p>

        {/* Status */}
        <div className="flex items-center justify-between">
          <Badge variant={
            status === 'completed' ? 'default' :
            status === 'processing' ? 'secondary' :
            status === 'error' ? 'destructive' : 'outline'
          }>
            {status === 'idle' ? 'Pronto' :
             status === 'processing' ? 'Processando...' :
             status === 'completed' ? 'Concluído' :
             'Erro'}
          </Badge>
          
          <Button
            size="sm"
            onClick={handleExecute}
            disabled={status === 'processing'}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Play className="w-4 h-4 mr-1" />
            Executar
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Inputs */}
          {agent.inputs.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Inputs ({agent.inputs.length})
              </h4>
              
              <div className="space-y-4">
                {agent.inputs.map((input) => (
                  <div key={input.id} className="space-y-2">
                    <Label className="text-xs font-medium flex items-center gap-2">
                      {getInputIcon(input.type)}
                      {input.name}
                      {input.required && <span className="text-red-500">*</span>}
                    </Label>
                    
                    {input.description && (
                      <p className="text-xs text-muted-foreground">
                        {input.description}
                      </p>
                    )}
                    
                    {renderInput(input)}
                    
                    {/* Variáveis disponíveis */}
                    {Object.keys(availableVariables).length > 0 && (
                      <div className="mt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowVariables(prev => ({ ...prev, [input.id]: !prev[input.id] }))}
                          className="text-xs h-6 p-1 text-blue-600 hover:bg-blue-50"
                        >
                          <span className="mr-1">🔗</span>
                          {showVariables[input.id] ? '🔽' : '▶️'} Usar Variáveis ({Object.keys(availableVariables).length})
                        </Button>
                        
                        {showVariables[input.id] && (
                          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md space-y-1 max-h-32 overflow-y-auto">
                            <div className="text-xs text-blue-700 mb-1 font-medium">
                              💡 Clique para inserir a variável no campo:
                            </div>
                            {Object.entries(availableVariables)
                              .filter(([key]) => !key.startsWith('_')) // Filtrar metadados
                              .map(([varName, varValue]) => {
                                const isPlaceholder = typeof varValue === 'string' && varValue.startsWith('[') && varValue.endsWith(']');
                                const displayValue = typeof varValue === 'object' 
                                  ? `${JSON.stringify(varValue).substring(0, 50)}...`
                                  : String(varValue).substring(0, 50) + (String(varValue).length > 50 ? '...' : '');
                                
                                return (
                                  <Button
                                    key={varName}
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => insertVariable(input.id, varName, varValue)}
                                    className={`text-xs h-auto p-2 w-full justify-start hover:bg-blue-100 border ${
                                      isPlaceholder ? 'border-orange-200 bg-orange-50' : 'border-blue-200'
                                    }`}
                                    title={`Valor: ${typeof varValue === 'object' ? JSON.stringify(varValue) : varValue}`}
                                  >
                                    <div className="flex flex-col items-start w-full">
                                      <div className="font-mono font-medium text-blue-700 flex items-center">
                                        <span className="text-blue-600">{'{'}</span>
                                        <span className="text-green-600">{varName}</span>
                                        <span className="text-blue-600">{'}'}</span>
                                        {isPlaceholder && (
                                          <span className="ml-2 text-xs text-orange-600 bg-orange-200 px-1 rounded">
                                            aguardando execução
                                          </span>
                                        )}
                                      </div>
                                      <div className={`text-xs mt-1 truncate w-full ${
                                        isPlaceholder ? 'text-orange-600' : 'text-gray-600'
                                      }`}>
                                        {displayValue}
                                      </div>
                                    </div>
                                  </Button>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Outputs */}
          {outputs && Object.keys(outputs).length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Outputs ({Object.keys(outputs).length})
                </h4>
                
                <div className="space-y-4">
                  {agent.outputs.map((output) => {
                    console.log(`Processando output ${output.id} (${output.name})`);
                    console.log(`Valor em outputs[${output.id}]:`, outputs[output.id]);
                    console.log(`Outputs completos:`, outputs);
                    
                    // Tentar diferentes possibilidades de mapeamento
                    let value = outputs[output.id] || outputs[output.name];
                    
                    // Para o agente de cadastro de produtos, tentar mapeamentos específicos
                    if (!value && agent.name === 'Agente de Cadastro de Produtos') {
                      if (output.id === 'Nome' || output.name.includes('Nome')) {
                        value = outputs.Nome || outputs.nome_produto || outputs.name;
                      } else if (output.id === 'Preco' || output.name.includes('Preço')) {
                        value = outputs.Preco || outputs.preco_produto || outputs.price;
                      } else if (output.id === 'ID' || output.name.includes('ID')) {
                        value = outputs.ID || outputs.id_produto || outputs.id;
                      }
                    }
                    
                    console.log(`Valor final para ${output.id}:`, value);
                    
                    return (
                      <div key={output.id} className="space-y-2">
                        <Label className="text-xs font-medium">
                          {output.name}
                        </Label>
                        
                        {output.description && (
                          <p className="text-xs text-muted-foreground">
                            {output.description}
                          </p>
                        )}
                        
                        {renderOutput(output, value)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* Error */}
          {error && (
            <>
              <Separator />
              <div>
                <h4 className="font-medium text-sm mb-2 text-red-600">Erro</h4>
                <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                  {error}
                </div>
              </div>
            </>
          )}

          {/* Configuration */}
          <Separator />
        </div>
      </ScrollArea>
    </div>
  );
};
