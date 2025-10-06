// src/routes/productsRoutes.ts
import express from 'express';
import { createProduct, getProducts, updateProduct, deleteProduct } from '../services/productsController.ts';

const router = express.Router();

router.post('/api/products', createProduct);
router.get('/api/products', getProducts);
router.put('/api/products/:id_produto', updateProduct);
router.delete('/api/products/:id_produto', deleteProduct);

export default router;
