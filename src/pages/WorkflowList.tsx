import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Layout } from 'lucide-react';
import { useWorkflowStore } from '../stores/workflowStore';
import { AGENT_CATEGORIES } from '../data/categories';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { Agent } from '../types/agent';
import { Plus, Loader2, FileText, Package, Workflow, CheckCircle, ChevronLeft, ChevronRight, Pencil, Trash2, User, CreditCard } from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { useAgents } from '../hooks/useAgents';
import { AddAgentDialog } from '../components/AddAgentDialog';
import { EditAgentDialog } from '../components/EditAgentDialog';
import { ProdutosCriadosCards } from '../components/ProdutosCriadosCards';
import { useSubscription } from '../hooks/useSubscription';
import { useStripeCheckout } from '../hooks/useStripeCheckout';
import { PaymentStatus } from '../components/PaymentStatus';

const isExecuting = false;
const currentNodeId = null;
const nodes = [];

const WorkflowList: React.FC = () => {
  const [selectedAgentCategory, setSelectedAgentCategory] = useState<string>('');
  const { workflows, createWorkflow, fetchWorkflowsFromApi, deleteWorkflow, loadWorkflow } = useWorkflowStore();
  const { agents, loading: loadingAgents, deleteAgent } = useAgents();
  const { user } = useAuth();
  const { plans, userSubscription, loading: loadingSubscription, error: subscriptionError, hasActiveSubscription, subscribeToPlan } = useSubscription();
  const { redirectToCheckout } = useStripeCheckout();
  const navigate = useNavigate();
  const [selectedMenu, setSelectedMenu] = useState('assinatura');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [editingWorkflowId, setEditingWorkflowId] = useState<string | null>(null);
  const [editingWorkflowData, setEditingWorkflowData] = useState<any | null>(null);
  const [deletingWorkflowId, setDeletingWorkflowId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchWorkflowsFromApi(user.id);
    }
  }, [user]);

  // Definir menu correto baseado no status da assinatura
  useEffect(() => {
    if (!loadingSubscription) {
      if (hasActiveSubscription) {
        setSelectedMenu('workflows');
      } else {
        setSelectedMenu('assinatura');
      }
    }
  }, [loadingSubscription, hasActiveSubscription]);

  const handleMenuClick = async (menu: string) => {
    // Bloquear navegação se usuário não tem plano ativo
    if (!hasActiveSubscription && menu !== 'assinatura') {
      return; // Impede a mudança de menu
    }
    setSelectedMenu(menu);
    if (menu === 'workflows' && user?.id) {
      await fetchWorkflowsFromApi(user.id);
    }
  };

  const sidebarWidth = isSidebarOpen ? 'w-80' : 'w-16';

  const handleCreateWorkflow = () => {
    const name = `Workflow ${(Array.isArray(workflows) ? workflows.length : 0) + 1}`;
    const description = 'Novo workflow';
    createWorkflow(name, description);
  };

  const handleSubscribeToPlan = async (planId: string) => {
    try {
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        alert('Plano não encontrado.');
        return;
      }

      // Verificar se o plano tem stripe_price_id
      if (!plan.stripe_price_id) {
        alert('Este plano ainda não está disponível para pagamento online. Entre em contato conosco.');
        return;
      }

      console.log('Redirecionando para checkout Stripe:', {
        priceId: plan.stripe_price_id,
        planName: plan.name
      });

      await redirectToCheckout({
        priceId: plan.stripe_price_id,
        planName: plan.name
      });

    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
    }
  };

  const handleSelectWorkflow = (workflowId: string) => {
    const workflow = Array.isArray(workflows) ? workflows.find(w => w.id === workflowId) : null;
    if (workflow) {
      loadWorkflow(workflowId);
      navigate('/app');
    } else {
      alert('Workflow não encontrado. Tente recarregar a página.');
    }
  };

  const handleEditWorkflow = (workflowId: string) => {
    const workflow = workflows.find(w => w.id === workflowId);
    if (workflow) {
      setEditingWorkflowId(workflowId);
      setEditingWorkflowData(workflow);
    }
  };

  const filteredWorkflows = Array.isArray(workflows)
    ? workflows.filter(w => w.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  const filteredAgents = agents.filter(a =>
  a.user_id === user?.id &&
    (selectedAgentCategory === '' || a.category === selectedAgentCategory) &&
    (a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredUserWorkflows = workflows.filter(w =>
    w.user_id === user?.id &&
    w.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-background text-foreground">
      <TopBar hideWorkflowActions />
      <div className="flex-1 overflow-hidden relative">
        <div className="flex h-full">
          {/* Sidebar Panel */}
          <div className={`${sidebarWidth} h-full bg-white dark:bg-background text-foreground border-r border-border flex flex-col transition-all duration-300 ease-in-out overflow-hidden`}>
            <div className="p-2 flex justify-end">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsSidebarOpen((prev) => !prev)}
                className="rounded-full"
              >
                {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </Button>
            </div>
            <div className="p-4 border-b border-white/10">
              <div className="space-y-2">
                {hasActiveSubscription && (
                  <>
                    <Button
                      size="sm"
                      variant={selectedMenu === 'workflows' ? 'default' : 'ghost'}
                      className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} transition-all duration-200 ${selectedMenu === 'workflows' ? 'bg-gradient-orange text-white shadow-glow' : 'text-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}
                      onClick={() => handleMenuClick('workflows')}
                    >
                      <Workflow className="w-4 h-4" />
                      {isSidebarOpen && <span className="ml-2">Workflows</span>}
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedMenu === 'agents' ? 'default' : 'ghost'}
                      className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} transition-all duration-200 ${selectedMenu === 'agents' ? 'bg-gradient-orange text-white shadow-glow' : 'text-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}
                      onClick={() => handleMenuClick('agents')}
                    >
                      <User className="w-4 h-4" />
                      {isSidebarOpen && <span className="ml-2">Agentes</span>}
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedMenu === 'page' ? 'default' : 'ghost'}
                      className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} transition-all duration-200 ${selectedMenu === 'page' ? 'bg-gradient-orange text-white shadow-glow' : 'text-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}
                      onClick={() => handleMenuClick('page')}
                      style={{ display: 'none' }}
                    >
                      <FileText className="w-4 h-4" />
                      {isSidebarOpen && <span className="ml-2">Criador de Pagina</span>}
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedMenu === 'products' ? 'default' : 'ghost'}
                      className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} transition-all duration-200 ${selectedMenu === 'products' ? 'bg-gradient-orange text-white shadow-glow' : 'text-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}
                      onClick={() => handleMenuClick('products')}
                    >
                      <Layout className="w-4 h-4" />
                      {isSidebarOpen && <span className="ml-2">Produtos Criados</span>}
                    </Button>
                  </>
                )}
                <Button
                  size="sm"
                  variant={selectedMenu === 'assinatura' ? 'default' : 'ghost'}
                  className={`w-full ${isSidebarOpen ? 'justify-start' : 'justify-center'} transition-all duration-200 ${selectedMenu === 'assinatura' ? 'bg-gradient-orange text-white shadow-glow' : 'text-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'}`}
                  onClick={() => handleMenuClick('assinatura')}
                >
                  <CreditCard className="w-4 h-4" />
                  {isSidebarOpen && <span className="ml-2">Assinatura</span>}
                </Button>
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1 p-6 bg-background text-foreground">
            {selectedMenu === 'agents' && (
              <>
                <h1 className="text-2xl font-bold mb-6 text-black dark:text-orange-500">Agentes</h1>
                <div className="mb-4 flex gap-4 items-center">
                  <div>
                    <AddAgentDialog />
                  </div>
                  <select
                    value={selectedAgentCategory}
                    onChange={e => setSelectedAgentCategory(e.target.value)}
                    className="px-3 py-2 rounded-md border border-border bg-white dark:bg-neutral-900 text-black dark:text-white text-base"
                    style={{ minWidth: '180px' }}
                  >
                    <option value="">Todas as categorias</option>
                    {Object.entries(AGENT_CATEGORIES).map(([key, cat]) => (
                      <option key={key} value={key}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="text"
                    placeholder="Pesquisar agentes..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-64 h-10 text-base border border-border rounded-md px-3 bg-white dark:bg-neutral-900 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-400"
                  />
                </div>
              </>
            )}
            {selectedMenu === 'workflows' && (
              <>
                <h1 className="text-2xl font-bold mb-6 text-black dark:text-orange-500">Workflows</h1>
                <div className="mb-4 flex gap-4 items-center">
                  <button
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-glow hover:from-orange-600 hover:to-orange-700"
                    onClick={handleCreateWorkflow}
                  >
                    <Plus className="w-5 h-5" />
                    Novo Workflow
                  </button>
                  <Input
                    type="text"
                    placeholder="Pesquisar workflows..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-64 h-10 text-base border border-border rounded-md px-3 bg-white dark:bg-neutral-900 text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-neutral-400"
                  />
                </div>
              </>
            )}
            <div className="overflow-y-auto max-h-[calc(100vh-120px)] pr-2 pl-2 pb-8">
              {selectedMenu === 'agents' && (
                loadingAgents ? (
                  <div className="text-center py-12 text-foreground/50">Carregando agentes...</div>
                ) : (
                  Object.entries(AGENT_CATEGORIES).map(([catKey, cat]) => {
                    const agentsByCat = filteredAgents.filter(a => a.category === catKey);
                    if (agentsByCat.length === 0) return null;
                    return (
                      <div key={catKey} className="mb-8">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                          <span>{cat.icon}</span> {cat.name}
                        </h2>
                        <div className="grid grid-cols-3 gap-4">
                          {agentsByCat.map(agent => (
                            <Card key={agent.id} className={`agent-card category-${agent.category} relative bg-background border-border`}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3 mb-2">
                                  <span className="text-xl">{agent.icon}</span>
                                  <h4 className="font-medium text-sm text-foreground">
                                    {agent.name}
                                  </h4>
                                </div>
                                {agent.description && (
                                  <div className="text-xs text-foreground/70 mb-2">
                                    {agent.description}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary" className="text-xs bg-background/80 text-foreground border-border">
                                    {cat.icon}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-xs text-foreground/50 mb-2">
                                  <span>{agent.inputs.length} inputs</span>
                                  <span>{agent.outputs.length} outputs</span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                  <EditAgentDialog agent={agent}>
                                    <button
                                      className="p-2 rounded hover:bg-orange-200 dark:hover:bg-neutral-600"
                                      title="Editar Agente"
                                      type="button"
                                    >
                                      <Pencil className="w-4 h-4 text-orange-500" />
                                    </button>
                                  </EditAgentDialog>
                                  <button
                                    className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900"
                                    title="Excluir Agente"
                                    type="button"
                                    onClick={() => {
                                      const isUsed = workflows.some(w =>
                                        Array.isArray(w.nodes) && w.nodes.some(n => n.data?.agent?.id === agent.id)
                                      );
                                      if (isUsed) {
                                        alert('Este agente está sendo usado em um ou mais workflows e não pode ser excluído.');
                                        return;
                                      }
                                      deleteAgent(agent.id);
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )
              )}
              {selectedMenu === 'products' && (
                <ProdutosCriadosCards hidePageEditorButton={true} />
              )}
              {/* Nunca renderiza editor/páginas quando Produtos Criados está selecionado */}
              {selectedMenu === 'assinatura' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 text-black dark:text-orange-500 flex items-center gap-2">
                    <CreditCard className="w-6 h-6" />
                    Assinatura
                  </h2>
                  
                  {!hasActiveSubscription && !loadingSubscription && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-yellow-500 text-white rounded-full p-1">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                          Plano Necessário
                        </h3>
                      </div>
                      <p className="text-yellow-700 dark:text-yellow-300 mb-4">
                        Para acessar todas as funcionalidades do Domius (Workflows, Agentes, Criador de Páginas e Produtos), 
                        você precisa de um plano ativo. Escolha o plano que melhor se adequa às suas necessidades abaixo.
                      </p>
                    </div>
                  )}
                  
                  {loadingSubscription ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                      <p>Carregando informações de assinatura...</p>
                    </div>
                  ) : subscriptionError ? (
                    <div className="text-center py-8">
                      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                          Erro ao carregar assinaturas
                        </h3>
                        <p className="text-red-600 dark:text-red-300 mb-4">{subscriptionError}</p>
                        <button 
                          onClick={() => window.location.reload()} 
                          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Plano Atual */}
                      <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl border border-border shadow-sm">
                        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
                          Plano Atual
                        </h3>
                        {userSubscription ? (
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{userSubscription.plan_name}</p>
                              <p className="text-2xl font-bold text-orange-500">
                                {userSubscription.billing_cycle === 'monthly' 
                                  ? `R$ ${parseFloat(userSubscription.price_monthly || '0').toFixed(2)}/mês`
                                  : `R$ ${parseFloat(userSubscription.price_yearly || '0').toFixed(2)}/ano`
                                }
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                              <p className="text-lg font-semibold text-green-600">Ativo</p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-600 dark:text-gray-400">Você não possui uma assinatura ativa</p>
                            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Escolha um plano abaixo para começar</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Planos Disponíveis */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {plans.map((plan) => {
                          const price = plan.billing_cycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
                          const priceDisplay = plan.billing_cycle === 'monthly' 
                            ? `R$ ${parseFloat(price || '0').toFixed(2)}/mês`
                            : `R$ ${parseFloat(price || '0').toFixed(2)}/ano`;
                          
                          const isCurrentPlan = userSubscription?.plan_name === plan.name;
                          
                          return (
                            <div 
                              key={plan.id}
                              className={`p-6 rounded-xl border-2 ${
                                plan.is_highlighted 
                                  ? 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700'
                                  : plan.billing_cycle === 'monthly'
                                    ? 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700'
                                    : 'bg-white dark:bg-neutral-800 border-border'
                              }`}
                            >
                              <div className="text-center mb-4">
                                {plan.badge_text && (
                                  <div className={`text-white text-xs px-2 py-1 rounded-full inline-block mb-2 ${
                                    plan.is_highlighted ? 'bg-purple-500' : 'bg-orange-500'
                                  }`}>
                                    {plan.badge_text}
                                  </div>
                                )}
                                <h3 className={`text-xl font-bold ${
                                  plan.is_highlighted 
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : plan.billing_cycle === 'monthly'
                                      ? 'text-orange-600 dark:text-orange-400'
                                      : 'text-black dark:text-white'
                                }`}>
                                  {plan.name}
                                </h3>
                                <p className={`text-3xl font-bold mt-2 ${
                                  plan.is_highlighted 
                                    ? 'text-purple-700 dark:text-purple-300'
                                    : plan.billing_cycle === 'monthly'
                                      ? 'text-orange-700 dark:text-orange-300'
                                      : 'text-black dark:text-white'
                                }`}>
                                  {priceDisplay}
                                </p>
                                {plan.billing_cycle === 'yearly' && plan.price_monthly && plan.price_yearly && (
                                  <p className="text-sm text-purple-600 dark:text-purple-400">
                                    Economize R$ {((parseFloat(plan.price_monthly) * 12) - parseFloat(plan.price_yearly)).toFixed(2)} por ano
                                  </p>
                                )}
                              </div>
                              <ul className="space-y-2 mb-6">
                                {plan.features.map((feature, index) => (
                                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                              <Button 
                                className={`w-full ${
                                  isCurrentPlan
                                    ? 'bg-gray-400 text-white cursor-not-allowed'
                                    : plan.is_highlighted
                                      ? 'bg-purple-500 hover:bg-purple-600 text-white'
                                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                                }`}
                                disabled={isCurrentPlan}
                                onClick={() => !isCurrentPlan && handleSubscribeToPlan(plan.id)}
                              >
                                {isCurrentPlan ? 'Plano Atual' : `Assinar ${plan.name}`}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                      
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-700">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">i</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              Política de cancelamento
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400">
                              Você pode cancelar sua assinatura a qualquer momento. Não há taxa de cancelamento.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {selectedMenu !== 'agents' && selectedMenu !== 'products' && selectedMenu !== 'assinatura' && (
                <div className="grid grid-cols-3 gap-4">
                  {filteredWorkflows.map((workflow) => (
                    <div
                      key={workflow.id}
                      className="p-4 rounded-xl shadow transition-colors duration-200 bg-gray-50 dark:bg-neutral-800 border border-border cursor-pointer hover:bg-orange-100 dark:hover:bg-neutral-700 flex flex-col"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3
                          className="text-lg font-semibold text-black dark:text-orange-100 cursor-pointer hover:underline"
                          onClick={() => handleSelectWorkflow(workflow.id)}
                        >
                          {workflow.name}
                        </h3>
                        <div className="flex gap-2">
                          <button
                            className="p-2 rounded hover:bg-orange-200 dark:hover:bg-neutral-600"
                            title="Editar Workflow"
                            onClick={() => handleEditWorkflow(workflow.id)}
                          >
                            <Pencil className="w-4 h-4 text-orange-500" />
                          </button>
                          <button
                            className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-900"
                            title="Excluir Workflow"
                            onClick={() => setDeletingWorkflowId(workflow.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-neutral-300">{workflow.description}</p>
                    </div>
                  ))}
                </div>
              )}
              {/* Dialog de confirmação de exclusão */}
              {selectedMenu === 'workflows' && (
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
                        onClick={() => {
                          if (deletingWorkflowId) deleteWorkflow(deletingWorkflowId);
                          setDeletingWorkflowId(null);
                        }}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Modal de edição de workflow */}
      {editingWorkflowId && editingWorkflowData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-8 w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4">Editar Workflow</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                // Atualizar workflow
                const name = (e.target as any).name.value;
                const description = (e.target as any).description.value;
                if (name && description) {
                  useWorkflowStore.getState().updateWorkflow(editingWorkflowId, { name, description });
                  setEditingWorkflowId(null);
                  setEditingWorkflowData(null);
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  name="name"
                  defaultValue={editingWorkflowData.name}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-neutral-800 text-black dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descrição</label>
                <input
                  name="description"
                  defaultValue={editingWorkflowData.description}
                  className="w-full px-3 py-2 border rounded-md bg-white dark:bg-neutral-800 text-black dark:text-white"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-200 dark:bg-neutral-700 text-black dark:text-white"
                  onClick={() => {
                    setEditingWorkflowId(null);
                    setEditingWorkflowData(null);
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-orange-500 text-white font-semibold hover:bg-orange-600"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Componente de status do pagamento */}
      <PaymentStatus />
    </div>
  );
};

export default WorkflowList;
