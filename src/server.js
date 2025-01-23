import dotenv from "dotenv";

dotenv.config();
console.log(`Connection String: veja ${process.env.CONNECTION_STRING}`);  // Adicione essa linha para verificar a string de conexão

import express from "express";
import catalogRoutes from "./routes/catalogRoutes.js"; // Importando as rotas de catálogo
import userRoutes from "./routes/userRoutes.js";
import rootRoutes from "./routes/rootRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";

const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());


// Rotas
app.use("/catalog", catalogRoutes);
app.use("/", rootRoutes); 
app.use("/users", userRoutes);
app.use("/history", historyRoutes);


app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

