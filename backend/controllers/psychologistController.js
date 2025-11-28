import Alert from "../models/Alert.js";
import Conversation from "../models/Conversation.js";
import CrisisPhrase from "../models/CrisisPhrase.js";

// 📌 Obtener TODAS las alertas críticas
export async function getCriticalAlerts(req, res) {
  try {
    const alerts = await Alert.find({ isCritical: true })
      .populate("userId", "programa ficha")
      .sort({ createdAt: -1 });

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo alertas" });
  }
}

// 📌 Marcar alerta como atendida
export async function resolveAlert(req, res) {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ msg: "Alerta no existe" });

    alert.resolved = true;
    await alert.save();

    res.json({ msg: "Alerta marcada como atendida" });
  } catch (err) {
    res.status(500).json({ msg: "Error actualizando alerta" });
  }
}

// 📌 Cargar conversación completa asociada a una alerta
export async function getConversationByAlert(req, res) {
  try {
    const alert = await Alert.findById(req.params.alertId);
    if (!alert) return res.status(404).json({ msg: "Alerta no hallada" });

    const convo = await Conversation.findById(alert.conversationId);
    res.json(convo);
  } catch (err) {
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

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ msg: "Error buscando conversaciones" });
  }
}

// ⭐⭐⭐ NUEVO: Cantidad de alertas críticas pendientes para el dashboard
export async function getPendingCriticalCount(req, res) {
  try {
    const count = await Alert.countDocuments({
      isCritical: true,
      resolved: false
    });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo cantidad de alertas" });
  }
}
