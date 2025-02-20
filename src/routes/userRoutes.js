import express from "express";
import userController from "../controllers/userController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticate, userController.getAllUsers); // todos os usuários ADM OK!
router.get("/search", authenticate,userController.getUserByIdOrNameOrEmail); // Busca por id, name ou email ADM OK!
router.post("/register", userController.registerUser); // Criar usuário USER OK! *
router.post("/create", authenticate, userController.createUser); // Criar usuário USER/ADM OK! *
router.patch("/:id", authenticate, userController.updateUser); // atualizar usuário ADM e USER OK! *
router.delete("/:id", authenticate, userController.deleteUser); // apagar usuário ADM OK! *


export default router;
