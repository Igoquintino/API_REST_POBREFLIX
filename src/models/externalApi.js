import { connect } from "../../config/database.js"; // Assuming your database connection is here

const createExternalApiRecord = async (source, catalogId) => {
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
};

export default { createExternalApiRecord };
