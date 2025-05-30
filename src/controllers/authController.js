import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import { addToBlacklist } from "../middlewares/authMiddleware.js";
import logService from "../services/logService.js";


const SECRET_KEY = process.env.JWT_SECRET || "minha_chave_secreta";
const TOKEN_EXPIRATION = process.env.JWT_EXPIRES_IN || "1h";

const authController = {
    async login(req, res) {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                await logService.recordLog({
                    req,
                    operacao: 'LOGIN_ATTEMPT',
                    status: 'FAILURE',
                    descricao: 'Campos ausentes (email ou senha) na tentativa de login.'
                });
                return res.status(400).json({
                    error: "Os campos email e password são obrigatórios.",
                });
            }

            // Log da tentativa inicial
            await logService.recordLog({
                req,
                operacao: 'LOGIN_ATTEMPT',
                status: 'INFO',
                descricao: `Tentativa de login para email: ${email}`
            });

            const user = await userModel.getUserByEmail(email);

            if (!user || !(await bcrypt.compare(password, user.password))) {
                await logService.recordLog({
                    req,
                    operacao: 'LOGIN_AUTH_FAILURE', // Operação específica de falha na autenticação
                    status: 'FAILURE',
                    descricao: `Credenciais inválidas para email: ${email}`
                });
                return res.status(401).json({ error: "Credenciais inválidas." });
            }

            const token = jwt.sign(
                { userId: user.id, userType: user.user_type },
                SECRET_KEY,
                { expiresIn: TOKEN_EXPIRATION }
            );

            await logService.recordLog({
                req,
                operacao: 'LOGIN_AUTH_SUCCESS', // Operação específica de sucesso na autenticação
                status: 'SUCCESS',
                id_usuario_especifico: user.id,
                descricao: `Login bem-sucedido para email: ${email}`
            });

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
            console.error(`Erro ao autenticar (${email}): ${err.message}`);
            await logService.recordLog({
                req,
                operacao: 'LOGIN_SYSTEM_ERROR',
                status: 'ERROR',
                descricao: `Erro no sistema durante login para ${email}: ${err.message}`
            });
            res.status(500).json({ error: `Erro interno ao autenticar: ${err.message}` });
        }
    },

    async logout(req, res) {
        // req.userId e req.createUserType são definidos pelo middleware 'authenticate' que roda antes desta rota
        const userIdForLog = req.userId;
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                // Não temos userId aqui de forma confiável se o token estiver ausente/malformado
                await logService.recordLog({
                    req,
                    operacao: 'LOGOUT_ATTEMPT',
                    status: 'FAILURE',
                    descricao: 'Tentativa de logout sem token ou token mal formatado.'
                });
                return res.status(401).json({ error: "Token não fornecido ou inválido." });
            }

            const token = authHeader.split(" ")[1];
            const decoded = jwt.decode(token); // Apenas para pegar o tempo de expiração

            if (decoded && decoded.exp) {
                const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
                if (expiresIn > 0) {
                    addToBlacklist(token, expiresIn);
                }
            } else {
                // Se não puder decodificar ou não tiver 'exp', não adiciona à blacklist, mas continua o logout
                console.warn("Token não pôde ser completamente decodificado para blacklist no logout, mas prosseguindo.");
            }


            await logService.recordLog({
                req,
                operacao: 'LOGOUT_SUCCESS',
                status: 'SUCCESS',
                id_usuario_especifico: userIdForLog, // Usa o userId obtido pelo middleware authenticate
                descricao: `Usuário ID ${userIdForLog} realizou logout.`
            });
            res.status(200).json({ message: "Logout realizado com sucesso!" });

        } catch (err) {
            console.error("Erro ao fazer logout:", err.message);
            await logService.recordLog({
                req,
                operacao: 'LOGOUT_ERROR',
                status: 'ERROR',
                id_usuario_especifico: userIdForLog, // Tenta logar com o userId se disponível
                descricao: `Erro durante o logout para usuário ID ${userIdForLog}: ${err.message}`
            });
            res.status(500).json({ error: "Erro ao fazer logout." });
        }
    }
};

export default authController;
