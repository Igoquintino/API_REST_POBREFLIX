import createExternalApiRecord from '../models/externalApi.js';
import { connect } from '../../config/database.js';

const externalApiController = {

  async registerApiUsage (req, res) {
    const { source, catalogId } = req.body;  // Assuming 'source' and 'catalogId' come from the request body
  
    try {
      // Verifique se o 'catalogId' existe na tabela 'catalog' antes de registrar
      const pool = await connect();
      const catalogQuery = "SELECT id FROM catalog WHERE id = $1";
      const catalogResult = await pool.query(catalogQuery, [catalogId]);
  
      if (catalogResult.rows.length === 0) {
        return res.status(404).json({ error: "Catalog ID não encontrado" });
      }
  
      // Registra o uso da API
      const apiRecord = await createExternalApiRecord(source, catalogId);
  
      return res.status(201).json(apiRecord);
    } catch (err) {
      console.error("Erro ao registrar o uso da API:", err.message);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default externalApiController;
