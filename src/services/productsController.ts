// src/services/productsController.ts
import type { Request, Response } from 'express';
import pool from './pgClient.ts';

// POST /api/products
export async function createProduct(req: Request, res: Response) {
  try {
    console.log('Conteúdo do req.body:', req.body);
    const { nome_produto, preco_produto, link_venda, user_id } = req.body;
    
    if (nome_produto === undefined || preco_produto === undefined || link_venda === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    if (!user_id) {
      return res.status(400).json({ error: 'user_id é obrigatório.' });
    }

    if (nome_produto.trim() === '' || preco_produto <= 0) {
      return res.status(400).json({ error: 'Nome do produto ou preço inválido.' });
    }

    const result = await pool.query(
      `INSERT INTO products (nome_produto, preco_produto, link_venda, user_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [nome_produto, preco_produto, link_venda, user_id]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao inserir produto:', err);
    return res.status(500).json({ error: 'Erro ao inserir produto.' });
  }
}

// GET /api/products?search=...&user_id=...
export async function getProducts(req: Request, res: Response) {
  try {
    const { search, user_id } = req.query;
    
    if (!user_id) {
      return res.status(400).json({ error: 'user_id é obrigatório.' });
    }

    let query = 'SELECT * FROM products WHERE user_id = $1';
    let params: any[] = [user_id];
    
    if (search) {
      query += ' AND nome_produto ILIKE $2';
      params.push(`%${search}%`);
    }
    
    query += ' ORDER BY id_produto DESC';
    
    const result = await pool.query(query, params);
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    return res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
}

// DELETE /api/products/:id_produto
// PUT /api/products/:id_produto
export async function updateProduct(req: Request, res: Response) {
  try {
    const { id_produto } = req.params;
    const { nome_produto, preco_produto, link_venda } = req.body;
    const { user_id } = req.query;
    
    if (nome_produto === undefined || preco_produto === undefined || link_venda === undefined) {
      return res.status(400).json({ error: 'Campos obrigatórios ausentes.' });
    }

    if (!user_id) {
      return res.status(400).json({ error: 'user_id é obrigatório.' });
    }

    if (nome_produto.trim() === '' || preco_produto <= 0) {
      return res.status(400).json({ error: 'Nome do produto ou preço inválido.' });
    }

    const result = await pool.query(
      `UPDATE products SET nome_produto = $1, preco_produto = $2, link_venda = $3 WHERE id_produto = $4 AND user_id = $5 RETURNING *`,
      [nome_produto, preco_produto, link_venda, id_produto, user_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado ou você não tem permissão para editá-lo.' });
    }
    
    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    return res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
}

export async function deleteProduct(req: Request, res: Response) {
  try {
    const { id_produto } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: 'user_id é obrigatório.' });
    }

    const result = await pool.query(
      'DELETE FROM products WHERE id_produto = $1 AND user_id = $2 RETURNING *', 
      [id_produto, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Produto não encontrado ou você não tem permissão para deletá-lo.' });
    }

    return res.status(204).send();
  } catch (err) {
    console.error('Erro ao deletar produto:', err);
    return res.status(500).json({ error: 'Erro ao deletar produto.' });
  }
}
