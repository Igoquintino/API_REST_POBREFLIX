import express from 'express';
import externalApiController from '../controllers/externalApiController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rota para registrar o uso da API
router.get("/usage", authenticate, externalApiController.selectAllApiUsage); // Pegar o uso da API OK! *
router.get("/movie-poster", authenticate, externalApiController.getMoviePoster); // Pegar o poster do filme OK *
router.post('/register', authenticate, externalApiController.registerApiUsage); // Registro de api OK! *


export default router;