import historyModel from "../models/historyModel.js";

const historyController = {
    async getAllHistory(req, res) { // Lista todos o histórico OK! USER
        try {

            const creatorUserType = req.createUserType;
            console.log("usuario autenticado: ",creatorUserType);

            // Impedindo usuários não-administradores de acessar a lista
            if (creatorUserType !== "Administrator") {
                return res.status(403).json({
                    error: "Apenas administradores podem visualizar o histórico geral.",
                });
            }

            const history = await historyModel.selectHistory();
            res.json(history);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar o histórico: ${err.message}` });
        }
    },

    async getAllHistoryById(req, res) { // Busca por ID ADM OK! ADM
        try { 
        
            // Pegando o userType corretamente do middleware
            const creatorUserType = req.createUserType;
    
            if (creatorUserType !== "Administrator" && creatorUserType !== "Client"){
                return res.status(403).json({
                    error: "Só usuário e administradores da PobreFlix podem visualizar o histórico.",
                });
            }

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
