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
router.post("/", async (req, res) => {
    try {
        const { title, description, release_date, genre } = req.body;
        const movie = await catalogModel.addToCatalog(title, description, release_date, genre);
        res.status(201).json(movie);
    } catch (err) {
        res.status(500).json({ error: `Erro ao cadastrar filme: ${err.message}` });
    }
}),

// Rota para atualizar um filme no catálogo
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, release_date, genre } = req.body;
        const movie = await catalogModel.updateMovie(id, title, description, release_date, genre);
        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json({ error: `Erro ao atualizar filme: ${err.message}` });
    }
}),

// Rota para excluir um filme do catálogo
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await catalogModel.deleteMovie(id);
        res.status(204).send(); // Resposta vazia, mas com status 204 (sem conteúdo)
    } catch (err) {
        res.status(500).json({ error: `Erro ao excluir filme: ${err.message}` });
    }
});
export default router;

