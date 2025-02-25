import axios from "axios";
import { TMDB_BASE_URL, TMDB_API_KEY } from "../server.js";
import { connect } from "../../config/database.js"; // Assuming your database connection is here

export default {
  async createExternalApiRecord (source, catalogId){ // Registrar uso da API OK!
    const query = `
      INSERT INTO external_api (source, catalog_id)
      VALUES ($1, $2)
      ON CONFLICT (catalog_id) DO NOTHING
      RETURNING *;
    `;
    
    const values = [source, catalogId];
    
    try {
      const pool = await connect();

      // Verifica se já existe um registro com esse catalog_id
      const checkQuery = `SELECT * FROM external_api WHERE catalog_id = $1`;
      const checkResult = await pool.query(checkQuery, [catalogId]);

      if (checkResult.rows.length > 0) {
          return { message: "Registro já existente, nenhuma ação realizada" };
      }

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
  },
  async getMoviePoster(movieTitle) {
    try {

        // Faz a requisição para buscar o filme pelo título
        const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
            params: {
                api_key: TMDB_API_KEY,
                query: movieTitle, // Usa apenas o título recebido
            },
        });

        const movies = response.data.results;

        if (movies.length === 0) {
            return { error: "Filme não encontrado" };
        }

        // Pegamos o primeiro filme da lista de resultados
        const movie = movies[0];
        const posterPath = movie.poster_path;

        if (!posterPath) {
            return { error: "Este filme não tem cartaz disponível." };
        }

        return {
            title: movie.title,
            poster_url: `https://image.tmdb.org/t/p/w500${posterPath}`,
        };
    } catch (error) {
        console.error("Erro ao buscar cartaz do filme:", error.message);
        return { error: "Erro ao acessar a API do TMDb" };
    }
},
}

