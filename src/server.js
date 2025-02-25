import dotenv from "dotenv";
import seedDatabase from '../config/seedData.js';

dotenv.config();
console.log(`Connection String: veja ${process.env.CONNECTION_STRING}`);  // Adicione essa linha para verificar a string de conexão

import express from "express";
import catalogRoutes from "./routes/catalogRoutes.js"; // Importando as rotas de catálogo
import userRoutes from "./routes/userRoutes.js";
import rootRoutes from "./routes/rootRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import logAccessRoutes from "./routes/logAccessRoutes.js";
import consumptionRoutes from "./routes/consumptionRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import externalApiRoutes from './routes/externalApiRoutes.js';
import cors from "cors";


const port = process.env.PORT || 3000;
export const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
export const TMDB_API_KEY = process.env.TMDB_API_KEY;

const app = express();
app.use(express.json());
//app.use(express.urlencoded({ extended: true })); // Garante suporte a dados URL-encoded
// Habilite o CORS
app.use(cors()); // Isso permitirá que o backend aceite requisições de qualquer origem. Se quiser restringir a origem, você pode configurar o CORS mais especificamente.

seedDatabase();

// Rotas
app.use("/catalog", catalogRoutes); //*
app.use("/", rootRoutes); 
app.use("/users", userRoutes); // * *
app.use("/history", historyRoutes); //** 
app.use("/logAccess", logAccessRoutes); //**
app.use("/consumption", consumptionRoutes); // *
app.use("/auth", authRoutes); // Adiciona as rotas de autenticação *
app.use('/api/external-api', externalApiRoutes); // vericar isso muito bem *


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

