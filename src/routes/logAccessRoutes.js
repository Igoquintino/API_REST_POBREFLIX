import express from "express";
import logAccessController from "../controllers/logAccessController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate,logAccessController.getLogAccessAll); // Lista todos o histórico ADM OK!
router.get("/:id", authenticate, logAccessController.getLogAccessById); // Busca por ID ADM OK!

export default router;
