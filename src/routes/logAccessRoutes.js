import express from "express";
import logAccessModel from "../models/logAccessModel.js";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const logAccess = await logAccessModel.logAccess();
        res.json(logAccess);
    } catch (err) {
        res.status(500).json({ error: `Erro ao buscar o log de acesso: ${err.message}` });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const logAccess = await logAccessModel.logAccessByUserId(req.params.id);
        res.json(logAccess);
    } catch (err) {
        res.status(500).json({ error: `Erro ao buscar o log de acesso: ${err.message}` });
    }
});

export default router;
