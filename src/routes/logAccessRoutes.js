import express from "express";
import logAccessController from "../controllers/logAccessController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireApiKey } from "../middlewares/apiKeyMiddleware.js"; 
import { decryptRequest } from "../middlewares/encryptionMiddleware.js"; 

const router = express.Router();

router.get("/", authenticate, requireApiKey, decryptRequest, logAccessController.getLogAccessAll); // Lista todos o histórico ADM OK! * 
router.get("/:id", authenticate,requireApiKey, decryptRequest, logAccessController.getLogAccessById); // Busca por ID ADM OK! *
router.get("/All/logs", authenticate, requireApiKey, decryptRequest, logAccessController.getAllLogs); // Busca todos os logs usuário ADM OK! *

export default router;
