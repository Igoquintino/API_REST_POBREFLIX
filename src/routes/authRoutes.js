import express from "express";
import authController from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireApiKey } from '../middlewares/apiKeyMiddleware.js';
import { decryptRequest } from '../middlewares/encryptionMiddleware.js';



const router = express.Router();

router.post("/login", requireApiKey, decryptRequest, authController.login); // Endpoint para login OK! *
router.post("/logout", requireApiKey, authenticate, authController.logout); // Endpoint para registrar OK! *

export default router;
