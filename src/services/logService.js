import logModel from '../models/logModel.js';

// Valores padrão para campos NOT NULL, caso a informação não esteja disponível
// e a tabela não permita NULL. Ajuste conforme sua definição de tabela.
const DEFAULT_USER_ID_FOR_LOG = 0; // Use um ID de usuário "sistema" ou 0 se id_usuario for NOT NULL
const DEFAULT_IP = 'UNKNOWN_IP';
const DEFAULT_USER_AGENT = 'UNKNOWN_AGENT'; // Lembre-se que VARCHAR(45) é curto
const DEFAULT_DESCRIPTION = '-';


const logService = {
    /**
     * Prepara e registra uma entrada de log.
     * @param {object} params - Parâmetros para o log.
     * @param {object} params.req - O objeto da requisição Express (para IP e User Agent).
     * @param {string} params.operacao - Tipo de operação (ex: 'LOGIN_SUCCESS').
     * @param {string} params.status - Status da operação (ex: 'SUCCESS', 'FAILURE').
     * @param {string} [params.descricao] - Descrição opcional do evento.
     * @param {number} [params.id_usuario_especifico] - ID do usuário específico para este log (ignora req.userId).
     */
    async recordLog({
                        req,
                        operacao,
                        status,
                        descricao,
                        id_usuario_especifico
                    }) {
        try {
            const ip = req.ip || (req.socket ? req.socket.remoteAddress : null) || DEFAULT_IP;

            let userAgent = req.headers ? req.headers['user-agent'] : null;
            if (userAgent && userAgent.length > 45) { // Ajuste para o tamanho da sua coluna user_agent
                userAgent = userAgent.substring(0, 45);
            }
            userAgent = userAgent || DEFAULT_USER_AGENT;

            // Determina o id_usuario
            let userIdToLog = null;
            if (typeof id_usuario_especifico !== 'undefined') {
                userIdToLog = id_usuario_especifico;
            } else if (req.userId) { // req.userId é definido pelo authMiddleware (JWT)
                userIdToLog = req.userId;
            } else if (req.deviceSession && req.deviceSession.id_usuario_associado) { // Exemplo, se deviceSession tivesse id_usuario
                // Esta linha é um exemplo, você precisaria ter esse dado na req.deviceSession
                // userIdToLog = req.deviceSession.id_usuario_associado;
            }

            // Se a coluna id_usuario for NOT NULL na sua tabela, e userIdToLog for null aqui:
            if (userIdToLog === null /* && sua_coluna_id_usuario_eh_NOT_NULL */) {
                // ATENÇÃO: Se sua coluna `id_usuario` for `NOT NULL` no PostgreSQL,
                // você PRECISA fornecer um valor. `DEFAULT_USER_ID_FOR_LOG` (ex: 0) é uma opção.
                // Se sua coluna `id_usuario` permite NULL, pode deixar `userIdToLog` como `null`.
                // Confirme a definição da sua tabela `log`.
                // Para o exemplo, vamos assumir que se userIdToLog é null, e a coluna é NOT NULL, usamos o default.
                // Se a coluna permite NULL, esta linha pode ser removida ou ajustada.
                // userIdToLog = DEFAULT_USER_ID_FOR_LOG; // Descomente e ajuste se necessário
            }


            const finalDescription = descricao || DEFAULT_DESCRIPTION;

            const logEntryData = {
                operacao,
                descricao: finalDescription,
                timestamp: new Date(), // O model também pode gerar isso, mas é bom ter aqui
                id_usuario: userIdToLog,
                ip: ip,
                user_agent: userAgent,
                status
            };

            await logModel.addLog(logEntryData);
            // console.log('Log registrado:', operacao, status); // Opcional: log no console do servidor
        } catch (error) {
            console.error(`Falha ao gravar log para operação '${operacao}':`, error.message);
            // Importante: A falha no log não deve quebrar a funcionalidade principal.
        }
    }
};

export default logService;