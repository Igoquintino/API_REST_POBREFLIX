import express from "express";

const router = express.Router();

//Rotas
router.get("/", (req, res) => {
    res.json({
        message: "funcionando backend"
    });
});

export default router;
  