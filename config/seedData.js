import { connect } from './database.js';

const seedDatabase = async () => {
    let pool; // Definir pool fora do try

    try {
        pool = await connect();

        console.log("Limpando banco de dados...");

        // Drop das tabelas para evitar duplicação de dados
        await pool.query(`
            DROP TABLE IF EXISTS external_api CASCADE;
            DROP TABLE IF EXISTS consumption_reports CASCADE;
            DROP TABLE IF EXISTS consumption_history CASCADE;
            DROP TABLE IF EXISTS catalog CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
        `);

        console.log("Criando tabelas...");

        // Recriação das tabelas
        await pool.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                user_type VARCHAR(50) CHECK (user_type IN ('Administrator', 'Client', 'Premium')) NOT NULL
            );

            CREATE TABLE catalog (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                genre VARCHAR(100),
                content_type VARCHAR(50) CHECK (content_type IN ('filme', 'serie')) NOT NULL,
                video_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE consumption_history (
                id SERIAL PRIMARY KEY,
                user_id INT REFERENCES users(id) ON DELETE CASCADE,
                catalog_id INT REFERENCES catalog(id) ON DELETE CASCADE,
                watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE consumption_reports (
                id SERIAL PRIMARY KEY,
                catalog_id INT REFERENCES catalog(id) ON DELETE CASCADE UNIQUE,
                views INT DEFAULT 0,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE external_api (
                id SERIAL PRIMARY KEY,
                source VARCHAR(100) NOT NULL,
                catalog_id INT UNIQUE REFERENCES catalog(id) ON DELETE CASCADE,
                synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            ALTER TABLE catalog ADD COLUMN image_url TEXT;
        `);

        console.log("Inserindo dados...");

        // Inserir usuários (Administrador, Cliente, Premium) 
        // senha do Admin User: admin123, senha do Client User: client123 e Premium User: premium123
        await pool.query(`
            INSERT INTO users (name, email, password, user_type) VALUES
            ('Admin User', 'admin@example.com', '$2a$12$K0bIrolcARfSxQM2.LFFsOU7eZHKgjY.1lLk3dglBqXbE8ZNuc0N2', 'Administrator'),
            ('Client User', 'client@example.com', '$2a$12$dElPVKSM3n/AUnLlf1.UquLmKjGCHpyMjghPK3YeM6/UwVYWanGJm', 'Client'),
            ('Premium User', 'premium@example.com', '$2a$12$pdRyj9MLmMnFt4n5vOBfiuQWTuSAOEZryM4Z4X9Y05ApS/8MoNiIW', 'Premium')
        `);

        // Inserir filmes no catálogo
        await pool.query(`
            INSERT INTO catalog (title, description, genre, content_type, video_url, image_url) VALUES
            ('Shrek 2', 'Após se casar com a Princesa Fiona...', 'Animação, Família, Comédia', 'filme', 'https://superflixapi.link/filme/tt0298148', 'https://image.tmdb.org/t/p/w500/2yYP0PQjG8zVqturh1BAqu2Tixl.jpg'),
            ('Interestelar', 'As reservas naturais da Terra...', 'Épico, Missão, Sci-Fi', 'filme', 'https://superflixapi.link/filme/tt0816692', 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg')
        `);

        // Inserir histórico de consumo (simulando que o cliente assistiu um filme)
        await pool.query(`
            INSERT INTO consumption_history (user_id, catalog_id) VALUES (2, 1), (2, 2)
        `);

        // Atualizar relatórios de consumo (quantidade de views)
        await pool.query(`
            INSERT INTO consumption_reports (catalog_id, views) VALUES (1, 1), (2, 1)
        `);

        // Inserir integração com API externa
        await pool.query(`
            INSERT INTO external_api (source, catalog_id) VALUES
            ('superflix', 1),
            ('superflix', 2)
            ON CONFLICT (catalog_id) DO NOTHING
        `);

        console.log("Banco de dados preenchido com sucesso!");
    } catch (err) {
        console.error("Erro ao preencher o banco:", err);
    }
};

export default seedDatabase;
