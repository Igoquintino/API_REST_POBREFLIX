import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

const userController = {
    async getAllUsers(req, res) {
        try {
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
    },

    async getUserByIdOrNameOrEmail(req, res) {
        try {
            const { id, name, email } = req.query;
            
            if (!id && !name && !email) {
                return res.status(400).json({ error: "Pelo menos um parâmetro (id, name ou email) deve ser fornecido." });
            }

            if (req.userType !== 'Administrator' && req.userId !== id) {
                return res.status(403).json({ error: "Acesso proibido. Você só pode ver seus próprios dados." });
            }
    
            const users = await userModel.selectUsersByIdOrNameOrEmail(id, name, email);
            res.json(users);
    
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar usuários: ${err.message}` });
        }
    },

    async createUser(req, res) {
        try {
            const { name, email, password, user_type } = req.body;
    
            if (!name || !email || !password || !user_type) {
                return res.status(400).json({
                    error: "Os campos name, email, password e user_type são obrigatórios."
                });
            }
    
            if (!['Administrator', 'Client'].includes(user_type)) {
                return res.status(400).json({
                    error: "O campo user_type deve ser 'Administrator' ou 'Client'."
                });
            }
    
            const user = await userModel.addUser(name, email, password, user_type);
    
            res.status(201).json(user);
        } catch (err) {
    
            if (err.code === '23505') { // Código de erro do PostgreSQL para UNIQUE constraint
                return res.status(400).json({
                    error: "O email fornecido já está em uso."
                });
            }
    
            res.status(500).json({ error: `Erro ao cadastrar usuário: ${err.message}` });
        }
    },

    async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { name, email, password } = req.body;
    
            if (!name && !email && !password) {
                return res.status(400).json({
                    error: "Pelo menos um campo deve ser fornecido para atualização."
                });
            }

            if (req.userType !== 'Administrator' && req.userId !== parseInt(id)) {
                return res.status(403).json({ error: "Acesso proibido. Você só pode atualizar seus próprios dados." });
            }
    
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({
                    error: "O campo email deve conter um endereço de e-mail válido."
                });
            }
    
            let hashedPassword = null;
            if (password) {
                hashedPassword = await bcrypt.hash(password, 10);
            }
    
            const updatedUser = await userModel.updateUser(id, { name, email, password: hashedPassword });
    
            if (!updatedUser) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
    
            res.status(200).json(updatedUser);
        } catch (err) {
            res.status(500).json({ error: `Erro ao atualizar usuário: ${err.message}` });
        }
    },

    async deleteUser(req, res) {
        try {
            const { id } = req.params;

            // Apenas administradores podem excluir outros usuários
            if (req.userType !== 'Administrator') {
                return res.status(403).json({ error: "Acesso proibido. Apenas administradores podem excluir usuários." });
            }

            const deletedUser = await userModel.deleteUser(id);

            if (!deletedUser) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: `Erro ao excluir usuário: ${err.message}` });
        }
    }
};

export default userController;
