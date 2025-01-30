import { verifyToken } from "../utils/auth.js";
import { connect} from "../../config/database.js";

export const authenticate = async (req, res, next) => {
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido ou inválido." });
    }

    try {
        const token = authHeader.split(" ")[1];
       
        const userDecode = await verifyToken(token); 
        
        const pool = await connect();

        const user = await pool.query("SELECT * FROM users WHERE id = $1", [userDecode.userId]);
        
        console.log(user.rows[0]);

        if(!user.rows[0]) {
            return res.status(401).json({ error: "Token inválido. usuario" });
        }       

        req.createUserType = userDecode.userType;

        next();
    } catch (err) {
        return res.status(401).json({ error: err.message });
    }
};

