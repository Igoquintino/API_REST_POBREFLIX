import { registerConsumption } from "../models/consumptionModel.js";

const consumptionController = {
    async register(req, res) {
        try {
            const { catalogId } = req.body;
            const userId = req.userId;

            if (!catalogId) {
                return res.status(400).json({ error: "O campo catalogId é obrigatório." });
            }

            try {
                const result = await registerConsumption(userId, catalogId);
                res.status(201).json(result);
            } catch (err) {
                if (err.message === "O catalogId fornecido não existe.") {
                    return res.status(404).json({ error: err.message });
                }
                throw err; // Repassa outros erros para o bloco catch geral
            }
        } catch (err) {
            res.status(500).json({ error: `Erro ao registrar o consumo: ${err.message}` });
        }
    },
};

export default consumptionController;
