import jwt from "jsonwebtoken";


const SECRET_KEY = "minha_chave_secreta";
const TOKEN_EXPIRATION = process.env.JWT_EXPIRES_IN || "2h";

export const generateToken = (userId, userType) => {
    return jwt.sign({ userId, userType }, SECRET_KEY, { expiresIn: TOKEN_EXPIRATION });
};

export const verifyToken = async (token) => {
    try {
        //console.log("Token recebido para verificação:", token); // Para verificar o token recebido
        //console.log("SECRET_KEY utilizada:", SECRET_KEY); // Para verificar a chave secreta
        const decoded = await jwt.verify(token, SECRET_KEY); // Tenta verificar e decodificar
        //console.log("Token decodificado:", decoded); // Exibe o payload do token decodificado
        return decoded;
    } catch (err) {
        console.error("Erro ao verificar token:", err.name, err.message); // Log detalhado do erro
        throw new Error("Token inválido ou expirado.");
    }
};
