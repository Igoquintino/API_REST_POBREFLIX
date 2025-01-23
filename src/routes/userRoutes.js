import express from "express";
import userModel from "../models/userModel.js";

const router = express.Router();



router.get("/", async (req, res) => {
    try {
         // Verifica se há parâmetros na query string
        if (Object.keys(req.query).length > 0) {
            return res.status(400).json({
                error: "Esta rota não aceita parâmetros. Use /users/search para consultas específicas.",
            });
        }
        const users = await userModel.selectAllUsers();
        res.json(users);

    } catch (err) {
        res.status(500).json({ error: `Erro ao buscar todos os usuários: ${err.message}` });
    }
});


router.get("/search", async (req, res) => {
    try {
        const { id, name, email } = req.query;
        
        if (!id && !name && !email) {
            return res.status(400).json({ error: "Pelo menos um parâmetro (id, name ou email) deve ser fornecido." });
        }

        const users = await userModel.selectUsersByIdOrNameOrEmail(id, name, email);
        res.json(users);

    } catch (err) {
        res.status(500).json({ error: `Erro ao buscar usuários: ${err.message}` });
    }
});

//verificar essas rotas uma a uma a partir daqui
router.post("/", async (req, res) => {
    try {
        const { name, email, password, user_type} = req.body;
        const user = await userModel.addUser(name, email, password, user_type );
        res.status(201).json(user);
    } catch (err) {
        res.status(500).json({ error: `Erro ao cadastrar usuário: ${err.message}` });
    }
})


router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;
        const user = await userModel.updateUser(id, name, email, password);
        //res.json(user);
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: `Erro ao atualizar usuário: ${err.message}` });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.deleteUser(id);
        res.json(user);
        res.sendStatus(204);
    } catch (err) {
        res.sendStatus(500).json({ error: `Erro ao excluir usuário: ${err.message}` });
    }
});

export default router;
