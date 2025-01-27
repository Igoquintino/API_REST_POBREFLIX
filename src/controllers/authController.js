import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const SECRET_KEY = process.env.JWT_SECRET || "minha_chave_secreta";
const TOKEN_EXPIRATION = process.env.JWT_EXPIRES_IN || "1h";

const authController = {
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validação básica
            if (!email || !password) {
                return res.status(400).json({
                    error: "Os campos email e password são obrigatórios.",
                });
            }

            console.log(`Tentativa de login: email=${email}, horário=${new Date().toISOString()}`);

            // Verifica se o usuário existe no banco de dados
            const user = await userModel.getUserByEmail(email);

            // Valida o email e a senha de forma genérica
            if (!user || !(await bcrypt.compare(password, user.password))) {
                return res.status(401).json({ error: "Credenciais inválidas." });
            }

            // Gera o token JWT
            const token = jwt.sign(
                { userId: user.id, userType: user.user_type },
                SECRET_KEY,
                { expiresIn: TOKEN_EXPIRATION }
            );

            console.log(`Login bem-sucedido: userId=${user.id}, horário=${new Date().toISOString()}`);

            // Retorna o token e as informações do usuário
            res.status(200).json({
                message: "Login bem-sucedido!",
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    user_type: user.user_type,
                },
            });
        } catch (err) {
            console.error(`Erro ao autenticar: ${err.message}`);
            res.status(500).json({ error: `Erro ao autenticar: ${err.message}` });
        }
    },
};

export default authController;
