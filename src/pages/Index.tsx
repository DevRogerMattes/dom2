
import React, { useState } from 'react';
import { SidebarApp } from '../components/SidebarApp';
import { WorkflowCanvasProvider } from '../components/WorkflowCanvas';
import { PropertyPanel } from '../components/PropertyPanel';
import { TopBar } from '../components/TopBar';
import { AddAgentDialog } from '../components/AddAgentDialog';
import { PanelToggleButtons } from '../components/PanelToggleButtons';
import { Agent } from '../types/agent';

import { useEffect } from 'react';
import { useWorkflowStore } from '../stores/workflowStore';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [isLeftPanelVisible, setIsLeftPanelVisible] = useState(true);
  const [isRightPanelVisible, setIsRightPanelVisible] = useState(true);
  const { initWorkflowsFromApi, currentWorkflow } = useWorkflowStore();
  const navigate = useNavigate();

  useEffect(() => {
    initWorkflowsFromApi();
  }, []);

  useEffect(() => {
    if (!currentWorkflow) {
      navigate('/workflows');
    }
  }, [currentWorkflow, navigate]);

  const handleAgentDrag = (agent: Agent) => {
    console.log('Agent dragged:', agent);
  };

  const toggleLeftPanel = () => {
    setIsLeftPanelVisible(prev => !prev);
  };

  const toggleRightPanel = () => {
    setIsRightPanelVisible(prev => !prev);
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <div className="relative">
        <TopBar showBackButton />
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="flex h-full">
          {/* Sidebar Panel */}
          <div className={`transition-all duration-300 ease-in-out ${
            isLeftPanelVisible ? 'w-80' : 'w-0'
          } overflow-hidden`}>
            <div className="w-80 h-full">
              <SidebarApp onAgentDrag={handleAgentDrag} />
            </div>
          </div>
          
          {/* Main Canvas Panel */}
          <div className="flex-1 h-full relative bg-slate-900">
            <WorkflowCanvasProvider />
          </div>
          
          {/* Property Panel */}
          <div className={`transition-all duration-300 ease-in-out ${
            isRightPanelVisible ? 'w-80' : 'w-0'
          } overflow-hidden`}>
            <div className="w-80 h-full">
              <PropertyPanel />
            </div>
          </div>
        </div>

        {/* Panel Toggle Buttons */}
        <PanelToggleButtons
          isLeftPanelVisible={isLeftPanelVisible}
          isRightPanelVisible={isRightPanelVisible}
          onToggleLeftPanel={toggleLeftPanel}
          onToggleRightPanel={toggleRightPanel}
        />
      </div>
    </div>
  );
};

export default Index;
