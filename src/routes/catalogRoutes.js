// src/routes/catalogRoutes.js
import express from "express";
import catalogModel from "../models/catalogModel.js";

const router = express.Router();

// Rota para listar todos os filmes/séries
router.get("/", async (req, res) => {
    try {
        if (Object.keys(req.query).length > 0) {
            return res.status(400).json({ 
                error: "Esta rota não aceita parâmetros. Use /catalog/:title para consultas específicas." 
            });
        }
        const catalog = await catalogModel.selectAllCatalog();
        res.json(catalog); // Correto
    } catch (err) {
        res.status(500).json({ error: `Erro ao buscar todos os filmes: ${err.message}` });
    }
}),
//concertar isso aqui também

router.get("/type/:content_type", async (req, res) => {
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
})

// Rota para consultar filme pelo título
router.get("/:title", async (req, res) => {
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
}),

// Rota para adicionar um filme ao catálogo
router.post("/addCatalog", async (req, res) => {
    try {
        const { title, description, genre, content_type, video_url } = req.body;
        const movie = await catalogModel.addToCatalog(title, description, genre, content_type, video_url);
        res.status(201).json(movie);
    } catch (err) {
        res.status(500).json({ error: `Erro ao cadastrar filme: ${err.message}` });
    }
}),

// Rota para atualizar um filme no catálogo
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, genre, content_type, video_url } = req.body;

        // Validação básica
        if (!title && !description && !genre && !content_type && !video_url) {
            return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização." });
        }

        if (content_type && !['filme', 'serie'].includes(content_type)) {
            return res.status(400).json({ error: "O campo content_type deve ser 'filme' ou 'serie'." });
        }

        // Atualiza os campos fornecidos
        const movie = await catalogModel.updateCatalog(id, { title, description, genre, content_type, video_url });

        if (!movie) {
            return res.status(404).json({ error: "Filme não encontrado para atualização." });
        }

        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ error: `Erro ao atualizar filme: ${err.message}` });
    }
}),

// Rota para excluir um filme do catálogo
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        // Chama o modelo para excluir o filme
        const deletedMovie = await catalogModel.deleteMovie(id);

        if (!deletedMovie) {
            return res.status(404).json({ error: "Filme não encontrado." });
        }

        res.status(204).send(); // Status 204 (No Content)
    } catch (err) {
        res.status(500).json({ error: `Erro ao excluir filme: ${err.message}` });
    }
});
export default router;

