// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No autorizado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // guardamos datos útiles en req
    req.user = { id: decoded.id, email: decoded.email };
    req.token = token;
    next();
  } catch (error) {
    console.error("❌ Error en authMiddleware:", error);
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
}
