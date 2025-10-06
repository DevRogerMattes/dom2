import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Edit, Trash2 } from 'lucide-react';
import { Agent, AgentInput, AgentOutput } from '@/types/agent';
import { useAgents } from '@/hooks/useAgents';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'setup', label: 'Setup' },
  { value: 'copywriting', label: 'Copywriting' },
  { value: 'infoproduct', label: 'Infoproduto' },
  { value: 'seo', label: 'SEO' },
  { value: 'document', label: 'Documento' },
  { value: 'sales', label: 'Vendas' },
] as const;

const INPUT_TYPES = [
  { value: 'text', label: 'Texto' },
  { value: 'number', label: 'Número' },
  { value: 'boolean', label: 'Booleano' },
  { value: 'file', label: 'Arquivo' },
  { value: 'image', label: 'Imagem' },
  { value: 'array', label: 'Array' },
] as const;

const OUTPUT_TYPES = [
  { value: 'text', label: 'Texto' },
  { value: 'html', label: 'HTML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'json', label: 'JSON' },
  { value: 'image', label: 'Imagem' },
  { value: 'file', label: 'Arquivo' },
] as const;

interface EditAgentDialogProps {
  agent: Agent;
  children: React.ReactNode;
}

export function EditAgentDialog({ agent, children }: EditAgentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { updateAgent } = useAgents();

  const [formData, setFormData] = useState({
    name: agent.name,
    description: agent.description,
    category: agent.category,
    icon: agent.icon,
    template: agent.template || '',
    inputs: [...agent.inputs],
    outputs: [...agent.outputs],
  });
  const isGlobal = agent.global_visibility === 'U';

  // Reset form when agent changes
  useEffect(() => {
    setFormData({
      name: agent.name,
      description: agent.description,
      category: agent.category,
      icon: agent.icon,
      template: agent.template || '',
      inputs: [...agent.inputs],
      outputs: [...agent.outputs],
    });
  }, [agent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast.error('Nome e descrição são obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await updateAgent(agent.id, {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        icon: formData.icon,
        inputs: formData.inputs,
        outputs: formData.outputs,
        template: formData.template,
      });

      toast.success('Agente atualizado com sucesso!');
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar agente');
    } finally {
      setLoading(false);
    }
  };

  const addInput = () => {
    setFormData(prev => ({
      ...prev,
      inputs: [...prev.inputs, {
        id: `input_${Date.now()}`,
        name: '',
        type: 'text',
        required: false,
        description: '',
        placeholder: '',
      }]
    }));
  };

  const updateInput = (index: number, field: keyof AgentInput, value: any) => {
    setFormData(prev => ({
      ...prev,
      inputs: prev.inputs.map((input, i) => 
        i === index ? { ...input, [field]: value } : input
      )
    }));
  };

  const removeInput = (index: number) => {
    setFormData(prev => ({
      ...prev,
      inputs: prev.inputs.filter((_, i) => i !== index)
    }));
  };

  const addOutput = () => {
    setFormData(prev => ({
      ...prev,
      outputs: [...prev.outputs, {
        id: `output_${Date.now()}`,
        name: '',
        type: 'text',
        description: '',
      }]
    }));
  };

  const updateOutput = (index: number, field: keyof AgentOutput, value: any) => {
    setFormData(prev => ({
      ...prev,
      outputs: prev.outputs.map((output, i) => 
        i === index ? { ...output, [field]: value } : output
      )
    }));
  };

  const removeOutput = (index: number) => {
    setFormData(prev => ({
      ...prev,
      outputs: prev.outputs.filter((_, i) => i !== index)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Agente: {agent.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {isGlobal && (
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded text-sm">
              Este agente é global e não pode ser editado pelo sistema.
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Agente</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Gerador de Headlines"
                  required
                  maxLength={45}
                  disabled={isGlobal}
                />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="icon">Ícone</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="🤖"
                maxLength={2}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descreva o que este agente faz..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value as Agent['category'] }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Template/Prompt</Label>
            <Textarea
              id="template"
              value={formData.template}
              onChange={(e) => setFormData(prev => ({ ...prev, template: e.target.value }))}
              placeholder="Use {{variavel}} para referenciar inputs..."
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Inputs</h3>
              <Button type="button" onClick={addInput} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Adicionar Input
              </Button>
            </div>
            
            {formData.inputs.map((input, index) => (
              <div key={input.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Input {index + 1}</h4>
                  <Button type="button" onClick={() => removeInput(index)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={input.name}
                      onChange={(e) => updateInput(index, 'name', e.target.value)}
                      placeholder="Nome do input"
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select value={input.type} onValueChange={(value) => updateInput(index, 'type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INPUT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Descrição</Label>
                  <Input
                    value={input.description}
                    onChange={(e) => updateInput(index, 'description', e.target.value)}
                    placeholder="Descrição do input"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Placeholder</Label>
                    <Input
                      value={input.placeholder || ''}
                      onChange={(e) => updateInput(index, 'placeholder', e.target.value)}
                      placeholder="Texto de exemplo"
                    />
                  </div>
                  <div className="flex items-center space-x-2 pt-6">
                    <input
                      type="checkbox"
                      checked={input.required}
                      onChange={(e) => updateInput(index, 'required', e.target.checked)}
                      className="rounded"
                    />
                    <Label>Obrigatório</Label>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Outputs</h3>
              <Button type="button" onClick={addOutput} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Adicionar Output
              </Button>
            </div>
            
            {formData.outputs.map((output, index) => (
              <div key={output.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Output {index + 1}</h4>
                  <Button type="button" onClick={() => removeOutput(index)} variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Nome</Label>
                    <Input
                      value={output.name}
                      onChange={(e) => updateOutput(index, 'name', e.target.value)}
                      placeholder="Nome do output"
                    />
                  </div>
                  <div>
                    <Label>Tipo</Label>
                    <Select value={output.type} onValueChange={(value) => updateOutput(index, 'type', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {OUTPUT_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Descrição</Label>
                  <Input
                    value={output.description}
                    onChange={(e) => updateOutput(index, 'description', e.target.value)}
                    placeholder="Descrição do output"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || isGlobal}>
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}