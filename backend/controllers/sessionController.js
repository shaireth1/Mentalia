// backend/controllers/sessionController.js
import Session from "../models/Session.js";

/**
 * Obtener sesiones activas del usuario logueado
 * (para pintarlas en Ajustes → Seguridad y sesiones)
 */
export async function getSessions(req, res) {
  try {
    const sessions = await Session.find({
      userId: req.user.id,
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.json(sessions);
  } catch (error) {
    console.error("❌ Error en getSessions:", error);
    return res.status(500).json({ msg: "Error al obtener sesiones" });
  }
}

/**
 * Cerrar la sesión ACTUAL (RF3 opción “cerrar solo esta sesión”)
 */
export async function logoutCurrent(req, res) {
  try {
    const token = req.token; // lo llenaremos en el middleware
    if (!token) return res.status(400).json({ msg: "Token no encontrado" });

    await Session.findOneAndUpdate(
      { token, userId: req.user.id },
      { isActive: false }
    );

    return res.json({ msg: "Sesión actual cerrada correctamente" });
  } catch (error) {
    console.error("❌ Error en logoutCurrent:", error);
    return res.status(500).json({ msg: "Error al cerrar sesión actual" });
  }
}

/**
 * Cerrar TODAS las sesiones del usuario (RF3 opción “cerrar todas”)
 */
export async function logoutAll(req, res) {
  try {
    await Session.updateMany(
      { userId: req.user.id },
      { isActive: false }
    );

    return res.json({ msg: "Todas las sesiones han sido cerradas" });
  } catch (error) {
    console.error("❌ Error en logoutAll:", error);
    return res.status(500).json({ msg: "Error al cerrar todas las sesiones" });
  }
}
