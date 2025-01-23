import connect from "./config/database.js";

export async function logAccess() {

    const pool = await connect();
    const res = await pool.query("SELECT * FROM consumption_reports");
    return res.rows;
    
}

// Consulta ao banco, relatorio de consumo ou log de acesso por id ADM/USER
export async function logAccessByUserId(user_id) {

    const pool = await connect();
    const res = await pool.query("SELECT * FROM consumption_reports WHERE user_id = $1", [user_id]);
    return res.rows;
}

