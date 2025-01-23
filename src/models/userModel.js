import { connect } from "../../config/database.js";

// Função para adicionar um novo usuario a tabela users ADM/USER adm pode so adicionar outro adms '*tem que tratar essa função*'
export default {
    async addUser(name, email, password, user_type) {
        try {
            const pool = await connect();
            const res = await pool.query(
                "INSERT INTO users (name, email, password, user_type) VALUES ($1, $2, $3, $4) RETURNING *",
                [name, email, password, user_type]
            );
            return res.rows[0];
        } catch (err) {
            console.error('Erro ao cadastrar usuário:', err.message);
            throw err;
        }
    },
    
    // Cosulta ao banco, por ( id || nome || email )da tabela users ADM
    async selectUsersByIdOrNameOrEmail(id, name, email) {
        try {
    
            // Inicializa as partes dinâmicas da consulta
            const pool = await connect();
            let query = "SELECT * FROM users WHERE ";
            const values = [];
            const conditions = [];
    
            // Adiciona condições dinamicamente com base nos parâmetros fornecidos
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
    
            // Constrói a consulta final
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
    
            const pool = await connect(); // Garante que o pool está conectado
            const res = await pool.query("SELECT * FROM users");
            return res.rows;
    
        } catch (err) {
            console.error('Erro ao consultar os usuarios:', err.message);
            throw err; // Repassa o erro para tratamento posterior
        }
    },
    
    // Função para atualizar um usuário na tabela users ADM/USER
    async updateUser(id, name, email, password) {
        try {
            const pool = await connect();
            const res = await pool.query(
                "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
                [name, email, password, id]
            );
            return res.rows[0];
        } catch (err) {
            console.error('Erro ao atualizar usuário:', err.message);
            throw err;
        }
    },
    
    // Função para excluir um usuarido do tabela users por id ADM
    async deleteUser(id) {
        try {
            const pool = await connect();
            const res = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
            return res.rows[0];
        } catch (err) {
            console.error('Erro ao excluir usuário:', err.message);
            throw err;
        }
    }  
};


