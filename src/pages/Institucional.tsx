
import { useNavigate } from "react-router-dom";
import { Play, ArrowRight, Check, Star, Users, Zap, Target, TrendingUp, Shield, Clock, ChevronDown, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { loadStripe } from '@stripe/stripe-js';
import { buildApiUrl } from '../config/api';

// Definir o tipo SubscriptionPlan localmente
interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number | null;
  price_yearly: number | null;
  currency: string;
  billing_cycle: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  is_active: boolean;
  is_highlighted: boolean;
  display_order: number;
  badge_text: string | null;
  stripe_price_id: string | null;
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Verificar se o Stripe carregou corretamente
stripePromise.then(stripe => {
  if (stripe) {
    console.log('✅ Stripe carregou com sucesso');
  } else {
    console.error('❌ Falha ao carregar Stripe');
  }
});

function Institucional() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    async function loadPlans() {
      try {
        const response = await fetch(buildApiUrl('subscription-plans'));
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        const activePlans = await response.json();
        console.log('Plans loaded:', activePlans); // Debug log
        setPlans(activePlans);
      } catch (error) {
        console.error('Error loading plans:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    try {
      console.log('handleSubscribe called with plan:', plan);
      
      if (!plan.stripe_price_id) {
        console.error('Plan does not have a Stripe Price ID:', plan);
        alert('Erro: Plano não tem Price ID configurado');
        return;
      }

      console.log('Loading Stripe...');
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe failed to load');
        alert('Erro: Falha ao carregar Stripe');
        return;
      }

      console.log('Stripe loaded successfully. Creating checkout session:', {
        priceId: plan.stripe_price_id,
        planName: plan.name
      });

      // Criar sessão de checkout no backend primeiro
      const response = await fetch(buildApiUrl('stripe/create-public-session'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.stripe_price_id,
          planName: plan.name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao criar sessão de checkout');
      }

      const { sessionId } = await response.json();
      console.log('Session created:', sessionId);

      // Redirecionar para checkout usando sessionId
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId,
      });

      if (error) {
        console.error('Error redirecting to checkout:', error);
        alert(`Erro do Stripe: ${error.message}`);
      }
    } catch (error: any) {
      console.error('Error in handleSubscribe:', error);
      alert(`Erro ao processar pagamento: ${error.message || error}`);
    }
  };

  const scrollToPlans = () => {
    // Scroll suave até a seção de planos
    const plansSection = document.getElementById('plans-section');
    if (plansSection) {
      plansSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const formatPrice = (plan: SubscriptionPlan) => {
    if (plan.billing_cycle === 'monthly' && plan.price_monthly) {
      const price = Number(plan.price_monthly);
      if (isNaN(price)) return 'Consulte';
      return `R$ ${price.toFixed(0)}`;
    }
    if (plan.billing_cycle === 'yearly' && plan.price_yearly) {
      const yearlyPrice = Number(plan.price_yearly);
      if (isNaN(yearlyPrice)) return 'Consulte';
      const monthlyEquivalent = yearlyPrice / 12;
      return `R$ ${monthlyEquivalent.toFixed(0)}`;
    }
    return 'Consulte';
  };

  const getPriceSuffix = (plan: SubscriptionPlan) => {
    return plan.billing_cycle === 'yearly' ? '/mês' : '/mês';
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">⚡</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Domius
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#recursos" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Recursos</a>
            <a href="#como-funciona" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Como Funciona</a>
            <a href="#precos" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Preços</a>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/auth')}
                className="text-gray-600 hover:text-orange-600 font-semibold transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => scrollToPlans()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
              >
                Começar Agora
              </button>
            </div>
          </nav>
          
          {/* Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-orange-600 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        
        {/* Menu Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              <a 
                href="#recursos" 
                className="block text-gray-600 hover:text-orange-600 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Recursos
              </a>
              <a 
                href="#como-funciona" 
                className="block text-gray-600 hover:text-orange-600 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Como Funciona
              </a>
              <a 
                href="#precos" 
                className="block text-gray-600 hover:text-orange-600 font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preços
              </a>
              <div className="border-t border-gray-100 pt-4 space-y-3">
                <button 
                  onClick={() => {
                    navigate('/auth');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-600 hover:text-orange-600 font-semibold transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    scrollToPlans();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors text-center"
                >
                  Começar Agora
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 bg-gradient-to-br from-gray-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 leading-tight mb-6">
              Transforme Suas Ideias em
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent block mt-2">
                Máquinas de Vendas
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed">
              A primeira plataforma que une <strong>Inteligência Artificial</strong>, <strong>Automação de Marketing</strong> 
              e <strong>Criação de Conteúdo</strong> em um só lugar. Pare de usar 10 ferramentas diferentes.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={() => scrollToPlans()}
                className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-4 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <Zap className="w-5 h-5" />
                Adquira Agora
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-600 text-lg px-8 py-4 rounded-xl font-semibold flex items-center gap-2 transition-all">
                <Play className="w-5 h-5" />
                Assistir Demo (2 min)
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span>4.9/5 de satisfação</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>+2.847 empresários usando</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>387% de aumento médio em vendas</span>
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="max-w-5xl mx-auto">
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden">
              <div className="aspect-video bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-orange-600 transition-colors">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-white text-lg">Veja o Domius em Ação</p>
                  <p className="text-gray-400">Demonstração completa em 2 minutos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
            Cansado de Usar 10 Ferramentas Diferentes?
          </h2>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: "😤", title: "Ferramentas Espalhadas", desc: "WordPress, Mailchimp, Canva, ChatGPT, Zapier... Perdendo tempo e dinheiro" },
              { icon: "⏰", title: "Tempo Perdido", desc: "Horas copiando e colando entre plataformas que não conversam entre si" },
              { icon: "💸", title: "Custos Altos", desc: "R$ 500+ por mês em assinaturas de ferramentas que fazem a metade do que precisa" }
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-orange-500 text-white rounded-xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-4">⚡ E se você pudesse fazer tudo em um só lugar?</h3>
            <p className="text-lg opacity-90">Workflows de IA, criação de conteúdo, páginas de venda, automação de email... TUDO integrado!</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tudo Que Você Precisa Para
              <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent block">
                Dominar o Mercado Digital
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pare de perder tempo com ferramentas que não conversam entre si. 
              O Domius centraliza tudo que você precisa em uma plataforma inteligente.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Workflows de IA Visuais",
                description: "Conecte agentes de inteligência artificial como blocos de Lego. Crie automações complexas sem código.",
                features: ["Drag & Drop intuitivo", "Agentes especializados", "Automação completa"]
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Criação de Conteúdo IA",
                description: "Gere headlines, copy de vendas, e-mails, scripts e muito mais com IA treinada para converter.",
                features: ["Templates prontos", "Copy persuasivo", "Headlines que vendem"]
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Páginas de Alta Conversão",
                description: "Crie landing pages, páginas de vendas e checkout que realmente convertem visitantes em clientes.",
                features: ["Editor visual", "Templates otimizados", "Integração pagamentos"]
              }
            ].map((feature, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="bg-orange-500 text-white w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.features.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-gray-600">
                      <Check className="w-4 h-4 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-16 px-4 bg-gradient-to-br from-orange-50 to-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Como Funciona o Domius?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Em 3 passos simples, você transforma sua estratégia de marketing em uma máquina automatizada de vendas.
            </p>
          </div>

          <div className="space-y-16">
            {[
              {
                step: "01",
                title: "Configure Seus Workflows",
                description: "Arraste e solte agentes de IA para criar automações personalizadas. Como montar um quebra-cabeça, mas cada peça faz dinheiro para você.",
                image: "🧩"
              },
              {
                step: "02", 
                title: "A IA Trabalha Para Você",
                description: "Seus workflows criam automaticamente headlines, textos de vendas, e-mails, imagens e páginas otimizadas para conversão.",
                image: "🤖"
              },
              {
                step: "03",
                title: "Resultados Automáticos",
                description: "Publique, lance e venda. Enquanto você dorme, seus workflows estão trabalhando para gerar leads e vendas 24/7.",
                image: "💰"
              }
            ].map((step, i) => (
              <div key={i} className={`flex flex-col ${i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12`}>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="bg-orange-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{step.title}</h3>
                  </div>
                  <p className="text-lg text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="w-64 h-64 bg-white rounded-2xl shadow-lg flex items-center justify-center text-8xl">
                    {step.image}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Resultados Reais de Quem Usa o Domius
            </h2>
            <p className="text-xl text-gray-600">
              Veja como empresários estão transformando seus negócios com automação inteligente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marina Silva",
                business: "Consultora Digital",
                result: "+320% em vendas",
                quote: "Em 2 meses usando o Domius, automatizei todo meu funil de vendas. O que levava 8 horas por semana agora roda sozinho.",
                avatar: "👩‍💼"
              },
              {
                name: "Carlos Santos", 
                business: "Coach de Negócios",
                result: "+150 leads/mês",
                quote: "Criei 5 landing pages em uma tarde. Antes levava semanas para fazer uma. O ROI foi de mais de 800% no primeiro mês.",
                avatar: "👨‍💼"
              },
              {
                name: "Ana Costa",
                business: "E-commerce",
                result: "R$ 45k em 30 dias",
                quote: "As automações do Domius me deram tempo para focar na estratégia. Resultado: o maior faturamento da história da empresa.",
                avatar: "👩‍🚀"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-2xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.business}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.quote}"</p>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-bold text-center">
                  {testimonial.result}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="plans-section" className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Preços Honestos, Sem Pegadinhas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Menos de 1% do que você gastaria com várias ferramentas separadas. 
              Cancele quando quiser, sem burocracia.
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="mt-2 text-gray-600">Carregando planos...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {plans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`rounded-2xl p-8 relative transition-all duration-300 ${
                    plan.is_highlighted 
                      ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transform hover:-translate-y-1' 
                      : 'bg-white hover:shadow-lg'
                  }`}
                >
                  {plan.badge_text && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold">
                      {plan.badge_text}
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className={`text-2xl font-bold mb-2 ${plan.is_highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline justify-center mb-4">
                      <span className={`text-5xl font-black ${plan.is_highlighted ? 'text-white' : 'text-gray-900'}`}>
                        {formatPrice(plan)}
                      </span>
                      <span className={`ml-2 ${plan.is_highlighted ? 'text-orange-200' : 'text-gray-600'}`}>
                        {getPriceSuffix(plan)}
                      </span>
                    </div>
                    {plan.billing_cycle === 'yearly' && (
                      <div className="bg-green-400 text-gray-900 px-3 py-1 rounded-lg text-sm font-bold inline-block mb-2">
                        Economize R$ 360/ano
                      </div>
                    )}
                    <p className={plan.is_highlighted ? 'text-orange-200' : 'text-gray-600'}>
                      {plan.description}
                    </p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <Check className={`w-5 h-5 ${plan.is_highlighted ? 'text-orange-200' : 'text-green-500'}`} />
                        <span className={plan.is_highlighted ? 'text-white' : 'text-gray-700'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => handleSubscribe(plan)}
                    className={`w-full font-bold py-4 rounded-xl transition-colors ${
                      plan.is_highlighted 
                        ? 'bg-white text-orange-600 hover:bg-gray-100' 
                        : 'bg-orange-500 text-white hover:bg-orange-600'
                    }`}
                  >
                    {plan.billing_cycle === 'yearly' ? 'Quero Desconto! 🔥' : 'Adquira Agora'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Money Back Guarantee */}
          <div className="text-center mt-12">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Shield className="w-8 h-8 text-green-600" />
                <h4 className="text-xl font-bold text-green-800">Garantia de 30 Dias</h4>
              </div>
              <p className="text-green-700">
                Não gostou? Devolvemos 100% do seu dinheiro, sem perguntas, sem burocracia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Tire suas dúvidas sobre o Domius
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: "Preciso de conhecimento técnico para usar?",
                answer: "Não! O Domius foi desenvolvido para ser 100% visual e intuitivo. Se você sabe usar WhatsApp, vai conseguir criar workflows incríveis no Domius."
              },
              {
                question: "Como funciona a integração com IA?",
                answer: "Você conecta sua chave da OpenAI e nossos agentes especializados fazem o trabalho pesado. Criação de textos, headlines, imagens e muito mais, tudo automatizado."
              },
              {
                question: "Posso cancelar quando quiser?",
                answer: "Sim! Não temos fidelidade. Você pode cancelar a qualquer momento com apenas um clique. Sem burocracia, sem taxa de cancelamento."
              },
              {
                question: "Tem limite de workflows?",
                answer: "Não! Você pode criar quantos workflows quiser, conectar quantos agentes precisar. Sem limites artificiais para segurar seu crescimento."
              },
              {
                question: "Funciona para qualquer nicho?",
                answer: "Sim! Temos templates e agentes para consultores, coaches, infoprodutores, e-commerce, agências e muito mais. Se vende online, o Domius funciona."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl shadow-sm border border-gray-100">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-100 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto Para Transformar Suas Vendas?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Junte-se a mais de 2.847 empresários que já estão usando o Domius 
            para automatizar seus negócios e vender mais.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button 
              onClick={() => scrollToPlans()}
              className="bg-white text-orange-600 text-lg px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2 shadow-lg"
            >
              <Zap className="w-5 h-5" />
              Adquira Agora
            </button>
            <button className="border-2 border-white/30 text-white text-lg px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Sem Cartão de Crédito
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              <span>Garantia 30 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>+2.847 usuários</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
              <span>4.9/5 satisfação</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">⚡</span>
              </div>
              <span className="text-2xl font-bold text-white">Domius</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm">
              <span>© 2025 Domius. Todos os direitos reservados.</span>
              <div className="flex gap-6">
                <a href="#" className="hover:text-orange-400 transition-colors">Termos de Uso</a>
                <a href="#" className="hover:text-orange-400 transition-colors">Privacidade</a>
                <a href="#" className="hover:text-orange-400 transition-colors">Suporte</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Institucional;
