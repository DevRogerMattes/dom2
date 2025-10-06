import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authService from './services/authService';
import apiConfigurationService from './services/apiConfigurationService';
import agentsApi from './services/agentsApi';
import workflowService from './services/workflowService';
import userService from './services/apiConfigurationService';
import productsRoutes from './routes/productsRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import stripeRoutes from './routes/stripeRoutes';
import stripeWebhooks from './routes/stripeWebhooks';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Webhook do Stripe precisa vir ANTES do express.json() para receber raw body
app.use('/api/stripe', stripeWebhooks);

app.use(express.json());

// Rotas de autenticação
app.use(authService);
// Rotas de configuração de API
app.use(apiConfigurationService);
// Rotas de agentes
app.use(agentsApi);
// Rotas de workflows
app.use(workflowService);
// Rotas de usuários
app.use(userService);
// Rotas de produtos
app.use(productsRoutes);
// Rotas de assinaturas
app.use(subscriptionRoutes);
// Rotas do Stripe
app.use(stripeRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API Domius rodando!');
});

// Rota para testar tabelas
app.get('/api/test-db', async (req, res) => {
  try {
    const pool = (await import('./services/pgClient.ts')).default;
    
    // Verificar tabelas existentes
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    // Verificar estrutura da tabela user_subscriptions
    const userSubsStructure = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'user_subscriptions'
      ORDER BY ordinal_position
    `);
    
    res.json({
      tables: tables.rows,
      user_subscriptions_structure: userSubsStructure.rows
    });
  } catch (error) {
    console.error('Erro ao testar DB:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rota para tratar 404
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// Tratamento global de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
