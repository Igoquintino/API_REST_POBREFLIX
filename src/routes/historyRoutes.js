import express from "express";
import historyController from "../controllers/historyController.js";
import consumptionController from "../controllers/consumptionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, historyController.getAllHistory); // Lista todos o histórico
router.get("/:id", authenticate, historyController.getAllHistoryById); // Busca por ID ADM

router.post("/register", authenticate, consumptionController.register); // rota de autenticação

export default router;
