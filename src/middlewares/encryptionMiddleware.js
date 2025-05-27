import cryptoHelper from '../utils/cryptoHelper.js';

export const decryptRequest = (req, res, next) => {
    // Verifica se a requisição tem um corpo para descriptografar
    if (!req.body || !req.body.encryptedData) {
        // Se não houver dados criptografados, pode ser uma rota que não precisa de criptografia (como um GET)
        // ou um erro do cliente. Por segurança, podemos deixar passar para o controller decidir.
        // Se quisermos forçar que TODAS as rotas POST/PATCH aqui sejam criptografadas, poderíamos retornar um erro 400.
        // Por flexibilidade, vamos deixar passar por enquanto.
        return next();
    }

    // O middleware requireApiKey já deve ter rodado e validado a sessão
    if (!req.deviceSession || !req.deviceSession.cripto_key) {
        return res.status(401).json({
            error: "Sessão de dispositivo inválida. O middleware requireApiKey deve ser executado antes."
        });
    }

    const { encryptedData, iv, authTag } = req.body;

    if (!encryptedData || !iv || !authTag) {
        return res.status(400).json({
            error: "Dados de criptografia incompletos. 'encryptedData', 'iv' e 'authTag' são obrigatórios."
        });
    }

    try {
        const { cripto_key } = req.deviceSession;

        // Descriptografa os dados
        const decryptedPayload = cryptoHelper.decrypt(encryptedData, iv, authTag, cripto_key);

        console.log(decryptedPayload);
        // Tenta converter a string descriptografada para JSON
        const decryptedBody = JSON.parse(decryptedPayload);

        // Substitui o corpo da requisição pelo corpo descriptografado
        req.body = decryptedBody;

        next(); // Prossegue para o próximo middleware/controller com o req.body descriptografado

    } catch (error) {
        // Se a descriptografia ou o JSON.parse falharem, retorna um erro.
        return res.status(400).json({
            error: "Falha ao processar a requisição criptografada.",
            details: error.message
        });
    }
};
