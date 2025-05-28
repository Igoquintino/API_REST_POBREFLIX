import userModel from "../models/userModel.js";
import log from "../utils/logger.js"; // Importando o logger para registrar as operações

const userController = {
    async getAllUsers(req, res) { // Pegar todos os usuários OK! ADM
        try {
            // Pegando o userType corretamente do middleware
            const creatorUserType = req.createUserType;
    
            // Impedindo usuários não-administradores de acessar a lista
            if (creatorUserType !== "Administrator") {
                return res.status(403).json({
                    error: "Apenas administradores podem visualizar todos os usuários.",
                });
            }
    
            // Evitando que a rota aceite query parameters
            if (Object.keys(req.query).length > 0) {
                return res.status(400).json({
                    error: "Esta rota não aceita parâmetros. Use /users/search para consultas específicas.",
                });
            }
    
            // Buscando todos os usuários (model já lida com o banco)
            const users = await userModel.selectAllUsers();
            res.status(200).json(users);

            await log(
                "SEARCH_ALL_USERS",
                `Busca por todos os usuários`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "SUCCESS"
            );
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar todos os usuários: ${err.message}` });

            await log(
                "SEARCH_ALL_USERS",
                `Busca por todos os usuários`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "FAILURE"
            );
        }
    },

    async getUserByIdOrNameOrEmail(req, res) { // Busca por id, name ou email OK! ADM
        try {
            const { id, name, email } = req.query;

            const creatorUserType = req.createUserType;
    
            // Impedindo usuários não-administradores de acessar a lista
            if (creatorUserType !== "Administrator") {
                return res.status(403).json({
                    error: "Apenas administradores podem visualizar todos os usuários.",
                });
            }
            
            if (!id && !name && !email) {
                return res.status(400).json({ error: "Pelo menos um parâmetro (id, name ou email) deve ser fornecido." });
            }
    
            const users = await userModel.selectUsersByIdOrNameOrEmail(id, name, email);
            res.json(users);

            await log(
                "SEARCH_USER",
                `Busca de usuário: id=${id}, name=${name}, email=${email}`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "SUCCESS"
            );
    
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar usuários: ${err.message}` });

            await log(
                "SEARCH_USER",
                `Busca de usuário: id=${id}, name=${name}, email=${email}`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "FAILURE"
            );
        }
    },

    async createUser(req, res) { // Criar usuário USER/ADM mas só para adm OK!
        try {
            const { name, email, password, user_type } = req.body;
            
            // Tipo padrão: todos os usuários comuns são criados como Client
            const creatorUserType = req.createUserType;

            if (!name || !email || !password) {
                return res.status(400).json({
                    error: "Os campos name, email e password são obrigatórios.",
                });
            }
    
            const user = await userModel.addUser(name, email, password, user_type, creatorUserType);
    
            res.status(201).json(user);

            await log(
                "CREATE_USER_ADM",
                `Usuário criado: userId=${user.id}, email=${email}`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "SUCCESS"
            );
        } catch (err) {
    
            if (err.code === '23505') { // Código de erro do PostgreSQL para UNIQUE constraint
                return res.status(400).json({
                    error: "O email fornecido já está em uso."
                });
            }
    
            res.status(500).json({ error: `Erro ao cadastrar usuário: ${err.message}` });
        }
    },

    async registerUser(req, res) { // Criar usuário USER/ Publico OK!
        try {
            const { name, email, password } = req.body;

            // 1️⃣ Valida se todos os campos obrigatórios foram preenchidos
            if (!name || !email || !password) {
                return res.status(400).json({
                    error: "Os campos name, email e password são obrigatórios."
                });
            }

            // 2️⃣ Chama o model para criar o usuário
            const newUser = await userModel.createPublicUser(name, email, password);

            // 3️⃣ Retorna os dados do usuário criado
            res.status(201).json({
                message: "Usuário cadastrado com sucesso!",
                user: newUser
            });

            await log(
                "CREATE_USER",
                `Usuário criado: userId=${user.id}, email=${email}`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "SUCCESS"
            );

        } catch (err) {
            res.status(500).json({ error: `Erro ao cadastrar usuário: ${err.message}` });
        }
    },

    async updateUser(req, res) { // Atualizar usuário USER/ADM OK!
        try {
            const { id } = req.params;
            const { name, email, password, user_type } = req.body;
    
            // Obtém o tipo do usuário autenticado (via JWT)
            const creatorUserType = req.createUserType;
            console.log(`Usuário autenticado: ${creatorUserType}`);
    
            // 1. Verifica se pelo menos um campo foi enviado para atualização
            if (!name && !email && !password && !user_type) {
                return res.status(400).json({
                    error: "Pelo menos um campo deve ser fornecido para atualização."
                });
            }
    
            // 2. Restringe alteração do user_type para administradores
            if (user_type && creatorUserType !== 'Administrator') {
                return res.status(403).json({
                    error: "Apenas administradores podem alterar o tipo de usuário.",
                });
            }
    
            // 3. Valida o formato do email
            if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({
                    error: "O campo email deve conter um endereço de e-mail válido."
                });
            }
    
            // 4. Chama a função de update no model
            const updatedUser = await userModel.updateUser(id, { name, email, password, user_type });
    
            // 5. Verifica se o usuário foi encontrado e atualizado
            if (!updatedUser) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
    
            // 6. Retorna o usuário atualizado
            res.status(200).json(updatedUser);

            await log(
                "UPDATE_USER",
                `Usuário atualizado: userId=${id}`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "SUCCESS"
            );

        } catch (err) {
            res.status(500).json({ error: `Erro ao atualizar usuário: ${err.message}` });

            await log(
                "UPDATE_USER",
                `Erro ao atualizar usuário: userId=${id}`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "FAILURE"
            );
        }
    },
    
    async deleteUser(req, res) { // Apagar usuário ADM OK!
        try {
            const { id } = req.params;

            const creatorUserType = req.createUserType;

            // Apenas administradores podem excluir outros usuários
            if (creatorUserType !== 'Administrator') {
                console.log(req.userType);
                return res.status(403).json({ error: "Acesso proibido. Apenas administradores podem excluir usuários." });
            }

            const deletedUser = await userModel.deleteUser(id, creatorUserType);

            if (!deletedUser) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }

            res.status(204).send();

            await log(
                "DELETE_USER",
                `Usuário deletado: userId=${id}`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "SUCCESS"
            );
        } catch (err) {
            res.status(500).json({ error: `Erro ao excluir usuário: ${err.message}` });

            await log(
                "DELETE_USER",
                `Erro ao excluir usuário: userId=${id}`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "FAILURE"
            );
        }
    }
};

export default userController;
