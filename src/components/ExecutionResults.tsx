import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, AlertCircle, ChevronRight } from 'lucide-react';
import { WorkflowNode } from '../types/agent';
import { useWorkflowStore } from '../stores/workflowStore';

interface ExecutionResultsProps {
  results: Array<{
    nodeId: string;
    outputs: Record<string, any>;
    error?: string;
  }>;
}

export const ExecutionResults: React.FC<ExecutionResultsProps> = ({ results }) => {
  const { nodes } = useWorkflowStore();

  const getNodeName = (nodeId: string): string => {
    const node = nodes.find(n => n.id === nodeId) as WorkflowNode;
    return node?.data.agent.name || nodeId;
  };

  const renderValue = (value: any): React.ReactNode => {
    if (typeof value === 'string') {
      return <span className="text-sm">{value}</span>;
    }
    if (Array.isArray(value)) {
      return (
        <ul className="list-disc list-inside">
          {value.map((item, index) => (
            <li key={index} className="text-sm">{renderValue(item)}</li>
          ))}
        </ul>
      );
    }
    if (typeof value === 'object' && value !== null) {
      return (
        <div className="pl-4 border-l-2 border-slate-200">
          {Object.entries(value).map(([key, val]) => (
            <div key={key} className="mt-2">
              <span className="text-sm font-medium">{key}:</span>
              <div className="ml-2">{renderValue(val)}</div>
            </div>
          ))}
        </div>
      );
    }
    return <span className="text-sm">{String(value)}</span>;
  };

  return (
    <Card className="fixed right-4 bottom-4 w-96 max-h-[600px] shadow-xl border-2 border-orange-200 bg-white/95 backdrop-blur">
      <div className="p-4 border-b bg-orange-50">
        <h2 className="text-lg font-semibold text-orange-800">
          Resultados da Execução
        </h2>
        <p className="text-sm text-orange-600">
          {results.length} agentes processados
        </p>
      </div>

      <ScrollArea className="h-[500px] p-4">
        <div className="space-y-6">
          {results.map(({ nodeId, outputs, error }, index) => (
            <div key={nodeId} className="relative">
              {/* Linha conectora */}
              {index < results.length - 1 && (
                <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-orange-200" />
              )}

              <div className="flex items-start gap-3">
                <div className="relative z-10 mt-1">
                  {error ? (
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium">
                      {getNodeName(nodeId)}
                    </h3>
                    <ChevronRight className="w-4 h-4 text-orange-500" />
                  </div>

                  {error ? (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                      {error}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(outputs).map(([key, value]) => (
                        <div key={key} className="bg-orange-50 p-3 rounded border border-orange-100">
                          <div className="text-sm font-medium text-orange-800 mb-1">
                            {key}:
                          </div>
                          <div className="text-orange-700">
                            {renderValue(value)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};
