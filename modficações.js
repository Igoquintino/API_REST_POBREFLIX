 //*** LOGICA PARA SIMULTANEOIDADE ESTRITA ***//
            
            // 1. Desativar todas as sessões existentes para este user_id
            // const deactivatedCount = await deviceModel.deactivateAllUserSessions(user.id);
            // if (deactivatedCount > 0) {
            //     console.log(`Desativadas ${deactivatedCount} sessões anteriores para o usuário ID: ${user.id}`);
            //     await logService.recordLog({
            //         req,
            //         operacao: 'SESSION_REVOCATION',
            //         status: 'SUCCESS',
            //         id_usuario_especifico: user.id,
            //         descricao: `Revogadas ${deactivatedCount} sessões anteriores devido a novo login.`
            //     });
            // 
  //*** FIM LOGICA SIMULTANEOIDADE ESTRITA ***//

  //*** LOGICA DESATIVAR SESSÕES EM EXCESSO ***// 
              // sessionsToDeactivateCount = await deviceModel.deactivateExcessUserSessions(user.id, maxAllowedSessionsForUser);
              // console.log(user.id)
              // console.log(`sessionsToDeactivateCount: ${sessionsToDeactivateCount} dlskdlskldksldklskdlskldks`);
  
              // if (sessionsToDeactivateCount > 0) {
              //     console.log(`Desativadas ${sessionsToDeactivateCount} sessões anteriores em excesso para o usuário ID: ${user.id}`);
              //     await logService.recordLog({
              //         req,
              //         operacao: 'SESSION_REVOCATION_EXCESS', // Nova operação de log
              //         status: 'SUCCESS',
              //         id_usuario_especifico: user.id,
              //         descricao: `Revogadas ${sessionsToDeactivateCount} sessões anteriores em excesso devido a novo login (Limite: ${maxAllowedSessionsForUser}).`
              //     });
              // }
  //*** FIM LOGICA DESATIVAR SESSÕES EM EXCESSO ***//

  //*** LOGICA PARA DESATIVAR SESSÕES EM EXCESSO ***// 
    //  * @param {number} userId O ID do usuário cujas sessões serão verificadas.
    //  * @param {number} maxAllowedSessions O número máximo de sessões ativas permitidas para este usuário.
    //  * @returns {number} O número de sessões desativadas.
    //  */
    // async deactivateExcessUserSessions(userId, maxAllowedSessions) {
    //     try {
    //         const pool = await connect();

    //         // 1. Encontra todas as sessões ativas do usuário, ordenadas da mais antiga para a mais nova.
    //         const activeSessionsQuery = `
    //             SELECT id, api_key
    //             FROM sessao
    //             WHERE user_id = $1 AND ativa = TRUE
    //             ORDER BY data_criacao ASC;
    //         `;
    //         const result = await pool.query(activeSessionsQuery, [userId]);
    //         const activeSessions = result.rows; // Array de { id, api_key }

    //         // 2. Identifica quais sessões precisam ser desativadas.
    //         //    Se o número de sessões ativas for maior que o permitido, desativa as mais antigas.
    //         if (activeSessions.length > maxAllowedSessions) {
    //             const sessionsToDeactivate = activeSessions.slice(0, activeSessions.length - maxAllowedSessions);
    //             const sessionIdsToDeactivate = sessionsToDeactivate.map(session => session.id);

    //             if (sessionIdsToDeactivate.length > 0) {
    //                 const deactivateQuery = `
    //                     UPDATE sessao
    //                     SET ativa = FALSE, data_expiracao = NOW()
    //                     WHERE id = ANY($1::int[]) -- Usa ANY para desativar um array de IDs
    //                     RETURNING id, api_key;
    //                 `;
    //                 const deactivatedResult = await pool.query(deactivateQuery, [sessionIdsToDeactivate]);
    //                 console.log(`Desativadas ${deactivatedResult.rows.length} sessões em excesso para o usuário ID: ${userId}`);
    //                 return deactivatedResult.rows.length;
    //             }
    //         }
    //         return 0; // Nenhuma sessão em excesso para desativar
    //     } catch (err) {
    //         console.error("Erro ao desativar sessões em excesso do usuário no model:", err.message);
    //         throw err;
    //     }
    // }
  //*** FIM LOGICA DESATIVAR SESSÕES EM EXCESSO ***/