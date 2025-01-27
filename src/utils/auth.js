import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "minha_chave_secreta";

export const generateToken = (userId) => {
    return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, SECRET_KEY);  // Verifica e decodifica o token
    } catch (err) {
        throw new Error("Token inválido ou expirado.");
    }
};


