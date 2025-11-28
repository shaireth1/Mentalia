import AdminLog from "../models/AdminLog.js";

export async function getAdminLogs(req, res) {
  try {
    const logs = await AdminLog.find()
      .populate("adminId", "nombre email rol")
      .sort({ createdAt: -1 })
      .limit(200); // evitar que explote

    res.json(logs);
  } catch (err) {
    console.error("Error obteniendo logs:", err);
    res.status(500).json({ msg: "Error obteniendo logs" });
  }
}
