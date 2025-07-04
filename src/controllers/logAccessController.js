import logAccessModel from "../models/logAccessModel.js";

const logAccessController = {

    async getAllLogs(req, res){ // Lista todos o log de acesso OK! ADM
        try {
            // Pegando o userType corretamente do middleware
            const creatorUserType = req.createUserType;
    
            // Impedindo usuários não-administradores de acessar a lista
            if (creatorUserType !== "Administrator") {
                return res.status(403).json({
                    error: "Apenas administradores podem visualizar o log de acesso.",
                });
            }

            const logAccess = await logAccessModel.getAllLog();
            res.json(logAccess);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar o log de acesso: ${err.message}` });
        }
    },

    async getLogAccessAll(req, res){ // Lista todos o log de acesso OK! ADM
        try {
            // Pegando o userType corretamente do middleware
            const creatorUserType = req.createUserType;
    
            // Impedindo usuários não-administradores de acessar a lista
            if (creatorUserType !== "Administrator") {
                return res.status(403).json({
                    error: "Apenas administradores podem visualizar o log de acesso.",
                });
            }

            const logAccess = await logAccessModel.logAccess();
            res.json(logAccess);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar o log de acesso: ${err.message}` });
        }
    },
    
    async getLogAccessById(req, res){ // Lista por ID o log de acesso OK! ADM
        try {
            // Pegando o userType corretamente do middleware
            const creatorUserType = req.createUserType;
    
            // Impedindo usuários não-administradores de acessar a lista
            if (creatorUserType !== "Administrator") {
                return res.status(403).json({
                    error: "Apenas administradores podem visualizar o log de acesso de um usuário.",
                });
            }
    
            const logAccess = await logAccessModel.logAccessByUserId(req.params.id);
            console.log(logAccess);
            res.json(logAccess);
        } catch (err) {
            res.status(500).json({ error: `Erro ao buscar o log de acesso: ${err.message}` });
        }
    }
};

export default logAccessController;
