// src/services/workflowService.ts
import express from 'express';
import pool from './pgClient.ts';

const router = express.Router();

// Listar workflows do usuário
router.get('/api/workflows', async (req, res) => {
  const { user_id } = req.query;
  if (!user_id) return res.status(400).json({ error: 'user_id obrigatório.' });
  try {
    const result = await pool.query(
      'SELECT * FROM workflows WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    return res.json(result.rows);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao buscar workflows.' });
  }
});

// Criar workflow
router.post('/api/workflows', async (req, res) => {
  const { user_id, name, description, nodes, edges, variables, global_context } = req.body;
  if (!user_id || !name || !nodes || !edges) return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
  try {
    const result = await pool.query(
      'INSERT INTO workflows (user_id, name, description, nodes, edges, variables, global_context) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [user_id, name, description, JSON.stringify(nodes), JSON.stringify(edges), JSON.stringify(variables || {}), JSON.stringify(global_context || {})]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao criar workflow.' });
  }
});

// Atualizar workflow
router.put('/api/workflows/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, nodes, edges, variables, global_context } = req.body;
  try {
    const result = await pool.query(
      'UPDATE workflows SET name = $1, description = $2, nodes = $3, edges = $4, variables = $5, global_context = $6, updated_at = now() WHERE id = $7 RETURNING *',
      [name, description, JSON.stringify(nodes), JSON.stringify(edges), JSON.stringify(variables || {}), JSON.stringify(global_context || {}), id]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao atualizar workflow.' });
  }
});

// Deletar workflow
router.delete('/api/workflows/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM workflows WHERE id = $1', [id]);
    return res.json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: 'Erro ao deletar workflow.' });
  }
});

export default router;
