import express from "express";
import consumptionController from "../controllers/consumptionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireApiKey } from "../middlewares/apiKeyMiddleware.js";
import { decryptRequest } from "../middlewares/encryptionMiddleware.js";


const router = express.Router();  

router.post("/", authenticate, requireApiKey, decryptRequest, consumptionController.register); // click para assistir o video OK! *

export default router;
