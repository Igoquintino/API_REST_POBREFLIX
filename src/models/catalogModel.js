import { connect } from "../../config/database.js";


// Função para adicionar um filme ou série ao catálogo ADM
export default {    
    //ta enviando o mesmo conteudo, concertar
    async addToCatalog(title, description, genre, content_type, video_url, image_url, creatorUserType) { // Adicionar filme no catalogo OK!
        try {
            console.log(title, description, genre, content_type, video_url);
            // Permitir criação de novos filmes ou séries somente por outro administrador
            if (creatorUserType !== 'Administrator') {
                throw new Error("Somente administradores podem adicionar filmes ou séries para o catálogo.");
            }
            console.log(title, image_url)

            // Verificação se ja existe o filme ou serie
            const data = await this.selectCatalogByTitle(title);
            console.log(data);

            const titlesSet = new Set(data.map(item => item.title));
            const newTitle = title;

                if (titlesSet.has(newTitle)) {
                    console.log("Esse título já existe!");
                    throw new Error("O filme ou serie ja existe no catálogo.")

                } else {
                    console.log("Título único, pode adicionar.");
                }

            // Validações
            if (!title || !content_type || !video_url) {
                throw new Error("Os campos title, content_type e video_url são obrigatórios.");
            }
            if (!['filme', 'serie'].includes(content_type)) {
                throw new Error("O campo content_type deve ser 'filme' ou 'serie'.");
            }
    
            const pool = await connect();
            const res = await pool.query(
                "INSERT INTO catalog (title, description, genre, content_type, video_url, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
                [title, description, genre, content_type, video_url, image_url]
            );

            return res.rows[0];
        } catch (err) {
            console.error('Erro ao adicionar filme ao catálogo:', err.message);
            throw err;
        }
    },
    
    // Função para consultar todo o catálogo ADM/USER
    async selectAllCatalog() { // Lista todos o catalogo OK!
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

    async selectCatalogByType(content_type) { // Lista todos pelo tipo Catálogo OK!
        try {
            const pool = await connect();
            const res = await pool.query("SELECT * FROM catalog WHERE content_type = $1", [content_type]);
            return res.rows;
        } catch (err) {
            console.error('Erro ao consultar por tipo:', err.message);
            throw err;
        }
    },

    // Função para consultar filme pelo título ADM/USER
    async selectCatalogByTitle(title) { // Busca por Titulo ou ID OK!
        try {
            const pool = await connect();
            const query = "SELECT * FROM catalog WHERE upper(title) LIKE '%' || upper($1) || '%'";
            const values = [title]; // Parâmetros em um único array
            const res = await pool.query(query, values);
            
    
            if (res.rows.length === 0) {
                console.log(`Nenhum filme encontrado com o nome: ${title} e rowCount: ${res.rowCount}`);
                return [{ message: `fdNenhum filme encontrado com o nome: ${title} e rowCount: ${res.rowCount}` }];
            }
    
            return res.rows;
        } catch (err) {
            console.log(`Erro ao consultar o catálogo: ${err.message}`);
            throw err;
        }
    },

    async selectCatalogByID(id) { // Busca por Titulo ou ID OK!
        try {
            const userId = parseInt(id)
            console.log(userId)
            const pool = await connect();
            const query = "SELECT * FROM catalog WHERE id = $1";
            const values = [userId]; // Parâmetros em um único array
            const res = await pool.query(query, values);
            
    
            if (res.rows.length === 0) {
                console.log(`Nenhum filme encontrado com o ID: ${id}`);
                return [{ message: `Nenhum filme encontrado com o ID: ${id}` }];
            }
    
            return res.rows;
        } catch (err) {
            console.log(`Erro ao consultar o catálogo: ${err.message}`);
            throw err;
        }
    },
    
    // // Função para atualizar informações de um filme ADM
    // async updateCatalog(id, fields) {
    //     try {
    //         const pool = await connect();
    
    //         // Busca o filme atual no banco
    //         const existingMovieQuery = "SELECT * FROM catalog WHERE id = $1";
    //         const existingMovieResult = await pool.query(existingMovieQuery, [id]);
    
    //         if (existingMovieResult.rows.length === 0) {
    //             throw new Error("Filme ou Série não encontrado.");
    //         }
    
    //         const existingMovie = existingMovieResult.rows[0];
    
    //         // Mantém os valores antigos caso não sejam enviados na requisição
    //         const updatedFields = {
    //             title: fields.title || existingMovie.title,
    //             description: fields.description || existingMovie.description,
    //             genre: fields.genre || existingMovie.genre,
    //             content_type: fields.content_type || existingMovie.content_type,
    //             video_url: fields.video_url || existingMovie.video_url,
    //             poster_url: fields.poster_url || existingMovie.poster_url, // Inclui o poster_url
    //         };
    
    //         // Constrói a query dinamicamente
    //         const keys = Object.keys(updatedFields);
    //         const values = keys.map((key) => updatedFields[key]);
    
    //         const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
    //         const query = `UPDATE catalog SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
    
    //         // Executa a query e retorna o filme atualizado
    //         const result = await pool.query(query, [...values, id]);
    //         return result.rows[0];
    //     } catch (err) {
    //         console.error("Erro ao atualizar filme:", err.message);
    //         throw err;
    //     }
    // },
    // Função para atualizar informações de um filme ADM
async updateCatalog(id, fields) {
    try {
        const pool = await connect();

        // Busca o filme atual no banco
        const existingMovieQuery = "SELECT * FROM catalog WHERE id = $1";
        const existingMovieResult = await pool.query(existingMovieQuery, [id]);

        if (existingMovieResult.rows.length === 0) {
            throw new Error("Filme ou Série não encontrado.");
        }

        const existingMovie = existingMovieResult.rows[0];

        // Mantém os valores antigos caso não sejam enviados na requisição
        const updatedFields = {
            title: fields.title || existingMovie.title,
            description: fields.description || existingMovie.description,
            genre: fields.genre || existingMovie.genre,
            content_type: fields.content_type || existingMovie.content_type,
            video_url: fields.video_url || existingMovie.video_url,
            image_url: fields.image_url || existingMovie.image_url, // Substitui poster_url por image_url
        };

        // Constrói a query dinamicamente
        const keys = Object.keys(updatedFields);
        const values = keys.map((key) => updatedFields[key]);

        const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
        const query = `UPDATE catalog SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;

        // Executa a query e retorna o filme atualizado
        const result = await pool.query(query, [...values, id]);
        return result.rows[0];
    } catch (err) {
        console.error("Erro ao atualizar filme:", err.message);
        throw err;
    }
}
,
   
    // Função para excluir um filme do catálogo por ID ADM
    async deleteMovie(id) { // Deletar filme no catalogo OK!
        try {
            const pool = await connect();
            const query = "DELETE FROM catalog WHERE id = $1 RETURNING *";
            const result = await pool.query(query, [id]);
            return result.rows[0] || null; // Retorna o filme excluído ou null se não encontrado
        } catch (err) {
            console.error("Erro ao excluir filme:", err.message);
            throw err;
        }
    }  
};


