import { Agent, AgentConfig, ExecutionResult } from '../types/agent';
import { cadastrarProduto } from '../handlers/productRegistrationHandler';

interface ApiRequestOptions {
  model: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  apiKey: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  content?: string;
  error?: string;
  usage?: {
    tokens: number;
    cost: number;
  };
}

/**
 * Função para limpar e validar a chave da API
 */
function sanitizeApiKey(apiKey: string): string {
  if (!apiKey) return '';
  
  // Verificação simples: se a chave já começa com sk-, apenas retorna
  if (apiKey.startsWith('sk-')) {
    return apiKey.trim();
  }
  
  // Se a chave não começa com sk-, mas contém sk-, extrair a parte válida
  if (apiKey.includes('sk-')) {
    const match = apiKey.match(/sk-[a-zA-Z0-9]+/);
    if (match && match[0]) {
      // Atualizar o localStorage com a chave correta
      try {
        const configStr = localStorage.getItem('ai-agents-config');
        if (configStr) {
          const config = JSON.parse(configStr);
          config.apiKey = match[0];
          localStorage.setItem('ai-agents-config', JSON.stringify(config));
          console.log('Chave da API corrigida e atualizada no localStorage');
        }
      } catch (e) {
        console.error('Erro ao atualizar localStorage:', e);
      }
      
      return match[0];
    }
  }
  
  return apiKey.trim();
}

/**
 * Serviço para comunicação com a API de IA
 */
