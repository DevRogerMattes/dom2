// src/routes/subscriptionRoutes.ts
import express from 'express';
import { 
  getSubscriptionPlans, 
  getUserSubscription, 
  createUserSubscription, 
  updateSubscriptionPlan 
} from '../services/subscriptionController';

const router = express.Router();

// Rotas públicas
router.get('/api/subscription-plans', getSubscriptionPlans);

// Rotas de usuário
router.get('/api/user-subscription/:user_id', getUserSubscription);
router.post('/api/user-subscription', createUserSubscription);

// Rotas administrativas
router.put('/api/subscription-plans/:id', updateSubscriptionPlan);

export default router;