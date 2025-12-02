import Alert from "../models/Alert.js";
import Conversation from "../models/Conversation.js";
import CrisisPhrase from "../models/CrisisPhrase.js";
import AdminLog from "../models/AdminLog.js";

// Función helper para que el log NUNCA rompa el endpoint
async function safeAdminLog(payload) {
  try {
    await AdminLog.create(payload);
  } catch (err) {
    console.error("❌ Error registrando AdminLog:", err);
  }
}

// 📌 Obtener TODAS las alertas críticas (RF16)
export async function getCriticalAlerts(req, res) {
  try {
    const alerts = await Alert.find({ isCritical: true })
      .populate("userId", "programa ficha")
      .sort({ createdAt: -1 });

    // RNF9 — log (no debe romper)
    await safeAdminLog({
      adminId: req.user?.id,
      action: "VER ALERTAS CRÍTICAS",
      endpoint: "/alerts",
      ip: req.ip
    });

    res.json(alerts);
  } catch (err) {
    console.error("❌ Error obteniendo alertas críticas:", err);
    res.status(500).json({ msg: "Error obteniendo alertas críticas" });
  }
}

// 📌 Marcar alerta como atendida
export async function resolveAlert(req, res) {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ msg: "Alerta no existe" });

    alert.resolved = true;
    await alert.save();

    // RNF9 — log
    await safeAdminLog({
      adminId: req.user?.id,
      action: "ATENDER ALERTA",
      endpoint: "/alerts/:id/resolve",
      details: { alertId: req.params.id },
      ip: req.ip
    });

    res.json({ msg: "Alerta marcada como atendida" });
  } catch (err) {
    console.error("❌ Error actualizando alerta:", err);
    res.status(500).json({ msg: "Error actualizando alerta" });
  }
}

// 📌 Cargar conversación completa asociada a una alerta
export async function getConversationByAlert(req, res) {
  try {
    const alert = await Alert.findById(req.params.alertId);
    if (!alert) return res.status(404).json({ msg: "Alerta no hallada" });

    const convo = await Conversation.findById(alert.conversationId);

    // RNF9 — log
    await safeAdminLog({
      adminId: req.user?.id,
      action: "VER CONVERSACIÓN DE ALERTA",
      endpoint: "/alerts/:id/conversation",
      details: { alertId: req.params.alertId },
      ip: req.ip
    });

    res.json(convo);
  } catch (err) {
    console.error("❌ Error obteniendo conversación:", err);
    res.status(500).json({ msg: "Error obteniendo conversación" });
  }
}

// 📌 Búsqueda de conversaciones
export async function searchConversations(req, res) {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.status(400).json({ msg: "keyword requerido" });

    const conversations = await Conversation.find({
      "messages.text": { $regex: keyword, $options: "i" }
    });

    // RNF9 — log
    await safeAdminLog({
      adminId: req.user?.id,
      action: "BUSCAR CONVERSACIONES",
      endpoint: "/conversations/search",
      details: { keyword },
      ip: req.ip
    });

    res.json(conversations);
  } catch (err) {
    console.error("❌ Error buscando conversaciones:", err);
    res.status(500).json({ msg: "Error buscando conversaciones" });
  }
}

// ⭐⭐⭐ Cantidad de alertas críticas pendientes — Dashboard
export async function getPendingCriticalCount(req, res) {
  try {
    const count = await Alert.countDocuments({
      isCritical: true,
      resolved: false
    });

    // RNF9 — log
    await safeAdminLog({
      adminId: req.user?.id,
      action: "VER CONTADOR DE ALERTAS",
      endpoint: "/alerts/pending/count",
      ip: req.ip
    });

    res.json({ count });
  } catch (err) {
    console.error("❌ Error obteniendo cantidad de alertas:", err);
    res.status(500).json({ msg: "Error obteniendo cantidad de alertas" });
  }
}
