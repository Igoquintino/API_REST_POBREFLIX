import express from "express";
import consumptionController from "../controllers/consumptionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";
import { requireApiKey } from "../middlewares/requireApiKey.js";
import { decriptRequest } from "../middlewares/decryptApiKey.js";


const router = express.Router();  

router.post("/", authenticate, requireApiKey, decriptRequest, consumptionController.register); // click para assistir o video OK! *

export default router;
