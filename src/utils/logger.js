// src/utils/logger.js
import { connect } from "../../config/database.js";

const log = async (operacao, descricao, id_usuario, ip, user_agent, status) => {
    try {
        const pool = await connect();
        const query = `
            INSERT INTO log (operacao, descricao, timestamp, id_usuario, ip, user_agent, status)
            VALUES ($1, $2, NOW(), $3, $4, $5, $6)
        `;
        await pool.query(query, [operacao, descricao, id_usuario, ip, user_agent, status]);
        console.error("REGISTRADO");
    } catch (err) {
        console.error("Erro ao registrar log:", err.message);
    }
};

export default log;