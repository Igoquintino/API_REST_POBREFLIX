import express from "express";
import consumptionController from "../controllers/consumptionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();  

router.post("/", authenticate, consumptionController.register); // click para assistir o video OK! *

export default router;
