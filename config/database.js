import pkg from 'pg';

const { Pool } = pkg;

export async function connect() {
    if (!global.connection) {
        const connectionString = process.env.CONNECTION_STRING;

        // Verifique se a string de conexão está correta
        console.log('Connection String:', connectionString);

        const pool = new Pool({
            connectionString: connectionString,
        });

        console.log('Criou um pool de conexão com o PostgreSQL');

        try {
            const client = await pool.connect();
            const res = await client.query("SELECT NOW()");
            console.log(`PostgreSQL conectado em ${res.rows[0].now}`);
            client.release();

            global.connection = pool; // Define o pool na variável global
        } catch (err) {
            console.error('Erro ao conectar ao PostgreSQL:', err.message);
            throw err; // Repassa o erro para tratamento posterior
        }
    }

    return global.connection; // Retorna o pool
}
