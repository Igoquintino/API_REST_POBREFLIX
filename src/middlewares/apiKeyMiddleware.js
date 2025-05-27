import deviceModel from "../models/deviceModel.js"; // Certifique-se que o caminho está correto

export const requireApiKey = async (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Nome do header para a API Key

    if (!apiKey) {
        return res.status(401).json({ // 401 Unauthorized
            error: "Acesso não autorizado. Header 'X-API-Key' é obrigatório.",
        });
    }

    try {
        const sessionOrStatus = await deviceModel.validateDeviceApiKey(apiKey);

        if (sessionOrStatus === null) {
            return res.status(401).json({ error: "API Key inválida ou não encontrada." });
        }
        if (sessionOrStatus === 'inactive') {
            return res.status(403).json({ error: "API Key não está ativa. Por favor, registre o dispositivo novamente ou contate o suporte." }); // 403 Forbidden
        }
        if (sessionOrStatus === 'expired') {
            return res.status(403).json({ error: "API Key expirada. Por favor, registre o dispositivo novamente." }); // 403 Forbidden
        }

        // Se a chave é válida e sessionOrStatus é o objeto da sessão:
        req.deviceSession = sessionOrStatus; // Anexa dados da sessão ao request (incluindo cripto_key)
        // console.log('API Key validada para o dispositivo:', sessionOrStatus.dispositivo);
        next(); // Prossegue para a próxima rota/middleware

    } catch (err) {
        console.error("Erro no middleware requireApiKey:", err.message);
        return res.status(500).json({ error: "Erro interno ao validar a API Key." });
    }
};
