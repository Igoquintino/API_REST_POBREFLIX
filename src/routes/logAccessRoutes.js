import express from "express";
import logAccessController from "../controllers/logAccessController.js";

const router = express.Router();

router.get("/", logAccessController.getLogAccessAll); // Lista todos o histórico
router.get("/:id", logAccessController.getLogAccessById); // Busca por ID

export default router;
