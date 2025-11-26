// backend/controllers/alertController.js
import Alert from "../models/Alert.js";

// Crear alerta desde chatbot (RF9 + RF10)
export const createAlert = async (data) => {
  try {
    await Alert.create(data);
  } catch (err) {
    console.error("❌ Error creando alerta:", err);
  }
};

// Obtener todas las alertas
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo alertas" });
  }
};

// Filtrar alertas por estado / severidad
export const getFilteredAlerts = async (req, res) => {
  try {
    const { estado, severidad } = req.query;
    const filtro = {};

    if (estado) filtro.status = estado;
    if (severidad) filtro.severity = severidad;

    const alerts = await Alert.find(filtro).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: "Error filtrando alertas" });
  }
};

// Actualizar estado (marcar atendida)
export const updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Alert.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Alerta no encontrada" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Error actualizando alerta" });
  }
};
