import express from "express";
import historyController from "../controllers/historyController.js";
import consumptionController from "../controllers/consumptionController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", historyController.getAllHistory); // Lista todos o histórico
router.get("/:id", historyController.getAllHistoryById); // Busca por ID

router.post("/", authenticate, consumptionController.register); // rota de autenticação

export default router;



















// router.get("/", async (req, res) => {
//     try {
//         const history = await historyModel.selectHistory();
//         res.json(history);
//     } catch (err) {
//         res.status(500).json({ error: `Erro ao buscar o histórico: ${err.message}` });
//     }
// });


// router.get("/:id", async (req, res) => {
//     try {
//         if (Object.keys(req.query).length > 0) {
//             return res.status(400).json({
//                 error: "Esta rota não aceita parâmetros. Use /history/:id para consultas específicas.",
//             });
//         }
//         const history = await historyModel.selectHistoryByUserId(req.params.id);
//         res.json(history);
//     } catch (err) {
//         res.status(500).json({ error: `Erro ao buscar o histórico: ${err.message}` });
//     }
// });

