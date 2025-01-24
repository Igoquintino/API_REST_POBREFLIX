import { connect } from "../../config/database.js";

export default {
    async logAccess() {

        const pool = await connect();
        const res = await pool.query("SELECT * FROM consumption_reports");
        return res.rows;
        
    },
    // Consulta ao banco, relatorio de consumo ou log de acesso por id ADM/USER
    async logAccessByUserId(catalog_id) {
    
        const pool = await connect();
        const res = await pool.query("SELECT * FROM consumption_reports WHERE catalog_id = $1", [catalog_id]);
        return res.rows;
    }
};
