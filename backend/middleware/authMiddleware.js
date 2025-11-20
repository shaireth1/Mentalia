// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No se proporcionó token." });
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ msg: "Token inválido o expirado." });
    }

    // Buscar sesión activa por token (más seguro)
    const session = await Session.findOne({ token });

    if (!session) {
      return res.status(401).json({ msg: "Sesión no encontrada." });
    }

    // Validar si ya está expirada
    const THIRTY_MIN = 30 * 60 * 1000;
    const lastActivity = session.lastActivity.getTime();
    const now = Date.now();

    if (now - lastActivity > THIRTY_MIN) {
      session.isActive = false;
      await session.save();
      return res.status(440).json({ msg: "Sesión expirada por inactividad." });
    }

    // Sesión válida → actualizar actividad
    session.lastActivity = new Date();
    await session.save();

    req.user = { id: decoded.id, email: decoded.email };
    req.token = token;

    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res.status(401).json({ msg: "Error de autenticación." });
  }
}
