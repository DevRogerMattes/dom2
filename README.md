# Domius - Editor Visual de Fluxos de Trabalho para Agentes de IA

## Visão Geral

Domius é uma aplicação web que permite criar e gerenciar fluxos de trabalho visuais para agentes de IA. A plataforma permite aos usuários arrastar e conectar diferentes tipos de agentes especializados em um canvas interativo, configurar suas propriedades e executar o fluxo para obter resultados automatizados.

## Tecnologias Utilizadas

### Core

- **React**: Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript**: Superset tipado de JavaScript
- **Vite**: Bundler e ferramenta de desenvolvimento

### UI/UX

- **Tailwind CSS**: Framework CSS utilitário
- **shadcn/ui**: Componentes de UI baseados em Radix UI
- **lucide-react**: Ícones modernos para React

### Gerenciamento de Estado

- **Zustand**: Biblioteca leve para gerenciamento de estado

### Fluxo de Trabalho

- **@xyflow/react**: Biblioteca para criação de fluxos de trabalho interativos (anteriormente react-flow)

### Formulários

- **react-hook-form**: Biblioteca para gerenciamento de formulários
- **zod**: Biblioteca de validação de esquemas

## Estrutura do Projeto

```
src/
├── components/         # Componentes React
│   ├── ui/             # Componentes de UI reutilizáveis
│   ├── AgentNode.tsx   # Nó de agente no fluxo
│   ├── ResultNode.tsx  # Nó de resultado no fluxo
│   └── ...
├── data/              # Dados estáticos
│   └── agents.ts      # Definição dos agentes disponíveis
├── hooks/             # Hooks personalizados
├── lib/               # Utilitários e funções auxiliares
├── pages/             # Componentes de página
│   └── Index.tsx      # Página principal
├── stores/            # Gerenciamento de estado
│   └── workflowStore.ts # Store principal do workflow
├── types/             # Definições de tipos
│   └── agent.ts       # Tipos relacionados aos agentes
└── main.tsx          # Ponto de entrada da aplicação
```

## Componentes Principais

### WorkflowCanvas

O canvas principal onde os agentes são posicionados e conectados. Construído com @xyflow/react, permite arrastar e soltar agentes, criar conexões entre eles e visualizar o fluxo de trabalho.

**Funcionalidades:**

- Arrastar e soltar agentes
- Conexões automáticas
- Visualização de fluxo
- Minimap para navegação
- Controles de zoom e pan

### AgentNode

Representa um agente no canvas com suas propriedades e estado.

**Propriedades:**

- Tipo de agente
- Entradas e saídas
- Estado de execução (idle, processing, completed, error)
- Menu de contexto para ações

### Sidebar

Barra lateral que mostra os agentes disponíveis que podem ser arrastados para o canvas.

**Funcionalidades:**

- Lista de agentes por categoria
- Pesquisa de agentes
- Filtro por categoria
- Arrastar e soltar para o canvas

### PropertyPanel

Painel lateral para configurar as propriedades de um agente selecionado.

**Funcionalidades:**

- Edição de entradas do agente
- Visualização de saídas
- Configuração de parâmetros específicos
- Visualização de erros

### TopBar

Barra superior com controles para executar o fluxo e outras ações.

**Funcionalidades:**

- Executar workflow
- Salvar workflow
- Resetar execução
- Status de execução

### ConfigurationDialog

Modal para configurações globais da aplicação.

**Configurações:**

- Chave da API OpenAI
- Modelo de IA a ser usado

## Tipos de Agentes

O sistema suporta vários tipos de agentes especializados em diferentes tarefas:

1. **Setup**: Agente principal que define o contexto global do projeto
2. **Copywriting**: Agentes para geração de textos e conteúdos
3. **Design**: Agentes para tarefas relacionadas a design
4. **Infoproduct**: Agentes para criação de infoprodutos
5. **SEO**: Agentes para otimização para motores de busca
6. **Document**: Agentes para manipulação de documentos
7. **Sales**: Agentes para criação de conteúdo de vendas

## Fluxo de Trabalho

1. O usuário inicia com um agente principal (Setup) no canvas
2. Arrasta outros agentes da barra lateral para o canvas
3. Os agentes são conectados automaticamente ao agente principal
4. O usuário configura as propriedades de cada agente
5. O fluxo pode ser executado, com os dados fluindo de um agente para outro
6. Os resultados são exibidos nos nós e no painel de propriedades

## Gerenciamento de Estado

O estado é gerenciado com Zustand, com o `workflowStore` controlando:

- Nós e arestas do fluxo
- Agentes disponíveis
- Workflows salvos
- Estado de execução
- Configurações globais

## Execução de Fluxos

A execução de fluxos segue estas etapas:

1. Determina a ordem de execução dos agentes (ordenação topológica)
2. Executa cada agente na ordem determinada
3. Passa os outputs de um agente como inputs para os agentes conectados
4. Atualiza o estado de execução de cada agente
5. Compila os resultados finais

## Persistência de Dados

Os workflows são salvos no localStorage do navegador, permitindo que o usuário retorne ao seu trabalho posteriormente.

## Instalação e Execução

```bash
# Instalar dependências
npm install

# Executar em modo de desenvolvimento
npm run dev

# Construir para produção
npm run build

# Visualizar build de produção
npm run preview
```

## Requisitos

- Node.js 18+ recomendado
- Navegador moderno com suporte a ES6+
- Chave de API da OpenAI para funcionalidades completas

## Configuração

Para configurar a aplicação:

1. Clique no botão "Configurações" na barra lateral
2. Insira sua chave de API da OpenAI
3. Selecione o modelo de IA preferido

## Próximos Passos

- Integração com mais provedores de IA
- Exportação e importação de workflows
- Colaboração em tempo real
- Histórico de versões
- Marketplace de agentes personalizados

---

© 2025 Domius - Todos os direitos reservados
