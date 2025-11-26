import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

export async function authMiddleware(req, res, next) {
  try {
    let token = null;

    // 1️⃣ Intentar leer desde Authorization: Bearer xxxx
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2️⃣ Si no hubo token en headers, intentar desde cookie
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }

    // 3️⃣ Si sigue sin token → 401
    if (!token) {
      return res.status(401).json({ msg: "No autenticado. No hay token." });
    }

    // 4️⃣ Verificar JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ msg: "Token inválido o expirado." });
    }

    // 5️⃣ Validar sesión activa usando tu modelo Session
    const session = await Session.findOne({
      userId: decoded.id,
      isActive: true,
    });

    if (!session) {
      return res.status(401).json({ msg: "Sesión no encontrada o cerrada." });
    }

    // 6️⃣ Verificar expiración por inactividad (1h)
    const ONE_HOUR = 60 * 60 * 1000;
    if (Date.now() - session.lastActivity > ONE_HOUR) {
      session.isActive = false;
      await session.save();
      return res.status(440).json({ msg: "Sesión expirada por inactividad." });
    }

    session.lastActivity = new Date();
    await session.save();

    // 7️⃣ Guardar usuario autenticado
    req.user = {
      id: decoded.id,
      email: decoded.email,
      rol: decoded.rol,
    };

    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    res.status(401).json({ msg: "Error de autenticación." });
  }
}
