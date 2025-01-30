import { verifyToken } from "../utils/auth.js";

export const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido ou inválido." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token); // Decodifica e valida o token
        req.userId = decoded.userId;       // Adiciona userId ao req
        req.userType = decoded.userType;   // Adiciona userType, se necessário

        next(); // Continua para a próxima função
    } catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
};


// {
//     "email": "client1@example.com",
//     "password": "senhaClient"
// }