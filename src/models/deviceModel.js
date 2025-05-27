import { connect } from "../../config/database.js";
import crypto from 'crypto'; // Para gerar chaves únicas

// Função para gerar uma chave aleatória (para API key e Cripto key)
const generateUniqueKey = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

const deviceModel = {
    async registerDevice(nomeDispositivo) {
        try {
            const pool = await connect();

            const apiKey = generateUniqueKey(24); // Gera uma API key de 48 caracteres hex
            const criptoKey = generateUniqueKey(32); // Gera uma chave de criptografia de 64 caracteres hex
            const ativa = true;
            const dataCriacao = new Date();
            const dataExpiracao = new Date();
            dataExpiracao.setFullYear(dataExpiracao.getFullYear() + 1); // Define a expiração para 1 ano

            const query = `
                INSERT INTO sessao (dispositivo, cripto_key, api_key, ativa, data_criacao, data_expiracao)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id, dispositivo, api_key, cripto_key, ativa, data_criacao, data_expiracao;
            `;
            // Nota: O nome da coluna para data de criação é 'data_criacao'.
            // Se no seu banco estiver 'data_datacricao', ajuste a query acima.

            const values = [nomeDispositivo, criptoKey, apiKey, ativa, dataCriacao, dataExpiracao];
            const result = await pool.query(query, values);

            if (result.rows.length > 0) {
                const newSession = result.rows[0];
                return {
                    message: "Dispositivo registrado com sucesso!",
                    api_key: newSession.api_key,
                    cripto_key: newSession.cripto_key,
                    dispositivo: newSession.dispositivo,
                    data_expiracao: newSession.data_expiracao
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
    }
};

export default deviceModel;
