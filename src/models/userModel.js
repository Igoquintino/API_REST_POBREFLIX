import { connect } from "../../config/database.js";
import bcrypt from "bcrypt";


// Função para adicionar um novo usuario a tabela users ADM/USER adm pode so adicionar outro adms '*tem que tratar essa função*'
export default {
    async addUser(name, email, password, user_type) {
        try {
            const pool = await connect();
    
            // Hash da senha com custo 10
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const query = `
                INSERT INTO users (name, email, password, user_type) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id, name, email, user_type`;
            const values = [name, email, hashedPassword, user_type];
    
            const result = await pool.query(query, values);

            console.log("Senha hasheada:", hashedPassword);

            return result.rows[0];
        } catch (err) {
            console.error("Erro ao cadastrar usuário:", err.message);
            throw err;
        }
    },
    
    // Cosulta ao banco, por ( id || nome || email )da tabela users ADM
    async selectUsersByIdOrNameOrEmail(id, name, email) {
        try {
            const pool = await connect();
            let query = "SELECT * FROM users WHERE ";
            const values = [];
            const conditions = [];
    
            if (id) {
                conditions.push("id = $1");
                values.push(id);
            }
            if (name) {
                conditions.push(`name ILIKE $${values.length + 1}`);
                values.push(`%${name}%`);
            }
            if (email) {
                conditions.push(`email ILIKE $${values.length + 1}`);
                values.push(`%${email}%`);
            }
    
            // Valida se ao menos um parâmetro foi passado
            if (conditions.length === 0) {
                throw new Error("Pelo menos um parâmetro (id, name ou email) deve ser fornecido.");
            }

            query += conditions.join(" OR ");
            const res = await pool.query(query, values);
    
            return res.rows;
     
        } catch (err) {
    
            console.log(`Erro ao consultar o catálogo: ${err.message}`);
            throw err;
        }
    },
    
    // Consulta ao banco, todos os usuarios ADM
    async selectAllUsers() {
        try {

            const pool = await connect(); 
            const res = await pool.query("SELECT * FROM users");
            return res.rows;
    
        } catch (err) {
            console.error('Erro ao consultar os usuarios:', err.message);
            throw err; 
        }
    },
    
    // Função para atualizar um usuário na tabela users ADM/USER
    async updateUser(id, fields) {
        try {
            const pool = await connect();
    
            const existingUserQuery = "SELECT * FROM users WHERE id = $1";
            const existingUserResult = await pool.query(existingUserQuery, [id]);
            if (existingUserResult.rows.length === 0) {
                throw new Error("Usuário não encontrado.");
            }
    
            const existingUser = existingUserResult.rows[0];
    
            const updatedFields = {
                name: fields.name || existingUser.name,
                email: fields.email || existingUser.email,
                password: fields.password || existingUser.password, // mantém o password atual
            };

            const keys = Object.keys(updatedFields);
            const values = keys.map((key) => updatedFields[key]);
    
            const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
            const query = `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING id, name, email, user_type`;
    
            const result = await pool.query(query, [...values, id]);
            return result.rows[0];
        } catch (err) {
            console.error("Erro ao atualizar usuário:", err.message);
            throw err;
        }
    },
    
    // Função para excluir um usuarido do tabela users por id ADM
    async deleteUser(id) {
        try {
            const pool = await connect();
            const query = "DELETE FROM users WHERE id = $1 RETURNING *";
            const result = await pool.query(query, [id]);
            return result.rows[0] || null; 
        } catch (err) {
            console.error("Erro ao excluir usuário:", err.message);
            throw err;
        }
    } 
};


