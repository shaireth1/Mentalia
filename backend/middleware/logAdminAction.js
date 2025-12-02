import AdminLog from "../models/AdminLog.js";

export const logAdminAction = async (req, res, next) => {
  try {
    await AdminLog.create({
      adminId: req.user?.id,
      action: "ADMIN_ACTION",
      endpoint: req.originalUrl,
      method: req.method || "UNKNOWN",
      ip: req.ip
    });
  } catch (err) {
    console.error("❌ Error registrando AdminLog:", err);
    // No detiene el endpoint
  }

  next();
};
