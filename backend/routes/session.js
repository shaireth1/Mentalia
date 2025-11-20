// backend/routes/session.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Session from "../models/Session.js";

const router = express.Router();

// PING — Actualiza actividad del usuario
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