export const apiService = {
  /**
   * Método PUT genérico para chamadas REST
   */
  put: async (url: string, body: any) => {
    try {
      const fullUrl = url.startsWith('http') ? url : `http://localhost:3001${url.startsWith('/') ? url : '/' + url}`;
      const response = await fetch(fullUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error('Erro na chamada PUT:', error);
      return { status: 500, data: null };
    }
  },

  /**
   * Método DELETE genérico para chamadas REST
   */
  delete: async (url: string) => {
    try {
      const fullUrl = url.startsWith('http') ? url : `http://localhost:3001${url.startsWith('/') ? url : '/' + url}`;
      const response = await fetch(fullUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  const data = response.status !== 204 ? await response.json() : null;
      return { status: response.status, data };
    } catch (error) {
      console.error('Erro na chamada DELETE:', error);
      return { status: 500, data: null };
    }
  },
  /**
   * Executa um agente com os inputs fornecidos
   */
  /**
   * Método GET genérico para chamadas REST
   */
  get: async (url: string) => {
    try {
      const fullUrl = url.startsWith('http') ? url : `http://localhost:3001${url.startsWith('/') ? url : '/' + url}`;
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error('Erro na chamada GET:', error);
      return { status: 500, data: null };
    }
  },

  /**
   * Método POST genérico para chamadas REST
   */
  post: async (url: string, body: any) => {
    try {
      const fullUrl = url.startsWith('http') ? url : `http://localhost:3001${url.startsWith('/') ? url : '/' + url}`;
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      return { status: response.status, data };
    } catch (error) {
      console.error('Erro na chamada POST:', error);
      return { status: 500, data: null };
    }
  },

  // ...método existente...
  executeAgent: async (
    agent: Agent,
    inputs: Record<string, any>,
    globalContext: Record<string, any>,
    config: AgentConfig
  ): Promise<ExecutionResult> => {
    try {
      // Verificar se o agente é o "Agente de Cadastro de Produtos"
      if (agent.name === 'Agente de Cadastro de Produtos') {
        console.log('Executando lógica de cadastro para o Agente de Cadastro de Produtos...');

        console.log('Iniciando execução do Agente de Cadastro de Produtos...');

        // Logar os inputs recebidos
        console.log('Inputs recebidos pelo agente:', inputs);

        // Ajustar o mapeamento dos inputs para garantir que os nomes corretos sejam utilizados
        const nome = inputs?.Nome || inputs?.undefined || '';
        const preco = inputs?.Preco || inputs?.input_1758331029437 || '';

        // Logar os inputs mapeados para depuração
        console.log('Inputs mapeados:');
        console.log('Nome:', nome);
        console.log('Preço:', preco);

        // Validar inputs
        const nomeProcessado = nome.trim();
        const precoProcessado = parseFloat(preco);

        console.log('Nome processado:', nomeProcessado);
        console.log('Preço processado:', precoProcessado);

        if (!nomeProcessado || isNaN(precoProcessado) || precoProcessado <= 0) {
          console.error('Erro: Nome ou Preço inválidos.');
          return {
            success: false,
            error: 'Nome e Preço são obrigatórios para o cadastro de produtos.'
          };
        }

        // Obter user_id do contexto global
        const userId = globalContext?.user?.id;
        
        if (!userId) {
          console.error('Erro: user_id não encontrado no contexto global.');
          return {
            success: false,
            error: 'Usuário não autenticado.'
          };
        }

        // Logar os dados enviados para o backend
        console.log('Dados enviados para o backend:', {
          nome_produto: nomeProcessado,
          preco_produto: precoProcessado,
          link_venda: '',
          user_id: userId
        });

        const response = await apiService.post('/api/products', {
          nome_produto: nomeProcessado,
          preco_produto: precoProcessado,
          link_venda: '', // Campo link_venda enviado como vazio
          user_id: userId
        });

        // Logar a resposta do backend
        console.log('Resposta completa do backend:', response);

        console.log('Dados retornados pelo backend:', response.data);

        if (!response.data || !response.data.id_produto || !response.data.nome_produto || !response.data.preco_produto) {
          console.error('Erro: Dados retornados pelo backend estão incompletos ou inválidos:', response.data);
          return {
            success: false,
            error: 'Dados retornados pelo backend estão incompletos ou inválidos.'
          };
        }

        // Preencher os outputs com os dados retornados pelo backend
        const { id_produto, nome_produto, preco_produto } = response.data;

        // Garantir que preco_produto seja um número
        const precoConvertido = parseFloat(preco_produto);

        if (isNaN(precoConvertido)) {
          console.error('Erro: O preço retornado pelo backend não é um número válido:', preco_produto);
          return {
            success: false,
            error: 'Preço retornado pelo backend é inválido.'
          };
        }

        // Logar os outputs antes de retornar
        console.log('Outputs gerados:', {
          Nome: nome_produto,
          Preco: precoConvertido,
          ID: id_produto
        });

        // Logar os valores dos outputs antes de retornar
        console.log('Preenchendo outputs com os dados retornados pelo backend:');
        console.log('ID do Produto:', id_produto);
        console.log('Nome do Produto:', nome_produto);
        console.log('Preço do Produto:', precoConvertido);

        console.log('--- Fim da execução do Agente de Cadastro de Produtos ---');

        return {
          success: true,
          outputs: {
            Nome: nome_produto,
            Preco: precoConvertido,
            ID: id_produto
          },
          usage: {
            tokens: 0,
            cost: 0
          }
        };
      }

      // Validar configurações para outros agentes
      if (!agent || !agent.template) {
        console.error('Erro: Agente ou template não definido');
        return {
          success: false,
          error: 'Configuração do agente inválida'
        };
      }

      // Preparar o prompt substituindo as variáveis
      let prompt = agent.template || '';
      
      // Função segura para substituir todas as ocorrências de uma string sem usar regex
      function replaceAll(text: string, search: string, replacement: string): string {
        // Método split e join é mais seguro que regex para casos especiais
        return text.split(search).join(replacement);
      }
      
      // Verificar se inputs é um objeto válido
      if (inputs && typeof inputs === 'object') {
        // Substituir variáveis de input no template
        for (const key in inputs) {
          if (inputs[key] !== undefined && inputs[key] !== null) {
            const placeholder = `{${key}}`;
            prompt = replaceAll(prompt, placeholder, String(inputs[key]));
          }
        }
      }
      
      // Verificar se globalContext é um objeto válido
      if (globalContext && typeof globalContext === 'object') {
        // Substituir variáveis de contexto global no template
        for (const key in globalContext) {
          if (globalContext[key] !== undefined && globalContext[key] !== null) {
            const placeholder = `{${key}}`;
            prompt = replaceAll(prompt, placeholder, String(globalContext[key]));
          }
        }
      }
      
      // Encontrar variáveis não substituídas usando uma abordagem mais segura
      const placeholderPattern = /\{([a-zA-Z0-9_]+)\}/g;
      let match;
      const unreplacedVars = [];
      let tempPrompt = prompt;
      
      // Usar exec para encontrar todas as correspondências
      while ((match = placeholderPattern.exec(tempPrompt)) !== null) {
        unreplacedVars.push(match[0]);
      }
      
      // Se houver variáveis não substituídas
      if (unreplacedVars.length > 0) {
        console.warn(`Variáveis não substituídas no prompt: ${unreplacedVars.join(', ')}`);
        
        // Substituir variáveis não substituídas por valores padrão ou vazios
        for (const varMatch of unreplacedVars) {
          const varName = varMatch.slice(1, -1); // Remove { e }
          
          // Procurar valor padrão nos inputs do agente
          const inputDef = agent.inputs?.find(input => input.id === varName);
          let defaultValue = inputDef?.defaultValue || '';
          
          // Para campos específicos, usar valores padrão mais apropriados
          if (varName === 'tom_voz' && !defaultValue) {
            defaultValue = 'profissional e persuasivo';
          } else if (varName === 'cores_marca' && !defaultValue) {
            defaultValue = 'azul e laranja';
          } else if (varName === 'quantidade' && !defaultValue) {
            defaultValue = '5';
          } else if (varName === 'estilo_headline' && !defaultValue) {
            defaultValue = 'persuasivo com benefício claro';
          }
          
          console.log(`Substituindo variável não preenchida ${varName} por valor padrão: ${defaultValue}`);
          prompt = replaceAll(prompt, varMatch, String(defaultValue));
        }
      }
      
      // Configurações da API
      const options: ApiRequestOptions = {
        model: config.model || 'gpt-4o',
        prompt,
        temperature: config.temperature || 0.7,
        maxTokens: config.maxTokens || 2000,
        apiKey: config.apiKey.trim() // Garantir que não há espaços extras
      };
      
      console.log(`Executando agente ${agent.name} com modelo ${options.model}`);
      
      // Chamar a API
      const response = await callApiEndpoint(options);
      
      // Verificar se a resposta é válida
      if (!response.success || !response.content) {
        throw new Error(response.error || 'Resposta da API inválida');
      }
      
      // Processar a resposta
      let output: any;
      
      // Se o tipo de saída esperado for JSON, tentar fazer parse
      const outputType = agent.outputs?.[0]?.type;
      const outputId = agent.outputs?.[0]?.id || 'content';
      
      if (outputType === 'json') {
        try {
          // Primeiro, procurar por um JSON completo na resposta
          const jsonRegex = /{[\s\S]*?"content":[\s\S]*?}/;
          const jsonMatch = response.content.match(jsonRegex);
          
          if (jsonMatch && jsonMatch[0]) {
            try {
              // Extrair o JSON encontrado na resposta
              output = JSON.parse(jsonMatch[0]);
              console.log('JSON encontrado na resposta e extraído com sucesso');
            } catch (parseError) {
              console.warn('Erro ao fazer parse do primeiro padrão JSON:', parseError);
              // Continuar para a próxima tentativa
            }
          }
          
          // Se não encontrou ou não conseguiu fazer parse, tentar extrair de blocos de código
          if (!output) {
            const codeBlockMatch = response.content.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
            if (codeBlockMatch && codeBlockMatch[1]) {
              try {
                const cleanedJson = codeBlockMatch[1].trim();
                output = JSON.parse(cleanedJson);
                console.log('JSON extraído de bloco de código com sucesso');
              } catch (parseError) {
                console.warn('Erro ao fazer parse do bloco de código JSON:', parseError);
                // Continuar para a próxima tentativa
              }
            }
          }
          
          // Função para tentar limpar e corrigir JSON malformado
          function attemptToFixJson(jsonString: string): string {
            try {
              // Remover comentários que podem estar presentes
              let cleaned = jsonString.replace(/\/\/.*?\n|\/\*.*?\*\//g, '');
              
              // Verificar e corrigir vírgulas extras ou faltantes
              cleaned = cleaned.replace(/,\s*([\]\}])/g, '$1'); // Remove vírgulas antes de ] ou }
              
              // Corrigir vírgulas faltantes entre propriedades
              cleaned = cleaned.replace(/"\s*}\s*"\s*:/g, '","'); // Corrige "} ":
              cleaned = cleaned.replace(/"\s*]\s*"\s*:/g, '","'); // Corrige "] ":
              
              // Verificar aspas em propriedades
              cleaned = cleaned.replace(/(\w+)\s*:/g, '"$1":'); // Adiciona aspas em nomes de propriedades sem aspas
              
              // Corrigir valores booleanos ou nulos sem aspas
              cleaned = cleaned.replace(/:\s*(['"])?(true|false|null)(['"])?/gi, function(match, q1, value, q2) {
                if (q1 || q2) return match; // Se já tem aspas, não mexe
                return ': ' + value.toLowerCase(); // Sem aspas para booleanos e null
              });
              
              // Corrigir strings sem aspas (exceto booleanos e null)
              cleaned = cleaned.replace(/:\s*([^\s\{\}\[\],"'0-9true\\false\\null][^\{\}\[\],]*)/gi, 
                function(match, value) {
                  // Se o valor não é booleano ou null, adicionar aspas
                  if (!['true', 'false', 'null'].includes(value.trim().toLowerCase())) {
                    return ': "' + value.trim() + '"';
                  }
                  return match;
                }
              );
              
              // Verificar se há chaves não fechadas
              const openBraces = (cleaned.match(/{/g) || []).length;
              const closeBraces = (cleaned.match(/}/g) || []).length;
              
              // Se há mais chaves abertas que fechadas, adicionar as chaves faltantes
              if (openBraces > closeBraces) {
                const missingBraces = openBraces - closeBraces;
                cleaned += '}'.repeat(missingBraces);
                console.log(`Adicionadas ${missingBraces} chaves de fechamento faltantes`);
              }
              
              // Verificar se há colchetes não fechados
              const openBrackets = (cleaned.match(/\[/g) || []).length;
              const closeBrackets = (cleaned.match(/\]/g) || []).length;
              
              // Se há mais colchetes abertos que fechados, adicionar os colchetes faltantes
              if (openBrackets > closeBrackets) {
                const missingBrackets = openBrackets - closeBrackets;
                cleaned += ']'.repeat(missingBrackets);
                console.log(`Adicionados ${missingBrackets} colchetes de fechamento faltantes`);
              }
              
              // Tentativa final: usar uma abordagem mais agressiva se ainda houver problemas
              try {
                JSON.parse(cleaned);
              } catch (parseError) {
                console.warn('Ainda há problemas com o JSON após correções iniciais:', parseError);
                
                // Tentar uma abordagem mais agressiva: remover linhas problemáticas
                const lines = cleaned.split('\n');
                let validLines = [];
                
                for (let i = 0; i < lines.length; i++) {
                  const testJson = [...validLines, lines[i]].join('\n');
                  try {
                    // Tentar adicionar chaves de fechamento para tornar o JSON válido
                    const openCount = (testJson.match(/{/g) || []).length;
                    const closeCount = (testJson.match(/}/g) || []).length;
                    const testWithClosing = testJson + '}'.repeat(Math.max(0, openCount - closeCount));
                    
                    JSON.parse(testWithClosing);
                    validLines.push(lines[i]);
                  } catch (e) {
                    console.warn(`Linha ${i + 1} parece problemática, tentando pular:`, lines[i]);
                    // Se a linha parece ser uma chave de fechamento, manté-la
                    if (lines[i].trim() === '}' || lines[i].trim() === '},') {
                      validLines.push(lines[i]);
                    }
                  }
                }
                
                if (validLines.length < lines.length) {
                  console.log(`Removidas ${lines.length - validLines.length} linhas problemáticas`);
                  cleaned = validLines.join('\n');
                  
                  // Verificar novamente se há chaves não fechadas
                  const finalOpenBraces = (cleaned.match(/{/g) || []).length;
                  const finalCloseBraces = (cleaned.match(/}/g) || []).length;
                  
                  if (finalOpenBraces > finalCloseBraces) {
                    cleaned += '}'.repeat(finalOpenBraces - finalCloseBraces);
                  }
                }
              }
              
              return cleaned;
            } catch (e) {
              console.warn('Erro ao tentar corrigir JSON:', e);
              return jsonString; // Retorna o original se falhar
            }
          }

          // Tentar encontrar qualquer conteúdo entre chaves
          if (!output) {
            const bracesMatch = response.content.match(/{[\s\S]*?}/); 
            
            if (bracesMatch && bracesMatch[0]) {
              try {
                // Primeiro tenta com o JSON original
                const cleanedJson = bracesMatch[0].trim();
                try {
                  output = JSON.parse(cleanedJson);
                  console.log('JSON extraído de conteúdo entre chaves com sucesso');
                } catch (initialError) {
                  // Se falhar, tenta corrigir o JSON
                  console.warn('Erro inicial ao fazer parse do JSON:', initialError);
                  console.log('Tentando corrigir o JSON malformado...');
                  
                  const fixedJson = attemptToFixJson(cleanedJson);
                  console.log('JSON corrigido:', fixedJson);
                  output = JSON.parse(fixedJson);
                  console.log('JSON corrigido parseado com sucesso');
                }
              } catch (parseError) {
                console.error('Erro ao fazer parse do conteúdo entre chaves mesmo após correção:', parseError);
                console.error('JSON problemático:', bracesMatch[0]);
              }
            }
          }
          
          // Tentativa adicional: procurar por arrays JSON
          if (!output) {
            const arrayMatch = response.content.match(/\[[\s\S]*?\]/);
            if (arrayMatch && arrayMatch[0]) {
              try {
                const cleanedJson = arrayMatch[0].trim();
                output = JSON.parse(cleanedJson);
                console.log('Array JSON extraído com sucesso');
              } catch (parseError) {
                console.warn('Erro ao fazer parse do array JSON:', parseError);
              }
            }
          }
          
          // Se ainda não tiver output, tentar limpar a resposta e fazer parse novamente
          if (!output) {
            try {
              // Remover caracteres não-JSON e tentar novamente
              const cleanedContent = response.content
                .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remover caracteres de controle
                .replace(/[\n\r\t]/g, ' ')                     // Substituir quebras de linha por espaços
                .replace(/\s+/g, ' ')                         // Normalizar espaços
                .trim();
                
              // Procurar pelo primeiro { e último }
              const firstBrace = cleanedContent.indexOf('{');
              const lastBrace = cleanedContent.lastIndexOf('}');
              
              if (firstBrace !== -1 && lastBrace !== -1 && firstBrace < lastBrace) {
                const jsonCandidate = cleanedContent.substring(firstBrace, lastBrace + 1);
                output = JSON.parse(jsonCandidate);
                console.log('JSON extraído após limpeza da resposta');
              }
            } catch (parseError) {
              console.warn('Erro ao fazer parse após limpeza da resposta:', parseError);
            }
          }
          
          // Se ainda não conseguiu extrair JSON, criar um objeto simples com a resposta
          if (!output) {
            console.warn('Não foi possível extrair JSON válido. Criando objeto simples com a resposta.');
            output = { content: response.content };
          }
          
          // Garantir que a saída tenha o formato esperado
          if (agent.type === 'project-setup' && !output.hasOwnProperty(outputId)) {
            output = { [outputId]: output };
          }
        } catch (error) {
          console.warn('Erro ao fazer parse do JSON da resposta:', error);
          console.log('Conteúdo da resposta:', response.content);
          
          // Se não conseguir fazer parse, usar os dados originais do formulário
          if (agent.type === 'project-setup') {
            // Usar APENAS os dados reais preenchidos pelo usuário
            output = {
              [outputId]: {
                produto: inputs.produto,
                nicho: inputs.nicho,
                publico_alvo: inputs.publico_alvo,
                dores_principais: inputs.dores_principais,
                beneficios_principais: inputs.beneficios_principais,
                preco: inputs.preco,
                tom_voz: inputs.tom_voz,
                cores_marca: inputs.cores_marca
              }
            };
            console.log('Usando dados do formulário para o agente project-setup');
          } else {
            // Para outros agentes, usar a resposta como texto
            output = { [outputId]: response.content };
            console.log('Usando resposta como texto para o agente', agent.type);
          }
        }
      } else {
        // Para outros tipos de saída, usar a resposta como texto
        output = { [outputId]: response.content };
      }
      
      return {
        success: true,
        outputs: output,
        usage: response.usage
      };
    } catch (error) {
      console.error('Erro ao executar agente:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
};

/**
 * Função para chamar a API de IA
 */
async function callApiEndpoint(options: ApiRequestOptions): Promise<ApiResponse> {
  try {
    // Validação da chave da API
    if (!options.apiKey || typeof options.apiKey !== 'string') {
      throw new Error('API Key não configurada');
    }
    
    // Usar a chave diretamente como foi fornecida
    const apiKey = options.apiKey.trim();
    
    console.log(`Chamando API com modelo: ${options.model}`);
    console.log(`Formato da chave API: ${apiKey.substring(0, 5)}...${apiKey.substring(apiKey.length - 4)}`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: options.model,
        messages: [
          { role: 'system', content: 'Você é um assistente especializado em marketing e criação de conteúdo.' },
          { role: 'user', content: options.prompt }
        ],
        temperature: options.temperature,
        max_tokens: options.maxTokens
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Erro na resposta da API:', errorData);
      throw new Error(errorData.error?.message || `Erro na API: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Processar a resposta da API
    const content = data.choices[0].message.content;
    let parsedContent: any;
    
    try {
      // Tentar analisar como JSON se possível
      parsedContent = JSON.parse(content);
    } catch {
      // Se não for JSON, usar como texto
      parsedContent = { content };
    }
    
    return {
      success: true,
      data: parsedContent,
      content: content, // Adicionar o conteúdo bruto da resposta
      usage: {
        tokens: data.usage.total_tokens,
        cost: calculateCost(data.usage.total_tokens, options.model)
      }
    };
  } catch (error) {
    console.error('Erro na chamada da API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * Calcula o custo aproximado com base nos tokens e modelo
 */
function calculateCost(tokens: number, model: string): number {
  // Valores aproximados por 1000 tokens
  const rates: Record<string, number> = {
    'gpt-4o': 0.01,
    'gpt-4': 0.03,
    'gpt-3.5-turbo': 0.001
  };
  
  const rate = rates[model] || 0.01;
  return (tokens / 1000) * rate;
}
