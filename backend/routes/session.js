import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Session from "../models/Session.js";

const router = express.Router();

// ===============================
// Obtener sesiones activas
// ===============================
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user.id,
      isActive: true,
    }).sort({ createdAt: -1 });

    res.json(sessions);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo sesiones" });
  }
});

// ===============================
// Cerrar sesión actual
// ===============================
router.post("/logout-current", authMiddleware, async (req, res) => {
  try {
    await Session.findOneAndUpdate(
      { token: req.token, isActive: true },
      { isActive: false }
    );

    res.json({ msg: "Sesión actual cerrada" });
  } catch (err) {
    res.status(500).json({ msg: "Error cerrando sesión actual" });
  }
});

// ===============================
// Cerrar sesión por ID (RF3)
// ===============================
router.delete("/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;

    await Session.findOneAndUpdate(
      { sessionId, userId: req.user.id },
      { isActive: false }
    );

    res.json({ msg: "Sesión cerrada correctamente" });
  } catch (err) {
    res.status(500).json({ msg: "Error cerrando sesión" });
  }
});

// ===============================
// Cerrar TODAS las sesiones
// ===============================
router.post("/logout-all", authMiddleware, async (req, res) => {
  try {
    await Session.updateMany(
      { userId: req.user.id },
      { isActive: false }
    );

    res.json({ msg: "Todas las sesiones cerradas" });
  } catch (err) {
    res.status(500).json({ msg: "Error cerrando todas las sesiones" });
  }
});

export default router;
