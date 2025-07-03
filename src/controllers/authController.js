import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import deviceModel from "../models/deviceModel.js"; // Importar deviceModel
import { addToBlacklist } from "../middlewares/authMiddleware.js";
import logService from "../services/logService.js";
import { connect } from "../../config/database.js"; // Importar connect para usar pool.query diretamente

const SECRET_KEY = process.env.JWT_SECRET || "minha_chave_secreta";
const TOKEN_EXPIRATION = process.env.JWT_EXPIRES_IN || "1h";

// Defina os limites de sessões por tipo de usuário
const MAX_COMMON_SESSIONS = 1; // Para 'Client' - estrita não-simultaneidade
const MAX_PREMIUM_SESSIONS = 3; // Exemplo: 3 sessões para usuários 'Premium'


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

            // --- Lógica para controle de sessões simultâneas por tipo de usuário ---
            //let sessionsToDeactivateCount = 0;
            let maxAllowedSessionsForUser = MAX_COMMON_SESSIONS; // Padrão para comum

            console.log (`Tipo de usuário: ${user.user_type}`);

            if (user.user_type === 'Premium') {
                maxAllowedSessionsForUser = MAX_PREMIUM_SESSIONS;
            } else if (user.user_type === 'Client') {
                maxAllowedSessionsForUser = MAX_COMMON_SESSIONS;
            } else {
                // Tipo de usuário desconhecido ou não configurado
                console.warn(`Tipo de usuário desconhecido ou não configurado para sessões simultâneas: ${user.user_type}. Aplicando limite padrão de ${MAX_COMMON_SESSIONS}.`);
            }

            console.log(`maxAllowedSessionsForUser: ${maxAllowedSessionsForUser}`);

              // --- NOVA LÓGICA: Verificar limite de sessões ATIVAS ANTES de permitir o novo login ---
            const activeSessionsCount = await deviceModel.countActiveSessionsForUser(user.id);

            // Se o número de sessões ativas já é igual ou maior ao limite permitido, bloqueia o novo login
            if (activeSessionsCount >= maxAllowedSessionsForUser) {
                // Registrar no log a tentativa de login bloqueada
                await logService.recordLog({
                    req,
                    operacao: 'LOGIN_BLOCKED_SESSION_LIMIT', // Nova operação de log
                    status: 'FAILURE',
                    id_usuario_especifico: user.id,
                    descricao: `Tentativa de login bloqueada para ${email}. Limite de ${maxAllowedSessionsForUser} sessões atingido.`
                });
                return res.status(403).json({ // 403 Forbidden para indicar que o acesso é negado
                    error: `Limite de sessões (${maxAllowedSessionsForUser}) atingido. Por favor, deslogue de outro dispositivo para continuar.`
                });
            }
            // --- FIM DA NOVA LÓGICA DE BLOQUEIO ---

            // 2. Garante que a API Key da requisição atual está ativa e associada ao usuário.
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
                updatedDeviceSession = await deviceModel.registerDevice(req.headers['user-agent'] || 'Dispositivo Desconhecido', user.id);
                console.warn("req.deviceSession não estava disponível no login, nova sessão de dispositivo registrada como fallback.");
            }

            const token = jwt.sign(
                { userId: user.id, userType: user.user_type, deviceApiKey: updatedDeviceSession.api_key },
                SECRET_KEY,
                { expiresIn: TOKEN_EXPIRATION }
            );

            await logService.recordLog({
                req,
                operacao: 'LOGIN_AUTH_SUCCESS',
                status: 'SUCCESS',
                id_usuario_especifico: user.id,
                descricao: `Login bem-sucedido para email: ${email}. Nova sessão de dispositivo iniciada/reativada.`
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
