import express from "express";
import authController from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", authController.login); // Endpoint para login OK! *
router.post("/logout", authenticate, authController.logout); // Endpoint para registrar OK! *

export default router;
