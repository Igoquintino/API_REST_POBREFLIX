import express from "express";
import historyController from "../controllers/historyController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, historyController.getAllHistory); // Lista todos o histórico OK! USER
router.get("/:id", authenticate, historyController.getAllHistoryById); // Busca por ID ADM OK! ADM

export default router;
