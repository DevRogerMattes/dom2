// Endpoint REST para configuração de API (OpenAI)
import express from 'express';
import poolPromise from './pgClient.ts';

const router = express.Router();

(async () => {
  const pool = await poolPromise;

  if (!pool) {
    console.error('❌ pgClient não foi inicializado corretamente.');
    return;
  }

  // Buscar configuração
  router.get('/api/configuration', async (req, res) => {
    const { user_id, provider } = req.query;
    if (!user_id || !provider) return res.status(400).json({ error: 'user_id e provider obrigatórios.' });
    try {
      const result = await pool.query(
        'SELECT * FROM api_configurations WHERE user_id = $1 AND api_provider = $2 AND is_active = true LIMIT 1',
        [user_id, provider]
      );
      if (result.rows.length === 0) return res.json({});
      return res.json(result.rows[0]);
    } catch (err) {
      console.error('Erro ao buscar configuração:', err);
      return res.status(500).json({ error: 'Erro ao buscar configuração.' });
    }
  });

  // Salvar/atualizar configuração
  router.post('/api/configuration', async (req, res) => {
    const { user_id, api_provider, api_key, is_active } = req.body;
    console.log('Recebido para salvar configuração:', { user_id, api_provider, api_key, is_active });
    if (!user_id || !api_provider || !api_key) return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    try {
      // Upsert: desativa anteriores e insere nova
      const updateResult = await pool.query(
        'UPDATE api_configurations SET is_active = false WHERE user_id = $1 AND api_provider = $2',
        [user_id, api_provider]
      );
      console.log('Registros desativados:', updateResult.rowCount);
      const insertResult = await pool.query(
        'INSERT INTO api_configurations (user_id, api_provider, api_key, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
        [user_id, api_provider, api_key, is_active ?? true]
      );
      console.log('Configuração de API salva:', insertResult.rows[0]);
      return res.json(insertResult.rows[0]);
    } catch (err) {
      console.error('Erro ao salvar configuração:', err);
      return res.status(500).json({ error: 'Erro ao salvar configuração.' });
    }
  });

  // Atualizar tema do usuário
  router.put('/api/users/:id/theme', async (req, res) => {
    const { id } = req.params;
    const { theme } = req.body;

    if (!theme) {
      return res.status(400).json({ error: 'O campo "theme" é obrigatório.' });
    }

    try {
      const result = await pool.query(
        'UPDATE users SET theme = $1 WHERE id = $2 RETURNING id, theme',
        [theme, id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }

      return res.json(result.rows[0]);
    } catch (err) {
      console.error('Erro ao atualizar tema do usuário:', err);
      return res.status(500).json({ error: 'Erro ao atualizar tema do usuário.', details: err.message });
    }
  });
})();

export default router;
