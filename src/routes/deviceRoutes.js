import express from "express";
import deviceController from "../controllers/deviceController.js";

const router = express.Router();

router.post("/register", deviceController.registerNewDevice);

export default router;
