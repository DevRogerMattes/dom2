// Serviço de autenticação Node.js/Express usando PostgreSQL e bcrypt
import express from 'express';
import bcrypt from 'bcryptjs';
import pool from './pgClient.ts';

const router = express.Router();

// Loga dados de conexão reais do pool
const config = pool.options || pool; // compatível com pg
console.log(`Tentando conectar ao banco com usuário: ${config.user}, senha: ${config.password}, banco: ${config.database}, host: ${config.host}, porta: ${config.port}`);

// Testa conexão ao iniciar
pool.connect()
  .then(client => {
    console.log('✅ Conectado ao banco de dados PostgreSQL!');
    client.release();
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao banco de dados:', err);
  });

// Cadastro de usuário
router.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios.' });
  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email, hash, name || null]
    );
    console.log('✅ Usuário cadastrado:', result.rows[0]);
    return res.json({ user: result.rows[0] });
  } catch (err) {
    console.error('❌ Erro ao cadastrar usuário:', err);
    if (err.code === '23505') return res.status(409).json({ error: 'Email já cadastrado.' });
    return res.status(500).json({ error: 'Erro ao cadastrar usuário.', details: err.message });
  }
});

// Login de usuário
router.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email e senha obrigatórios.' });
  try {
    const result = await pool.query('SELECT id, email, name, created_at, theme, password_hash FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    console.log('Usuário encontrado no banco de dados:', user); // Log para verificar o usuário retornado
    if (!user) return res.status(401).json({ error: 'Usuário não encontrado.' });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Senha incorreta.' });
    // Retorne apenas dados seguros
    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at,
      theme: user.theme
    };
    console.log('Usuário retornado na resposta:', safeUser); // Log para verificar o usuário retornado na resposta
    return res.json({ user: safeUser });
  } catch (err) {
    console.error('Erro ao autenticar usuário:', err); // Log para erros
    return res.status(500).json({ error: 'Erro ao autenticar.' });
  }
});

// Logout (simples, frontend remove o usuário do localStorage)
router.post('/api/auth/logout', (req, res) => {
  // Se usar JWT, pode invalidar o token aqui
  return res.json({ success: true });
});

export default router;
