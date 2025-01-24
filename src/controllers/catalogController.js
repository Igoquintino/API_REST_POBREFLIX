import catalogModel from "../models/catalogModel.js";

const catalogController = {

    async getAllCatalog(req, res) {
        try {
            if (Object.keys(req.query).length > 0) {
                return res.status(400).json({ 
                    error: "Esta rota não aceita parâmetros. Use /catalog/:title para consultas específicas." 
                });
            }
            const catalog = await catalogModel.selectAllCatalog();
            res.json(catalog);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar todos os filmes: ${err.message}` });
        }
    },
    
    // Rota para consultar filmes por tipo
    async getCatalogByType(req, res){
        try {
            if (Object.keys(req.query).length > 0) {
                return res.status(400).json({
                    error: "Esta rota não aceita parâmetros. Use /catalog/:title para consultas específicas.",
                });
            }
            const catalog = await catalogModel.selectCatalogByType(req.params.content_type);
            res.json(catalog);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar filmes: ${err.message}` });
        }
    },
    
    // Rota para consultar filme pelo título
    async getCatalogByTitle(req, res) {
        try {
            if (Object.keys(req.query).length > 0) {
                return res.status(400).json({
                    error: "Esta rota não aceita parâmetros. Use /catalog/:title para consultas específicas.",
                });
            }
            const catalog = await catalogModel.selectCatalogByTitle(req.params.title);
            res.json(catalog);  
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar filme: ${err.message}` });
        }
    },
    
    // Rota para adicionar um filme ao catálogo
    async createCatalog(req, res){
        try {
            const { title, description, genre, content_type, video_url } = req.body;
            const movie = await catalogModel.addToCatalog(title, description, genre, content_type, video_url);
            res.status(201).json(movie);
        } catch (err) {
            res.status(500).json({ error: `Erro ao cadastrar filme: ${err.message}` });
        }
    },
    
    // Rota para atualizar um filme no catálogo
    async upCatalog (req, res) {
        try {
            const { id } = req.params;
            const { title, description, genre, content_type, video_url } = req.body;
    
            if (!title && !description && !genre && !content_type && !video_url) {
                return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização." });
            }
    
            if (content_type && !['filme', 'serie'].includes(content_type)) {
                return res.status(400).json({ error: "O campo content_type deve ser 'filme' ou 'serie'." });
            }
    
            const movie = await catalogModel.updateCatalog(id, { title, description, genre, content_type, video_url });
    
            if (!movie) {
                return res.status(404).json({ error: "Filme ou Serie não encontrado para atualização." });
            }
    
            res.status(200).json(movie);
        } catch (err) {
            res.status(500).json({ error: `Erro ao atualizar filme: ${err.message}` });
        }
    },
    
    // Rota para excluir um filme do catálogo
    async deleteCatalog(req, res) {
        try {
            const { id } = req.params;
    
            const deletedMovie = await catalogModel.deleteMovie(id);
    
            if (!deletedMovie) {
                return res.status(404).json({ error: "Filme não encontrado." });
            }
    
            res.status(204).send();
        } catch (err) {
            res.status(500).json({ error: `Erro ao excluir filme: ${err.message}` });
        }
    }
};

export default catalogController;
