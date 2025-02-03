import { connect } from "../../config/database.js";

export const registerConsumption = async (userId, catalogId) => {
    try {
        const pool = await connect();

        // Verifica se o catalogId existe
        const catalogQuery = "SELECT id FROM catalog WHERE id = $1";
        const catalogResult = await pool.query(catalogQuery, [catalogId]);

        if (catalogResult.rows.length === 0) {
            throw new Error("O catalogId fornecido não existe.");
        }

        // Insere o histórico de consumo
        const historyQuery = `
            INSERT INTO consumption_history (user_id, catalog_id)
            VALUES ($1, $2)
            RETURNING *`;
        await pool.query(historyQuery, [userId, catalogId]);

        // Atualiza os relatórios de consumo
        const reportQuery = `
            INSERT INTO consumption_reports (catalog_id, views)
            VALUES ($1, 1)
            ON CONFLICT (catalog_id) 
            DO UPDATE SET views = consumption_reports.views + 1, updated_at = CURRENT_TIMESTAMP
            RETURNING *`;
        const reportResult = await pool.query(reportQuery, [catalogId]);

        return reportResult.rows[0];
    } catch (err) {
        console.error("Erro ao registrar o consumo:", err.message);
        throw err;
    }
};
