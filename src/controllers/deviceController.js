import logService from "../services/logService.js";
import deviceModel from "../models/deviceModel.js";

const deviceController = {
    async registerNewDevice(req, res) {
        try {
            const { nome_dispositivo } = req.body;

            if (!nome_dispositivo) {
                // Log de tentativa de registro com falha (dados ausentes)
                await logService.recordLog({
                    req,
                    operacao: 'DEVICE_REGISTER', // Operação mais genérica para a tentativa
                    status: 'FAILURE',
                    descricao: "Tentativa de registrar dispositivo sem 'nome_dispositivo'."
                });
                return res.status(400).json({
                    error: "O campo 'nome_dispositivo' é obrigatório.",
                });
            }

            // Log da tentativa de registro
            await logService.recordLog({
                req,
                operacao: 'DEVICE_REGISTER',
                status: 'ATTEMPT', // Novo status para indicar uma tentativa
                descricao: `Tentativa de registrar dispositivo: '${nome_dispositivo}'`
            });

            const result = await deviceModel.registerDevice(nome_dispositivo); // Supondo que registerDevice retorna { api_key, cripto_key, dispositivo, ... }

            // Log de SUCESSO no registro do dispositivo
            await logService.recordLog({
                req,
                operacao: 'DEVICE_REGISTER', // A mesma operação, mas com status SUCCESS
                status: 'SUCCESS',
                // Não temos id_usuario aqui, a menos que o registro de dispositivo exija um usuário logado
                descricao: `Novo dispositivo registrado: '${result.dispositivo}'. API Key gerada: ${result.api_key.substring(0,8)}...`
            });

            res.status(201).json(result);

        } catch (err) {
            console.error("Erro no controller ao registrar dispositivo:", err.message);
            // Log de ERRO no registro do dispositivo
            await logService.recordLog({
                req,
                operacao: 'DEVICE_REGISTER',
                status: 'ERROR',
                descricao: `Erro ao registrar dispositivo '${req.body.nome_dispositivo || ''}': ${err.message}`
            });
            // Verifica se o erro é de banco de dados para retornar um status mais específico se desejar
            if (err.message.startsWith("Erro de banco de dados:")) {
                return res.status(500).json({ error: err.message });
            }
            res.status(500).json({ error: `Erro interno ao registrar o dispositivo: ${err.message}` });
        }
    }
    // Se você tiver outras funções no deviceController, pode adicionar logs a elas também.
};

export default deviceController;
