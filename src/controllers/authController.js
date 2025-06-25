import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import deviceModel from "../models/deviceModel.js"; // Importar deviceModel
import { addToBlacklist } from "../middlewares/authMiddleware.js";
import logService from "../services/logService.js";
import { connect } from "../../config/database.js"; // Importar connect para usar pool.query diretamente

const SECRET_KEY = process.env.JWT_SECRET || "minha_chave_secreta";
const TOKEN_EXPIRATION = process.env.JWT_EXPIRES_IN || "1h";

const authController = {
    async login(req, res) {
        const { email, password } = req.body;
        //const currentApiKey = req.headers['x-api-key']
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

            //*** LOGICA PARA SIMULTANEOIDADE ESTRITA ***//
            
            // 1. Desativar todas as sessões existentes para este user_id
            const deactivatedCount = await deviceModel.deactivateAllUserSessions(user.id);
            if (deactivatedCount > 0) {
                console.log(`Desativadas ${deactivatedCount} sessões anteriores para o usuário ID: ${user.id}`);
                await logService.recordLog({
                    req,
                    operacao: 'SESSION_REVOCATION',
                    status: 'SUCCESS',
                    id_usuario_especifico: user.id,
                    descricao: `Revogadas ${deactivatedCount} sessões anteriores devido a novo login.`
                });
            }

            // 2. Garante que a API Key da requisição atual está ativa e associada ao usuário.
            //    Se o deviceModel.registerDevice já é chamado no endpoint /devices/register,
            //    e se a api_key é única, o que vem do req.deviceSession já é a sessão a ser usada.
            //    Apenas atualizaremos o user_id dela, caso não esteja ligado.
            let updatedDeviceSession;
            if (req.deviceSession && req.deviceSession.id) {
                // Se já temos uma sessão de dispositivo da API Key, atualiza ela com o userId
                const pool = await connect(); // Supondo que connect() esteja disponível
                const updateQuery = `
                    UPDATE sessao
                    SET user_id = $1, ativa = TRUE, data_expiracao = $2
                    WHERE id = $3
                    RETURNING *;
                `;
                const newExpirationDate = new Date();
                newExpirationDate.setFullYear(newExpirationDate.getFullYear() + 1); // 1 ano de validade para a sessão do dispositivo
                const updateResult = await pool.query(updateQuery, [user.id, newExpirationDate, req.deviceSession.id]);
                updatedDeviceSession = updateResult.rows[0];
            } else {
                // Caso contrário (o que não deve acontecer se requireApiKey rodou), registra uma nova sessão.
                // Isso é um fallback, idealmente req.deviceSession já existe.
                const newApiKey = req.headers['x-api-key'] || 'Dispositivo_Sem_API_Key_Inicial';
                updatedDeviceSession = await deviceModel.registerDevice(req.headers['user-agent'] || 'Dispositivo Desconhecido', user.id);
                console.warn("req.deviceSession não estava disponível no login, nova sessão de dispositivo registrada como fallback.");
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
                device_api_key: updatedDeviceSession.api_key, // Retorna a API Key ativa para o cliente
                device_cripto_key: updatedDeviceSession.cripto_key // Retorna a chave de criptografia ativa
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
        //const currentApiKey = req.headers['x-api-key']; // Pega a API Key da requisição de logout
        const currentApiKey = req.deviceSession ? req.deviceSession.api_key : null; 
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

            // --- Lógica adicional para desativar a API Key do dispositivo no logout ---
            if (currentApiKey) {
                const deactivatedSession = await deviceModel.deactivateSessionByApiKey(currentApiKey);
                if (deactivatedSession) {
                    console.log(`API Key ${currentApiKey.substring(0, 8)}... desativada no logout.`);
                    await logService.recordLog({
                        req,
                        operacao: 'DEVICE_API_KEY_DEACTIVATION',
                        status: 'SUCCESS',
                        id_usuario_especifico: userIdForLog,
                        descricao: `API Key de dispositivo desativada no logout: ${currentApiKey.substring(0, 8)}...`
                    });
                }
            }
            // --- Fim da lógica adicional ---

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
