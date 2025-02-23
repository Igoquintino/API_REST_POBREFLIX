import express from "express";
import historyController from "../controllers/historyController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, historyController.getAllHistory); // Lista todos o histórico ADM OK! ADM *
router.get("/:id", authenticate, historyController.getAllHistoryById); // Busca por ID USER OK! 

export default router;
