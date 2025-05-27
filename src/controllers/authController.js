import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { addToBlacklist } from "../middlewares/authMiddleware.js";
import log from "../utils/logger.js";

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
                // Registrar log de credenciais inválidas
                await log(
                    "LOGIN",
                    "Tentativa de login com credenciais inválidas.",
                    null,
                    req.ip,
                    req.headers["user-agent"],
                    "ERROR"
                );
                return res.status(401).json({ error: "Credenciais inválidas." });
            }

            // Gera o token JWT
            const token = jwt.sign(
                { userId: user.id, userType: user.user_type },
                SECRET_KEY,
                { expiresIn: TOKEN_EXPIRATION }
            );

            // Registrar log de login bem-sucedido
            await log(
                "LOGIN",
                `Login bem-sucedido: userId=${user.id}`,
                user.id,
                req.ip,
                req.headers["user-agent"],
                "SUCCESS"
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
            // Registrar log de erro no login
            await log(
                "LOGIN",
                `Erro ao autenticar: ${err.message}`,
                null,
                req.ip,
                req.headers["user-agent"],
                "ERROR"
            );
            console.error(`Erro ao autenticar: ${err.message}`);
            res.status(500).json({ error: `Erro ao autenticar: ${err.message}` });
        }
    },

    async logout(req, res) {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ error: "Token não fornecido ou inválido." });
            }

            const token = authHeader.split(" ")[1];

            // Obtemos o tempo de expiração do token
            const decoded = jwt.decode(token);
            const expiresIn = decoded.exp - Math.floor(Date.now() / 1000); // Tempo restante até a expiração

            if (expiresIn > 0) {
                addToBlacklist(token, expiresIn);
            }

            // Registrar log de logout
            await log(
                "LOGOUT",
                `Logout realizado com sucesso. userId=${req.userId}`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "SUCCESS"
            );

            console.log("Logout realizado com sucesso!");
            res.status(200).json({ message: "Logout realizado com sucesso!" });
        } catch (err) {
            // Registrar log de erro no logout
            await log(
                "LOGOUT",
                `Erro ao fazer logout: ${err.message}`,
                req.userId,
                req.ip,
                req.headers["user-agent"],
                "ERROR"
            );
            res.status(500).json({ error: "Erro ao fazer logout." });
        }
    }
};

export default authController;