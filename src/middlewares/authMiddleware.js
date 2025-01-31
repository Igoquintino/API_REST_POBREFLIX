import { verifyToken } from "../utils/auth.js";
import { connect} from "../../config/database.js";

export const authenticate = async (req, res, next) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido ou inválido." });
    }
    
    const token = authHeader.split(" ")[1];
    
    // verifca se o token está na blacklist
    if (isTokenBlacklisted(token)) {
        return res.status(401).json({ error: "Token expirado ou inválido." });
    }

    try {   
        const userDecode = await verifyToken(token);         
        const pool = await connect();
        const user = await pool.query("SELECT * FROM users WHERE id = $1", [userDecode.userId]);
        if(!user.rows[0]) {
            return res.status(401).json({ error: "Token inválido. usuario" });
        }       
        req.createUserType = userDecode.userType;
        req.userId = userDecode.userId;
        next();
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
};


// Middleware para verificar e bloquear tokens LOGOUT
const blacklist = []; // Array para armazenar tokens bloqueados

export const addToBlacklist = (token, expiresIn) => {
    const expiresAt = Date.now() + expiresIn * 1000;
    blacklist.push({token, expiresAt});

    cleanupBlacklist();
};

export const isTokenBlacklisted = (token) => {
    cleanupBlacklist();
    return blacklist.some(entry => entry.token === token);
};

const cleanupBlacklist = () => {
    const now = Date.now();
    while (blacklist.length > 0 && blacklist[0].expiresAt < now){
            blacklist.shift();
    }
};

