
import React from 'react';
import { Button } from '@/components/ui/button';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';

interface PanelToggleButtonsProps {
  isLeftPanelVisible: boolean;
  isRightPanelVisible: boolean;
  onToggleLeftPanel: () => void;
  onToggleRightPanel: () => void;
}

export const PanelToggleButtons: React.FC<PanelToggleButtonsProps> = ({
  isLeftPanelVisible,
  isRightPanelVisible,
  onToggleLeftPanel,
  onToggleRightPanel,
}) => {
  return (
    <>
      {/* Left Panel Toggle */}
      <div className="fixed top-20 left-2 z-[5]">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleLeftPanel}
          className="glass bg-white/10 hover:bg-white/20 border-white/20 text-white shadow-lg"
          title={isLeftPanelVisible ? "Ocultar painel de agentes" : "Mostrar painel de agentes"}
        >
          {isLeftPanelVisible ? (
            <PanelLeftClose className="w-4 h-4" />
          ) : (
            <PanelLeftOpen className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Right Panel Toggle */}
      <div className="fixed top-20 right-2 z-[5]">
        <Button
          variant="secondary"
          size="sm"
          onClick={onToggleRightPanel}
          className="glass bg-white/10 hover:bg-white/20 border-white/20 text-white shadow-lg"
          title={isRightPanelVisible ? "Ocultar painel de propriedades" : "Mostrar painel de propriedades"}
        >
          {isRightPanelVisible ? (
            <PanelRightClose className="w-4 h-4" />
          ) : (
            <PanelRightOpen className="w-4 h-4" />
          )}
        </Button>
      </div>
    </>
  );
};
