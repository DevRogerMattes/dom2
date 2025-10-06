import React, { useState, useEffect } from 'react';
import { Play, Settings, Save, RotateCcw, Loader2, FileText, Plus, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useWorkflowStore } from '../stores/workflowStore';
import { ConfigurationDialog } from './ConfigurationDialog';
import { useVisualExecution } from '../hooks/useVisualExecution';
import { ResultsModal } from './ResultsModal';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { TopBarBackButton } from './TopBarBackButton';

interface TopBarProps {
  hideWorkflowActions?: boolean;
  children?: React.ReactNode;
  showBackButton?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({ hideWorkflowActions = false, children, showBackButton = false }) => {
  const { 
    resetExecution, 
    saveWorkflow, 
    currentWorkflow, 
    nodes,
    edges, 
    createWorkflow,
    searchTerm,
    setSearchTerm 
  } = useWorkflowStore();
  const { executeWorkflowVisually, isExecuting, results, currentNodeId } = useVisualExecution();
  const { user, signOut } = useAuth();
  
  const [configOpen, setConfigOpen] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleCreateWorkflow = () => {
    const name = `Workflow ${nodes.length + 1}`;
    const description = 'Novo workflow de agentes';
    createWorkflow(name, description);
  };

  const handleSignOut = async () => {
    console.log('Usuário desconectado');
    const { error } = await signOut();
    if (error) {
      console.error('Erro ao desconectar:', error);
    }
  };
  
  // Reseta o estado do modal quando não houver resultados
  const handleExecute = async () => {
    setShowResults(false); // Reseta o modal antes de executar
    await executeWorkflowVisually();
    if (results.length > 0) {
      setShowResults(true);
    }
  };

  React.useEffect(() => {
    if (results.length === 0) {
      setShowResults(false);
    }
  }, [results.length]);

  // Detectar alterações não salvas
  useEffect(() => {
    if (currentWorkflow) {
      setHasUnsavedChanges(true);
    }
  }, [nodes, edges]);

  // Resetar o feedback de sucesso após 2 segundos
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  return (
    <>
      <div className="h-16 border-b bg-white dark:bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-6 sticky top-0 z-30">
        {/* Left side - Back button + Logo and project info */}
        <div className="flex items-center gap-4">
          {showBackButton && <TopBarBackButton />}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-sm">⚡</span>
            </div>
            <h1 className="font-semibold text-lg text-black dark:text-white">Domius</h1>
          </div>
        </div>

        {/* Center - Execution status */}
        <div className="flex items-center gap-4 flex-1 max-w-md mx-4">
          {isExecuting && (
            <div className="flex items-center gap-2 text-orange-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">
                Executando: {currentNodeId ? nodes.find(n => n.id === currentNodeId)?.data.agent.name : 'Workflow'}
              </span>
            </div>
          )}
          {results.length > 0 && !isExecuting && (
            <div className="flex items-center gap-2 text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">
                Workflow concluído - {results.length} agentes processados
              </span>
            </div>
          )}
        </div>

        {/* Right side - Actions + custom children */}
        <div className="flex items-center gap-3">
          {!hideWorkflowActions && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowResults(true);
                }}
                disabled={results.length === 0}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                Ver Resultados
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={async () => {
                  setIsSaving(true);
                  try {
                    await saveWorkflow();
                    setHasUnsavedChanges(false);
                    setSaveSuccess(true);
                  } catch (error) {
                    console.error('Erro ao salvar workflow:', error);
                    alert('Erro ao salvar workflow. Tente novamente.');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                className={`gap-2 ${saveSuccess ? "bg-green-500 hover:bg-green-600 text-white" : ""}`}
                disabled={isSaving || !currentWorkflow}
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : saveSuccess ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 text-white">✓</div>
                    Salvo
                  </div>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {hasUnsavedChanges ? "Salvar alterações" : "Salvar"}
                  </>
                )}
              </Button>
              {results.length > 0 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    resetExecution();
                    setShowResults(false);
                  }}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              )}
              <Button
                size="sm"
                onClick={executeWorkflowVisually}
                disabled={isExecuting}
                variant="default"
                className="gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <Play className="w-4 h-4" />
                {isExecuting ? 'Executando...' : 'Executar Workflow'}
              </Button>
            </>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfigOpen(true)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Configurações
          </Button>

          <ThemeToggleButton />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-sm text-muted-foreground">
                {user?.email}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Custom children injected from parent */}
          {children}
        </div>
      </div>
      <ConfigurationDialog open={configOpen} onOpenChange={setConfigOpen} />
      <ResultsModal
        results={results}
        open={showResults}
        onOpenChange={setShowResults}
      />
    </>
  );
};

  // Botão de troca de tema
  import { Moon, Sun } from 'lucide-react';

  function ThemeToggleButton() {
    const { user, updateThemePreference } = useAuth();
    const [isDark, setIsDark] = useState(user?.theme === 'dark');

    useEffect(() => {
      // Atualiza o tema automaticamente ao carregar o usuário
      if (user?.theme) {
        const isUserDark = user.theme === 'dark';
        setIsDark(isUserDark);
        document.body.classList.toggle('dark', isUserDark);
      }
    }, [user]);

    useEffect(() => {
      document.body.classList.toggle('dark', isDark);
    }, [isDark]);

    // Som ao alternar
    function playToggleSound() {
      const audio = new Audio(isDark
        ? 'https://cdn.jsdelivr.net/gh/rogermattes/domius-assets/sounds/sun.mp3'
        : 'https://cdn.jsdelivr.net/gh/rogermattes/domius-assets/sounds/moon.mp3');
      audio.volume = 0.2;

      audio.play().catch((error) => {
        console.error('Erro ao reproduzir som:', error);
      });
    }

    const handleThemeToggle = () => {
      const newTheme = isDark ? 'light' : 'dark';
      setIsDark(!isDark);
      playToggleSound();
      updateThemePreference(newTheme); // Salvar preferência no banco de dados
    };

    return (
      <Button
        size="sm"
        variant="outline"
        onClick={handleThemeToggle}
        className="ml-2 flex items-center justify-center"
        aria-label={isDark ? 'Tema claro' : 'Tema escuro'}
      >
        {isDark ? <Sun className="w-5 h-5 text-orange-500" /> : <Moon className="w-5 h-5 text-orange-500" />}
      </Button>
    );
  }
