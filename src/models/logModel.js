import { connect } from "../../config/database.js";

const logModel = {
    /**
     * Adiciona uma nova entrada de log ao banco de dados.
     * @param {object} logEntryData - Objeto contendo os dados do log.
     * @param {string} logEntryData.operacao - Tipo de operação (ex: 'LOGIN_SUCCESS').
     * @param {string} logEntryData.descricao - Descrição do log.
     * @param {Date} logEntryData.timestamp - Timestamp da ocorrência.
     * @param {number|null} logEntryData.id_usuario - ID do usuário (ou null/0 se não aplicável).
     * @param {string} logEntryData.ip - Endereço IP.
     * @param {string} logEntryData.user_agent - User agent do cliente.
     * @param {string} logEntryData.status - Status da operação (ex: 'SUCCESS', 'FAILURE').
     * @returns {Promise<object>} O registro de log inserido.
     */
    async addLog(logEntryData) {
        const {
            operacao,
            descricao,
            timestamp,
            id_usuario, // Será null ou um valor padrão se a tabela não permitir NULL
            ip,
            user_agent,
            status
        } = logEntryData;

        const formattedTimestamp = timestamp instanceof Date ? timestamp.toISOString() : new Date().toISOString();

        const query = `
            INSERT INTO log (operacao, descricao, timestamp, id_usuario, ip, user_agent, status)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;

        const values = [
            operacao,
            descricao,
            formattedTimestamp,
            id_usuario,
            ip,
            user_agent,
            status
        ];

        try {
            const pool = await connect();
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            console.error("Erro ao inserir log no banco de dados:", error.message);
            // Em um cenário de produção, você pode querer um tratamento de erro mais robusto aqui,
            // mas evite que uma falha no log quebre a operação principal.
            throw error; // Ou apenas logue o erro e não o relance, dependendo da criticidade do log.
        }
    }
};

export default logModel;