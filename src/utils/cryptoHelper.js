import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits, recomendado para GCM
const AUTH_TAG_LENGTH = 16; // 128 bits

const cryptoHelper = {
    /**
     * Descriptografa dados usando AES-256-GCM.
     * @param {string} encryptedData - Os dados criptografados em Base64.
     * @param {string} ivBase64 - O IV em Base64.
     * @param {string} authTagBase64 - A tag de autenticação em Base64.
     * @param {string} keyHex - A chave de criptografia em formato hexadecimal.
     * @returns {string} - Os dados descriptografados em UTF-8.
     */
    decrypt(encryptedData, ivBase64, authTagBase64, keyHex) {
        try {
            const key = Buffer.from(keyHex, 'hex');
            const iv = Buffer.from(ivBase64, 'base64');
            const authTag = Buffer.from(authTagBase64, 'base64');
            const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
            decipher.setAuthTag(authTag);

            let decrypted = decipher.update(encryptedData, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            console.error("Falha na descriptografia:", error.message);
            // Lança um erro específico para ser tratado pelo middleware
            throw new Error("Não foi possível descriptografar os dados. Verifique os dados de criptografia ou a chave.");
        }
    }
};

export default cryptoHelper;
