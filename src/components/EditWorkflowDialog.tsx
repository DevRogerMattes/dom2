import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useWorkflowStore } from '../stores/workflowStore';

interface EditWorkflowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflowId: string;
}

export const EditWorkflowDialog: React.FC<EditWorkflowDialogProps> = ({
  open,
  onOpenChange,
  workflowId
}) => {
  const { workflows, updateWorkflow } = useWorkflowStore();
  const workflow = workflows.find(w => w.id === workflowId);
  
  const [name, setName] = useState(workflow?.name || '');
  const [description, setDescription] = useState(workflow?.description || '');

  // Atualiza os campos quando workflowId ou workflow mudam
  React.useEffect(() => {
    setName(workflow?.name || '');
    setDescription(workflow?.description || '');
  }, [workflowId, workflow]);

  const { initWorkflowsFromApi } = useWorkflowStore();
  const handleSave = async () => {
    if (!workflow) return;
    await updateWorkflow(workflowId, {
      name,
      description
    });
    await initWorkflowsFromApi();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Workflow</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome do workflow"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do workflow"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
