import externalApi from '../models/externalApiModel.js';
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
      const apiRecord = await externalApi.createExternalApiRecord(source, catalogId);
  
      return res.status(201).json(apiRecord);
    } catch (err) {
      console.error("Erro ao registrar o uso da API:", err.message);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  },

  async selectAllApiUsage(req, res) {
    try {
      // Pegando o userType corretamente do middleware
      const creatorUserType = req.createUserType;
    
      // Impedindo usuários não-administradores de acessar a lista
      if (creatorUserType !== "Administrator") {
          return res.status(403).json({
              error: "Apenas administradores podem visualizar os registros de api.",
          });
      }
      
      const apiUsage = await externalApi.selectAllApiUsage();
      return res.status(200).json(apiUsage);
    } catch (err) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

export default externalApiController;
