import { connect } from "../../config/database.js";


// Função para adicionar um filme ou série ao catálogo ADM
export default {    
    async addToCatalog(title, description, release_date, genre) {
        try {
            const pool = await connect();
            const res = await pool.query(
                "INSERT INTO catalog (title, description, release_date, genre) VALUES ($1, $2, $3, $4) RETURNING *",
                [title, description, release_date, genre]
            );
            return res.rows[0];
        } catch (err) {
            console.error('Erro ao adicionar filme ao catálogo:', err.message);
            throw err;
        }
    },
    
    // Função para consultar todo o catálogo ADM/USER
    async selectAllCatalog() {
        try {
            const pool = await connect();
            const res = await pool.query("SELECT * FROM catalog");
            if (res.rows.length === 0) {
                console.log('Nenhum filme encontrado no catálogo');
                return [];
            }
            return res.rows;
        } catch (err) {
            console.error('Erro ao consultar o catálogo:', err.message);
            throw err;
        }
    },
    
    // Função para consultar filme pelo título ADM/USER
    async selectCatalogByTitle(title) {
        try {
            const pool = await connect();
            const res = await pool.query("SELECT * FROM catalog WHERE title = $1", [title]);
    
            if (res.rows.length === 0) {
                console.log(`Nenhum filme encontrado com o nome: ${title} e rowCount: ${res.rowCount}`);
                return [{ message: `Nenhum filme encontrado com o nome: ${title} e rowCount: ${res.rowCount}` }];
            }
    
            return res.rows;
        } catch (err) {
            console.log(`Erro ao consultar o catálogo: ${err.message}`);
            throw err; 
        }
    },
    
    // Função para atualizar informações de um filme ADM
    async updateMovie(id, title, description, release_date, genre) {
        try {
            const pool = await connect();
            const res = await pool.query(
                "UPDATE catalog SET title = $1, description = $2, release_date = $3, genre = $4 WHERE id = $5 RETURNING *",
                [title, description, release_date, genre, id]
            );
            return res.rows[0];
        } catch (err) {
            console.error('Erro ao atualizar filme no catálogo:', err.message);
            throw err;
        }
    },
   
    // Função para excluir um filme do catálogo por ID ADM
    async deleteMovie(id) {
        try {
            const pool = await connect();
            const res = await pool.query("DELETE FROM catalog WHERE id = $1 RETURNING *", [id]);
            return res.rows[0];
        } catch (err) {
            console.error('Erro ao excluir filme do catálogo:', err.message);
            throw err;
        }
    }    
};
