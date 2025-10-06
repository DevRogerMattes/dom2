import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Download, Share2, CheckCircle, XCircle } from 'lucide-react';
import { WorkflowNode } from '../types/agent';
import { useWorkflowStore } from '../stores/workflowStore';

interface ResultsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: {
    nodeId: string;
    outputs?: Record<string, any>;
    error?: string;
  }[];
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  results,
  open,
  onOpenChange,
}) => {
  const { nodes } = useWorkflowStore();
  const [copiedNodeId, setCopiedNodeId] = useState<string | null>(null);
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  const getNodeName = (nodeId: string): string => {
    const node = nodes.find(n => n.id === nodeId) as WorkflowNode;
    return node?.data.agent.name || nodeId;
  };

  // Função para formatar valores para texto
  const formatValueAsText = (value: any, indent: number = 0): string => {
    const indentStr = '  '.repeat(indent);
    
    if (value === null || value === undefined) {
      return 'Nenhum resultado disponível';
    }

    if (typeof value === 'string') {
      return value.trim();
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return 'Lista vazia';
      }
      return value
        .map((item, index) => `${indentStr}${index + 1}. ${formatValueAsText(item, 0)}`)
        .join('\n');
    }
    
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return 'Objeto vazio';
      }
      return entries
        .map(([key, val]) => {
          const formattedKey = key.replace(/_/g, ' ').toUpperCase();
          const formattedValue = formatValueAsText(val, indent + 1);
          return `${indentStr}${formattedKey}:\n${indentStr}  ${formattedValue}`;
        })
        .join('\n\n');
    }
    
    return String(value);
  };

  // Função para formatar resultado completo como texto
  const formatResultAsText = (result: { nodeId: string; outputs?: Record<string, any>; error?: string }) => {
    const nodeName = getNodeName(result.nodeId);
    const separator = '='.repeat(50);
    
    let content = `${separator}\n`;
    content += `AGENTE: ${nodeName.toUpperCase()}\n`;
    content += `${separator}\n\n`;

    if (result.error) {
      content += `❌ ERRO:\n${result.error}\n`;
    } else if (result.outputs && Object.keys(result.outputs).length > 0) {
      Object.entries(result.outputs)
        .filter(([key]) => {
          const lowerKey = key.toLowerCase();
          return lowerKey !== 'metadata' && 
                 lowerKey !== 'model' && 
                 lowerKey !== 'timestamp' &&
                 !lowerKey.includes('metadata');
        })
        .forEach(([key, value]) => {
          const formattedKey = key.replace(/_/g, ' ').toUpperCase();
          content += `📋 ${formattedKey}:\n`;
          content += `${formatValueAsText(value)}\n\n`;
        });
    } else {
      content += 'Nenhum resultado disponível\n';
    }

    content += `${separator}\n`;
    return content;
  };

  const handleCopy = async (result: { nodeId: string; outputs?: Record<string, any>; error?: string }) => {
    try {
      const content = formatResultAsText(result);
      await navigator.clipboard.writeText(content);
      setCopiedNodeId(result.nodeId);
      setTimeout(() => setCopiedNodeId(null), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const handleDownload = (result: { nodeId: string; outputs?: Record<string, any>; error?: string }) => {
    const content = formatResultAsText(result);
    const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resultado-${getNodeName(result.nodeId).toLowerCase().replace(/\s+/g, '-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async (result: { nodeId: string; outputs?: Record<string, any>; error?: string }) => {
    try {
      const content = formatResultAsText(result);
      await navigator.share({
        title: `Resultado do Agente ${getNodeName(result.nodeId)}`,
        text: content,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      // Fallback para copiar para área de transferência
      handleCopy(result);
    }
  };

  const renderValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) {
      return <div className="text-muted-foreground italic p-3 bg-muted rounded border">Nenhum resultado disponível</div>;
    }

    if (typeof value === 'string') {
      if (value.trim() === '') {
        return <div className="text-muted-foreground italic p-3 bg-muted rounded border">Texto vazio</div>;
      }
      
      if (value.startsWith('<!DOCTYPE html>') || value.includes('<html')) {
        return (
          <div className="bg-secondary text-secondary-foreground p-4 rounded-md overflow-x-auto max-h-96 border">
            <pre className="text-sm font-mono whitespace-pre-wrap">{value}</pre>
          </div>
        );
      }
      return <div className="text-sm whitespace-pre-wrap p-3 bg-muted rounded border max-h-96 overflow-y-auto">{value}</div>;
    }
    
    if (Array.isArray(value)) {
      if (value.length === 0) {
        return <div className="text-muted-foreground italic p-3 bg-muted rounded border">Lista vazia</div>;
      }
      
      return (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {value.map((item, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-sm font-medium text-muted-foreground mt-1 min-w-[20px]">{index + 1}.</span>
              <div className="flex-1 text-sm bg-muted p-2 rounded border">
                {typeof item === 'string' ? item : JSON.stringify(item, null, 2)}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return <div className="text-muted-foreground italic p-3 bg-muted rounded border">Objeto vazio</div>;
      }
      
      return (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {entries.map(([key, val]) => (
            <div key={key} className="border-l-4 border-orange-500 pl-4">
              <div className="text-sm font-medium text-foreground mb-2">
                {key.replace(/_/g, ' ').toUpperCase()}:
              </div>
              <div className="ml-2">
                {renderValue(val)}
              </div>
            </div>
          ))}
        </div>
      );
    }
    
    return <div className="text-sm p-3 bg-muted rounded border">{String(value)}</div>;
  };

  console.log('ResultsModal - recebendo props:', { results, open });
  console.log('ResultsModal - estado global (nodes):', nodes);
  console.log('ResultsModal - results:', results);
  
  if (!results || results.length === 0) {
    return null;
  }
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Resultados do Workflow</DialogTitle>
          <DialogDescription>
            {results.length} {results.length === 1 ? 'agente processado' : 'agentes processados'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={results[0]?.nodeId} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full justify-start overflow-x-auto flex-shrink-0">
            {results.map((result) => (
              <TabsTrigger
                key={result.nodeId}
                value={result.nodeId}
                className="flex items-center gap-2 whitespace-nowrap"
              >
                {result.error ? (
                  <XCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                )}
                {getNodeName(result.nodeId)}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex-1 overflow-hidden">
            {results.map((result) => (
              <TabsContent
                key={result.nodeId}
                value={result.nodeId}
                className="h-full border rounded-lg p-4 mt-2 space-y-4 overflow-hidden flex flex-col"
              >
                <div className="flex items-center justify-between flex-shrink-0">
                  <h3 className="text-lg font-medium">{getNodeName(result.nodeId)}</h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopy(result)}
                      className={copiedNodeId === result.nodeId ? 'bg-green-100 border-green-500 text-green-700' : ''}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      {copiedNodeId === result.nodeId ? 'Copiado!' : 'Copiar'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(result)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    {canShare && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleShare(result)}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Compartilhar
                      </Button>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {result.error ? (
                    <div className="text-red-600 p-4 bg-red-50 border border-red-200 rounded">
                      <h4 className="font-medium mb-2">❌ Erro:</h4>
                      <p className="whitespace-pre-wrap">{result.error}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {result.outputs && Object.keys(result.outputs).length > 0 ? (
                        Object.entries(result.outputs)
                          .filter(([key]) => {
                            const lowerKey = key.toLowerCase();
                            return lowerKey !== 'metadata' && 
                                   lowerKey !== 'model' && 
                                   lowerKey !== 'timestamp' &&
                                   !lowerKey.includes('metadata');
                          })
                          .map(([key, value]) => (
                            <div key={key} className="space-y-2">
                              <h4 className="font-medium text-base border-b pb-1">
                                📋 {key.replace(/_/g, ' ').toUpperCase()}
                              </h4>
                              <div className="pl-2">
                                {renderValue(value)}
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-muted-foreground italic p-4 text-center bg-muted rounded border">
                          Nenhum resultado disponível
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};