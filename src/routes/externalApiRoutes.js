import express from 'express';
import externalApiController from '../controllers/externalApiController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rota para registrar o uso da API
router.post('/register', authenticate, externalApiController.registerApiUsage);

export default router;