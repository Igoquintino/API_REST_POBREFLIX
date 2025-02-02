import express from 'express';
import ExternalApiController from '../controllers/externalApiController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Rota para registrar o uso da API
router.post('/register', authenticate, ExternalApiController.registerApiUsage);

export default router;
