import { connect } from "../../config/database.js";
import crypto from 'crypto'; // Para gerar chaves únicas

// Função para gerar uma chave aleatória (para API key e Cripto key)
const generateUniqueKey = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

const deviceModel = {
    async registerDevice(nomeDispositivo, user_id = null) {
        try {
            const pool = await connect();

            const apiKey = generateUniqueKey(24); // Gera uma API key de 48 caracteres hex
            const criptoKey = generateUniqueKey(32); // Gera uma chave de criptografia de 64 caracteres hex
            const ativa = true;
            const dataCriacao = new Date();
            const dataExpiracao = new Date();
            dataExpiracao.setFullYear(dataExpiracao.getFullYear() + 1); // Define a expiração para 1 ano

            const query = `
                INSERT INTO sessao (dispositivo, cripto_key, api_key, ativa, data_criacao, data_expiracao, user_id)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, dispositivo, api_key, cripto_key, ativa, data_criacao, data_expiracao, user_id;
            `;
            // Nota: O nome da coluna para data de criação é 'data_criacao'.
            // Se no seu banco estiver 'data_datacricao', ajuste a query acima.

            const values = [nomeDispositivo, criptoKey, apiKey, ativa, dataCriacao, dataExpiracao, user_id];
            const result = await pool.query(query, values);

            if (result.rows.length > 0) {
                const newSession = result.rows[0];
                return {
                    message: "Dispositivo registrado com sucesso!",
                    api_key: newSession.api_key,
                    cripto_key: newSession.cripto_key,
                    dispositivo: newSession.dispositivo,
                    data_expiracao: newSession.data_expiracao,
                    user_id: newSession.user_id
                };
            } else {
                throw new Error("Não foi possível registrar o dispositivo.");
            }
        } catch (err) {
            console.error("Erro ao registrar dispositivo no model:", err.message);
            if (err.message.includes('coluna "data_criacao" não existe') || err.message.includes('column "data_criacao" does not exist')) {
                throw new Error(`Erro de banco de dados: Verifique o nome da coluna de data de criação na tabela 'sessao'. Esperado 'data_criacao', mas pode ser 'data_datacricao'. Detalhes: ${err.message}`);
            }
            if (err.message.includes('relação "sessao" não existe') || err.message.includes('relation "sessao" does not exist')) {
                throw new Error("Erro de banco de dados: A tabela 'sessao' não foi encontrada. Verifique se ela foi criada corretamente.");
            }
            throw err;
        }
    },

    async validateDeviceApiKey(apiKey) {
        try {
            const pool = await connect();
            const query = `
                SELECT id, dispositivo, cripto_key, api_key, ativa, data_criacao, data_expiracao
                FROM sessao
                WHERE api_key = $1;
            `;
            const result = await pool.query(query, [apiKey]);

            if (result.rows.length === 0) {
                return null;
            }

            const session = result.rows[0];

            if (!session.ativa) {
                return 'inactive';
            }

            if (new Date(session.data_expiracao) <= new Date()) {
                return 'expired'; // API Key expirada
            }

            return session;
        } catch (err) {
            console.error("Erro ao validar API key do dispositivo no model:", err.message);
            throw err;
        }
    },

    //** FUNÇÃIO PARA DESATIVAR TODAS AS SESSÕES DE UM USUÁRIO **//
    async deactivateAllUserSessions(userId) {
        try {
            const pool = await connect();
            const query = `
                UPDATE sessao
                SET ativa = FALSE, data_expiracao = NOW() -- Invalida a chave de API imediatamente
                WHERE user_id = $1
                RETURNING *;
            `;
            const result = await pool.query(query, [userId]);
            return result.rows.length; // Retorna o número de sessões desativadas
        } catch (err) {
            console.error("Erro ao desativar sessões do usuário:", err.message);
            throw err;
        }
    },

    //** FUNÇÃO PARA DESATIVAR UMA SESSÕES DE UM USUÁRIO POR API KEY **// 
    async deactivateSessionByApiKey(apiKey) {
        try {
            const pool = await connect();
            const query = `
                UPDATE sessao
                SET ativa = FALSE, data_expiracao = NOW()
                WHERE api_key = $1
                RETURNING *;
            `;
            const result = await pool.query(query, [apiKey]);
            return result.rows[0] || null;
        } catch (err) {
            console.error("Erro ao desativar sessão pela API Key:", err.message);
            throw err;
        }
    },
    
    /**
     * Conta o número de sessões ativas para um usuário específico.
     * @param {number} userId O ID do usuário.
     * @returns {Promise<number>} O número de sessões ativas.
     */
    async countActiveSessionsForUser(userId) {
        try {
            const pool = await connect();
            const query = `
                SELECT COUNT(*)
                FROM sessao
                WHERE user_id = $1 AND ativa = TRUE;
            `;
            const result = await pool.query(query, [userId]);
            // COUNT(*) retorna um BIGINT, que é convertido para string. ParseInt para garantir um número.
            return parseInt(result.rows[0].count, 10);
        } catch (err) {
            console.error("Erro ao contar sessões ativas do usuário no model:", err.message);
            throw err;
        }
    }
};

export default deviceModel;
