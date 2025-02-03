import { connect } from "../../config/database.js"; // Assuming your database connection is here

export default {
  async createExternalApiRecord (source, catalogId){ // Registrar uso da API OK!
    const query = `
      INSERT INTO external_api (source, catalog_id)
      VALUES ($1, $2)
      RETURNING *;
    `;
    
    const values = [source, catalogId];
    
    try {
      const pool = await connect();
      const result = await pool.query(query, values);
      return result.rows[0]; // Return the newly created record
    } catch (err) {
      console.error("Erro ao registrar o uso da API:", err);
      throw err;
    }
  },
  async selectAllApiUsage(){ // Pegar o uso da API OK!
    try{
      const pool = await connect();
      const apiUsageQuery = "SELECT * FROM external_api";
      const { rows } = await pool.query(apiUsageQuery);
      return rows;

    }
    catch (err) {
      console.error("Erro ao pegar o registro o uso da API:", err.message);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
};
