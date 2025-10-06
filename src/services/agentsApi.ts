import express from 'express';
import { getAgents, createAgent } from './agentsService.ts';
import { updateAgent } from './agentsService.ts';

const router = express.Router();

// GET /api/agents?userId=...
router.get('/api/agents', async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'userId obrigatório' });
  try {
    let agents = await getAgents(userId);
    // Mapear is_active para isActive
    agents = agents.map(a => ({
      ...a,
      isActive: a['is_active'] !== undefined ? a['is_active'] : a.isActive
    }));
    console.log(`[agentsApi] GET /api/agents userId=${userId} =>`, agents.map(a => ({ id: a.id, name: a.name, category: a.category, isActive: a.isActive })));
    res.json(agents);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar agentes', details: err.message });
  }
});

// POST /api/agents
router.post('/api/agents', async (req, res) => {
  const { userId, ...agentData } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId obrigatório' });
  try {
    const agent = await createAgent(agentData, userId);
    res.json(agent);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar agente', details: err.message });
  }
});

// POST /api/agents/default?userId=...
// PUT /api/agents/:id
router.put('/api/agents/:id', async (req, res) => {
  const { id } = req.params;
  const { userId, ...updates } = req.body;
  if (!userId) return res.status(400).json({ error: 'userId obrigatório' });
  try {
    const updatedAgent = await updateAgent(id, updates, userId);
    res.json(updatedAgent);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar agente', details: err.message });
  }
});
router.post('/api/agents/default', async (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'userId obrigatório' });
  try {
    // Chama a função SQL para criar agentes padrão
    await req.app.get('db').query('SELECT public.create_default_agents_for_user($1)', [userId]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao inicializar agentes padrão', details: err.message });
  }
});

export default router;
