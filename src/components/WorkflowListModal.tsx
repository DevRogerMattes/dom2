import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Pencil, Trash2 } from 'lucide-react';
import { Workflow } from '../stores/workflowStore';

interface WorkflowListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workflows: Workflow[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const WorkflowListModal: React.FC<WorkflowListModalProps> = ({ open, onOpenChange, workflows, onEdit, onDelete }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Workflows</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {workflows.map(workflow => (
            <div key={workflow.id} className="p-4 rounded-xl shadow bg-gray-50 dark:bg-neutral-800 border border-border flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-black dark:text-orange-100 cursor-pointer hover:underline">
                  {workflow.name}
                </h3>
                <div className="flex gap-2">
                  {onEdit && (
                    <button
                      className="p-2 rounded hover:bg-orange-200 dark:hover:bg-neutral-600"
                      title="Editar Workflow"
                      onClick={() => onEdit(workflow.id)}
                    >
                      <Pencil className="w-4 h-4 text-orange-500" />
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900"
                      title="Excluir Workflow"
                      onClick={() => onDelete(workflow.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-neutral-300">{workflow.description}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
