import { connect } from "../../config/database.js";
import bcrypt from "bcrypt";


// Função para adicionar um novo usuario a tabela users ADM/USER adm pode so adicionar outro adms '*tem que tratar essa função*'
export default {
    async addUser(name, email, password, user_type, creatorUserType) { // Criar user ADM/USER OK!
        try {
            const pool = await connect();

            // Permitir criação de administrador somente por outro administrador
            if (creatorUserType !== 'Administrator') {
                throw new Error("Somente administradores podem criar outros administradores.");
            }
    
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

    async createPublicUser(name, email, password) { // Criar user para o publico,tudo OK!
        try {
            const pool = await connect();
    
            // 1️⃣ Verifica se o email já existe
            const emailCheckQuery = "SELECT id FROM users WHERE email = $1";
            const emailCheckResult = await pool.query(emailCheckQuery, [email]);
    
            if (emailCheckResult.rows.length > 0) {
                throw new Error("Este email já está em uso.");
            }
    
            // 2️⃣ Faz o hash da senha
            const hashedPassword = await bcrypt.hash(password, 10);
    
            // 3️⃣ Insere o novo usuário como "Client"
            const insertQuery = `
                INSERT INTO users (name, email, password, user_type)
                VALUES ($1, $2, $3, 'Client')
                RETURNING id, name, email, user_type
            `;
            const values = [name, email, hashedPassword];
            const result = await pool.query(insertQuery, values);
    
            return result.rows[0]; // Retorna os dados do usuário recém-criado
        } catch (err) {
            console.error("Erro ao cadastrar usuário público:", err.message);
            throw err;
        }
    },

    //Buscar um usuário pelo email no banco de dados.
    async getUserByEmail(email) {
        try {
            const pool = await connect();
            const query = "SELECT * FROM users WHERE email = $1";
            const result = await pool.query(query, [email]);
            return result.rows[0] || null; // Retorna o usuário ou null se não encontrado
        } catch (err) {
            console.error("Erro ao buscar usuário por email:", err.message);
            throw err;
        }
    },

    // Cosulta ao banco, por ( id || nome || email )da tabela users ADM
    async selectUsersByIdOrNameOrEmail(id, name, email) { // Busca por id, name ou email OK! ADM
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
    
    async selectAllUsers() { // Busca todos os usuários OK! ADM
        try {
            
            const pool = await connect();

            const res = await pool.query("SELECT * FROM users");

            return res.rows;
        } catch (err) {

            console.error("Erro ao consultar os usuários:", err.message);
            throw new Error("Erro ao buscar usuários no banco de dados.");
        }
    }, 

    async updateUser(id, fields) { // funcionando tudo OK! ADM/USER
        try {
            const pool = await connect();
    
            // 1. Busca o usuário no banco para obter valores atuais
            const existingUserQuery = "SELECT * FROM users WHERE id = $1";
            const existingUserResult = await pool.query(existingUserQuery, [id]);
    
            if (existingUserResult.rows.length === 0) {
                throw new Error("Usuário não encontrado.");
            }
    
            const existingUser = existingUserResult.rows[0];
    
            // 2. Se a senha for alterada, faz o hash antes de salvar
            if (fields.password) {
                fields.password = await bcrypt.hash(fields.password, 10);
            }
    
            // 3. Mantém os valores antigos caso não sejam enviados na requisição
            const updatedFields = {
                name: fields.name || existingUser.name,
                email: fields.email || existingUser.email,
                password: fields.password || existingUser.password,
                user_type: fields.user_type || existingUser.user_type // Mantém o tipo atual se não for alterado
            };
    
            // 4. Constrói a query dinamicamente
            const keys = Object.keys(updatedFields);
            const values = keys.map((key) => updatedFields[key]);
    
            const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
            const query = `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING id, name, email, user_type`;
    
            // 5. Executa a query e retorna o usuário atualizado
            const result = await pool.query(query, [...values, id]);
            return result.rows[0];
        } catch (err) {
            console.error("Erro ao atualizar usuário:", err.message);
            throw err;
        }
    }
,    
    // Função para excluir um usuario d tabela users por id ADM
    async deleteUser(id, creatorUserType) { // funcionando tudo OK! ADM
        try {  
            
            if (creatorUserType !== 'Administrator') {
                throw new Error("Somente administradores podem excluir outros usuários.");
            }

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

