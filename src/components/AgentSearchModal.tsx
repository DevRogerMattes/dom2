import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Agent {
  id: string;
  name: string;
}

interface AgentSearchModalProps {
  agents: Agent[];
  onClose: () => void;
  onAgentDrop: (agent: Agent, position: { x: number; y: number }) => void;
}

const AgentSearchModal: React.FC<AgentSearchModalProps> = ({ agents, onClose, onAgentDrop }) => {
  const handleDragStart = (event: React.DragEvent, agent: Agent) => {
    event.dataTransfer.setData('agent', JSON.stringify(agent));
  };

  const handleDrop = (event: React.DragEvent) => {
    const agentData = event.dataTransfer.getData('agent');
    const agent = JSON.parse(agentData);
    const position = { x: event.clientX, y: event.clientY };
    onAgentDrop(agent, position);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="p-4 w-[400px] max-h-[600px] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Buscar Agentes</h2>
          <Button onClick={onClose}>Fechar</Button>
        </div>
        <div className="flex flex-col gap-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="p-2 bg-gray-100 rounded shadow cursor-pointer"
              draggable
              onDragStart={(event) => handleDragStart(event, agent)}
            >
              {agent.name}
            </div>
          ))}
        </div>
      </Card>
      <div
        className="absolute inset-0"
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      ></div>
    </div>
  );
};

export default AgentSearchModal;
