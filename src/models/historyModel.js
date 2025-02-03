import { connect } from "../../config/database.js";

// Consulta ao banco, historico de consumo ADM
export default {

    async selectHistory() {
    
        const pool = await connect();
        const res = await pool.query("SELECT * FROM consumption_history");
        return res.rows;
    },

    // Consulta ao banco, historico de consumo ADM/USER
    async selectHistoryByUserId(userId) {
    
        const pool = await connect();
        const res = await pool.query("SELECT * FROM consumption_history WHERE user_id  = $1", [userId]);
        return res.rows;
    }
};