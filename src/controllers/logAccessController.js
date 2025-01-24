import logAccessModel from "../models/logAccessModel.js";

const logAccessController = {

    async getLogAccessAll(req, res){
        try {
            const logAccess = await logAccessModel.logAccess();
            res.json(logAccess);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar o log de acesso: ${err.message}` });
        }
    },
    
    async getLogAccessById(req, res){
        try {
            const logAccess = await logAccessModel.logAccessByUserId(req.params.id);
            res.json(logAccess);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar o log de acesso: ${err.message}` });
        }
    }
};

export default logAccessController;
