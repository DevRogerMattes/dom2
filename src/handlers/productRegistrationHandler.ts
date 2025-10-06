import { agentMiddleware } from "../middleware/agentMiddleware";

// Function to register a product in the system
async function cadastrarProduto(produto: { nome: string; preco: number }): Promise<void> {
  console.log(`Cadastrando produto: ${produto.nome} com preço ${produto.preco}`);
  console.log('Conectando ao banco de dados...');
  console.log('Dados do produto recebidos:', produto);

  try {
    if (typeof window !== "undefined") {
      throw new Error("pgClient não pode ser usado no frontend.");
    }

    const { default: pool } = await import('../services/pgClient');

    if (!pool) {
      throw new Error('pgClient não está disponível no ambiente atual.');
    }

    const query = `
      INSERT INTO products (nome, preco)
      VALUES ($1, $2)
      RETURNING id;
    `;
    const values = [produto.nome, produto.preco];

    console.log('Executando query:', query);
    console.log('Valores:', values);

    const result = await pool.query(query, values);
    console.log(`Produto salvo com sucesso. ID: ${result.rows[0].id}`);
  } catch (error) {
    console.error('Erro ao salvar o produto no banco de dados:', error);
  }
}

// Handler to process agent responses containing product data
const productRegistrationHandler = async (response: Record<string, any>): Promise<void> => {
  if (response.Nome && response.Preco) {
    const produto = {
      nome: response.Nome,
      preco: parseFloat(response.Preco),
    };
    // Adicionar logs detalhados para depuração
    console.log('Dados recebidos pelo handler:', { nome: produto.nome, preco: produto.preco });

    try {
      console.log('Chamando a função cadastrarProduto...');
      await cadastrarProduto(produto);
      console.log('Produto cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao cadastrar produto:', error);
    }
  } else {
    console.warn("Dados do produto incompletos ou inválidos no response.");
  }
};

// Register the handler for the relevant agent
agentMiddleware.registerHandler("productAgent", productRegistrationHandler);

export { productRegistrationHandler, cadastrarProduto };