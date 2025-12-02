// backend/routes/session.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Session from "../models/Session.js";
import { endAnonSession } from "../controllers/sessionController.js";

const router = express.Router();

// ⭐ Ruta que TU FRONTEND NECESITA
router.post("/end/:sessionId", endAnonSession);

// PING — Actualiza actividad del usuario autenticado
router.post("/ping", authMiddleware, async (req, res) => {
  try {
    const session = await Session.findOne({
      userId: req.user.id,
      isActive: true,
    });

    if (session) {
      session.lastActivity = new Date();
      await session.save();
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("❌ Error en ping:", err);
    res.status(500).json({ ok: false });
  }
});

export default router;
