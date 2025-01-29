// src/routes/catalogRoutes.js
import express from "express";
import catalogController from "../controllers/catalogController.js";

const router = express.Router();

router.get("/", catalogController.getAllCatalog); // Lista todos o catalogo USER
router.get("/type/:content_type", catalogController.getCatalogByType); // Busca por Type USER
router.get("/:title", catalogController.getCatalogByTitle); // Busca por Titulo USER
router.post("/addCatalog", catalogController.createCatalog); // Adicionar filme no catalog ADM
router.patch("/:id", catalogController.upCatalog); // atualizar filme no catalog ADM
router.delete("/:id", catalogController.deleteCatalog); // excluir filme no catalog ADM

export default router;





























// Rota para listar todos os filmes/séries

// router.get("/", async (req, res) => {
//     try {
//         if (Object.keys(req.query).length > 0) {
//             return res.status(400).json({ 
//                 error: "Esta rota não aceita parâmetros. Use /catalog/:title para consultas específicas." 
//             });
//         }
//         const catalog = await catalogModel.selectAllCatalog();
//         res.json(catalog);
//     } catch (err) {
//         res.status(500).json({ error: `Erro ao buscar todos os filmes: ${err.message}` });
//     }
// }),

// // Rota para consultar filmes por tipo
// router.get("/type/:content_type", async (req, res) => {
//     try {
//         if (Object.keys(req.query).length > 0) {
//             return res.status(400).json({
//                 error: "Esta rota não aceita parâmetros. Use /catalog/:title para consultas específicas.",
//             });
//         }
//         const catalog = await catalogModel.selectCatalogByType(req.params.content_type);
//         res.json(catalog);
//     } catch (err) {
//         res.status(500).json({ error: `Erro ao buscar filmes: ${err.message}` });
//     }
// })

// // Rota para consultar filme pelo título
// router.get("/:title", async (req, res) => {
//     try {
//         if (Object.keys(req.query).length > 0) {
//             return res.status(400).json({
//                 error: "Esta rota não aceita parâmetros. Use /catalog/:title para consultas específicas.",
//             });
//         }addCatalog
//         const catalog = await catalogModel.selectCatalogByTitle(req.params.title);
//         res.json(catalog);  
//     } catch (err) {
//         res.status(500).json({ error: `Erro ao buscar filme: ${err.message}` });
//     }
// }),

// // Rota para adicionar um filme ao catálogo
// router.post("/addCatalog", async (req, res) => {
//     try {
//         const { title, description, genre, content_type, video_url } = req.body;
//         const movie = await catalogModel.addToCatalog(title, description, genre, content_type, video_url);
//         res.status(201).json(movie);
//     } catch (err) {
//         res.status(500).json({ error: `Erro ao cadastrar filme: ${err.message}` });
//     }
// }),

// // Rota para atualizar um filme no catálogo
// router.patch("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { title, description, genre, content_type, video_url } = req.body;

//         if (!title && !description && !genre && !content_type && !video_url) {
//             return res.status(400).json({ error: "Pelo menos um campo deve ser fornecido para atualização." });
//         }

//         if (content_type && !['filme', 'serie'].includes(content_type)) {
//             return res.status(400).json({ error: "O campo content_type deve ser 'filme' ou 'serie'." });
//         }

//         const movie = await catalogModel.updateCatalog(id, { title, description, genre, content_type, video_url });

//         if (!movie) {
//             return res.status(404).json({ error: "Filme não encontrado para atualização." });
//         }

//         res.status(200).json(movie);
//     } catch (err) {
//         res.status(500).json({ error: `Erro ao atualizar filme: ${err.message}` });
//     }
// }),

// // Rota para excluir um filme do catálogo
// router.delete("/:id", async (req, res) => {
//     try {
//         const { id } = req.params;

//         const deletedMovie = await catalogModel.deleteMovie(id);

//         if (!deletedMovie) {
//             return res.status(404).json({ error: "Filme não encontrado." });
//         }

//         res.status(204).send();
//     } catch (err) {
//         res.status(500).json({ error: `Erro ao excluir filme: ${err.message}` });
//     }
// });
// export default router;
