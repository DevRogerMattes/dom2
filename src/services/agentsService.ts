// Serviço para manipular agentes usando PostgreSQL puro
export async function updateAgent(id: string, updates: Partial<Agent>, userId: string): Promise<Agent> {
  const fields = [];
  const values = [];
  let idx = 2;
  for (const key in updates) {
    fields.push(`${key} = $${idx}`);
    values.push(
      ['inputs', 'outputs', 'config'].includes(key)
        ? JSON.stringify(updates[key])
        : updates[key]
    );
    idx++;
  }
  const query = `UPDATE agents SET ${fields.join(', ')} WHERE id = $1 AND user_id = $${idx} RETURNING *`;
  const result = await pool.query(query, [id, ...values, userId]);
  return result.rows[0];
}
import pool from './pgClient.ts';
import type { Agent } from '../types/agent.ts';

export async function getAgents(userId: string): Promise<Agent[]> {
  // Busca agentes do usuário OU globais (global_visibility = 'U')
  const { rows } = await pool.query(
    `SELECT * FROM agents WHERE user_id = $1 OR global_visibility = 'U' ORDER BY created_at ASC`,
    [userId]
  );
  return rows;
}

export async function createAgent(agent: Omit<Agent, 'id' | 'isFavorite'>, userId: string): Promise<Agent> {
  const result = await pool.query(
    `INSERT INTO agents (user_id, type, name, description, category, icon, inputs, outputs, config, template, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [userId, agent.type, agent.name, agent.description, agent.category, agent.icon, JSON.stringify(agent.inputs), JSON.stringify(agent.outputs), JSON.stringify(agent.config), agent.template, agent.isActive]
  );
  return result.rows[0];
}
import { agentMiddleware } from "../middleware/agentMiddleware.ts";

export async function executeAgent(agentName: string, userId: string, input: Record<string, any>): Promise<Record<string, any>> {
  // Simulate agent execution
  const response = await simulateAgentExecution(agentName, input);

  // Execute post-processing handlers
  await agentMiddleware.executeHandlers(agentName, response);

  return response;
}

async function simulateAgentExecution(agentName: string, input: Record<string, any>): Promise<Record<string, any>> {
  // Simulated agent logic (replace with actual implementation)
  console.log(`Executing agent: ${agentName} with input:`, input);
  return { produto: { nome: "Notebook", preco: 3000 } }; // Example response
}

export async function executeProductAgent(userId: string, produto: { nome: string; preco: number }): Promise<string> {
  const response = await executeAgent("productAgent", userId, { produto });
  return response.resultado;
}
