import React, { useState } from 'react';
import { useWorkflowStore } from '../stores/workflowStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Pencil, Trash2 } from 'lucide-react';
import { EditWorkflowDialog } from './EditWorkflowDialog';
import { Button } from './ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const WorkflowSelector = () => {
  const { workflows, currentWorkflow, loadWorkflow, deleteWorkflow } = useWorkflowStore();
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);
  const [deletingWorkflowId, setDeletingWorkflowId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!currentWorkflow) return null;

  const handleDelete = (workflowId: string) => {
    deleteWorkflow(workflowId);
    setDeletingWorkflowId(null);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer">
          <Badge variant="secondary" className="flex items-center gap-1">
            {currentWorkflow.name}
            <ChevronDown className="w-3 h-3 ml-1" />
          </Badge>
        </DropdownMenuTrigger>
      
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Workflows</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {workflows.map(workflow => (
          <DropdownMenuItem
            key={workflow.id}
            className={`flex items-center justify-between ${
              workflow.id === currentWorkflow.id ? 'bg-orange-500/10' : ''
            }`}
            onClick={() => loadWorkflow(workflow.id)}
          >
            <div className="flex-1">
              <div className="flex flex-col">
                <span className="font-medium">{workflow.name}</span>
                <span className="text-xs text-muted-foreground">
                  {workflow.description}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 ml-2">
              {workflow.id === currentWorkflow.id && (
                <Badge variant="secondary" className="text-xs mr-2">
                  Atual
                </Badge>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingWorkflowId(workflow.id);
                  setIsDropdownOpen(false);
                }}
              >
                <Pencil className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-red-400 hover:text-red-600 hover:bg-red-100/10"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeletingWorkflowId(workflow.id);
                  setIsDropdownOpen(false);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

      {/* Modal de Edição */}
      <EditWorkflowDialog
        open={!!editingWorkflowId}
        onOpenChange={(open) => !open && setEditingWorkflowId(null)}
        workflowId={editingWorkflowId || ''}
      />

      {/* Dialog de Confirmação de Deleção */}
      <AlertDialog
        open={!!deletingWorkflowId}
        onOpenChange={(open) => !open && setDeletingWorkflowId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Workflow</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este workflow? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingWorkflowId && handleDelete(deletingWorkflowId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
