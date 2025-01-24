import historyModel from "../models/historyModel.js";

const historyController = {
    async getAllHistory(req, res) {
        try {
            const history = await historyModel.selectHistory();
            res.json(history);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar o histórico: ${err.message}` });
        }
    },

    async getAllHistoryById(req, res) {
        try {
            if (Object.keys(req.query).length > 0) {
                return res.status(400).json({
                    error: "Esta rota não aceita parâmetros. Use /history/:id para consultas específicas.",
                });
            }
            const history = await historyModel.selectHistoryByUserId(req.params.id);
            res.json(history);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar o histórico: ${err.message}` });
        }
    }
};

export default historyController;