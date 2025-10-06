
import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Trophy } from 'lucide-react';

interface ResultNodeProps {
  data: {
    result: Record<string, any>;
    status: 'idle' | 'processing' | 'completed';
  };
  id: string;
}

export const ResultNode: React.FC<ResultNodeProps> = ({ data }) => {
  const { result, status } = data;

  const renderResultContent = (key: string, value: any) => {
    if (key === 'headlines' && Array.isArray(value)) {
      return (
        <div className="space-y-1 max-h-32 overflow-y-auto">
          {value.slice(0, 3).map((headline, index) => (
            <div key={index} className="text-xs bg-orange-50 p-2 rounded border-l-2 border-orange-500">
              {headline}
            </div>
          ))}
          {value.length > 3 && <div className="text-xs text-muted-foreground">+{value.length - 3} mais...</div>}
        </div>
      );
    }

    if (key === 'sales_copy' && typeof value === 'string') {
      return (
        <div className="max-h-32 overflow-hidden">
          <div className="text-xs bg-blue-50 p-2 rounded border border-blue-200">
            📝 Copy de vendas gerado ({value.length} caracteres)
          </div>
        </div>
      );
    }

    if (key === 'html_structure' && typeof value === 'string') {
      return (
        <div className="text-xs bg-purple-50 p-2 rounded border border-purple-200">
          🌐 Landing page HTML completa
        </div>
      );
    }

    if (key === 'image_url' && typeof value === 'string') {
      return (
        <div className="text-xs bg-green-50 p-2 rounded border border-green-200">
          🖼️ Imagem gerada com sucesso
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <div className="text-xs bg-slate-50 p-2 rounded border">
          📊 Dados estruturados
        </div>
      );
    }

    return (
      <div className="text-xs bg-slate-50 p-2 rounded border">
        {value?.toString().substring(0, 50)}...
      </div>
    );
  };

  return (
    <Card className="min-w-[300px] max-w-[400px] border-2 border-green-500 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 border-2 border-green-500 bg-background"
      />

      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-green-600" />
          <div>
            <h3 className="font-semibold text-green-700">Resultado Final</h3>
            <Badge variant="default" className="bg-green-500 text-xs mt-1">
              <FileText className="w-3 h-3 mr-1" />
              Output Completo
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {status === 'processing' && (
          <div className="text-center py-4">
            <div className="w-6 h-6 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-green-600">Compilando resultado...</p>
          </div>
        )}

        {status === 'completed' && result && (
          <div className="space-y-3">
            <div className="text-center mb-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs font-medium text-green-700">
                Workflow Concluído!
              </p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(result).map(([key, value]) => (
                <div key={key}>
                  <h4 className="text-xs font-medium text-slate-700 mb-1 capitalize">
                    {key.replace(/_/g, ' ')}:
                  </h4>
                  {renderResultContent(key, value)}
                </div>
              ))}
            </div>
          </div>
        )}

        {status === 'idle' && (
          <div className="text-center py-4 text-muted-foreground">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p className="text-xs">Aguardando execução...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
