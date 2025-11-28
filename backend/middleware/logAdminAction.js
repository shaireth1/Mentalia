import AdminLog from "../models/AdminLog.js";

export async function logAdminAction(req, res, next) {
  try {
    // Solo registrar si el usuario es psicóloga/admin
    if (req.user?.rol === "admin") {
      await AdminLog.create({
        adminId: req.user.id,
        action: "Acción administrativa",
        endpoint: req.originalUrl,
        method: req.method,
        description: `La psicóloga realizó una acción en ${req.originalUrl}`,
        ip: req.ip,
      });
    }
  } catch (err) {
    console.error("❌ Error registrando AdminLog:", err);
  }

  next();
}
