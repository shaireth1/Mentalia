// backend/controllers/alertController.js
import Alert from "../models/Alert.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

// 🆕 Importación para RF24 (acumulación de alertas)
import DailyAlertSummary from "../models/DailyAlertSummary.js";
import dayjs from "dayjs";

/* ============================
   📌 CREAR ALERTA (LLAMADO POR CHATBOT)
   ============================ */
export const createAlert = async (data) => {
  try {
    // 🆕 Enriquecer datos con valores críticos del módulo psicóloga
    const alertData = {
      ...data,
      isCritical: data.severity === "alto",
      riskLevel: data.riskLevel || (data.severity === "alto" ? 5 : 2),
    };

    const alert = await Alert.create(alertData);

    // RF19 — notificación inmediata si es crítica
    if (alert.isCritical) {
      await notifyCriticalAlert(alert);
      await handleDailyCriticalSummary(alert); // 🆕 RF24
    }

  } catch (err) {
    console.error("❌ Error creando alerta:", err);
  }
};


/* ============================
   📌 NOTIFICAR ALERTA CRÍTICA (RF19)
   ============================ */
export const notifyCriticalAlert = async (alert) => {
  try {
    const admin = await User.findOne({ rol: "admin" });
    if (!admin) {
      console.log("⚠ No hay psicóloga registrada.");
      return;
    }

    await sendEmail({
      to: admin.email,
      subject: "⚠ ALERTA CRÍTICA DETECTADA — MENTALIA",
      html: `
        <h2 style="color:#b30000;">⚠ ALERTA CRÍTICA DETECTADA</h2>

        <p><strong>Frase detectada:</strong> ${alert.phrase}</p>
        <p><strong>Mensaje completo:</strong> ${alert.message}</p>
        <p><strong>Categoría:</strong> ${alert.category}</p>
        <p><strong>Severidad:</strong> ${alert.severity}</p>
        <p><strong>Sesión:</strong> ${alert.sessionId}</p>

        ${
          alert.matchedPhrases?.length
            ? `<p><strong>Coincidencias:</strong> ${alert.matchedPhrases.join(", ")}</p>`
            : ""
        }

        <p style="margin-top:20px;">
          Por favor revisa el panel de alertas en la plataforma.
        </p>
      `,
    });

    // Guardar fecha de notificación
    alert.notifiedAt = new Date();
    await alert.save();

    console.log("📨 Notificación de alerta crítica enviada a psicóloga.");
  } catch (err) {
    console.log("❌ Error enviando correo de alerta crítica:", err);
  }
};


/* ============================
   📌 CONSULTAR TODAS LAS ALERTAS
   ============================ */
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo alertas" });
  }
};


/* ============================
   📌 FILTRAR ALERTAS
   ============================ */
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


/* ============================
   📌 ACTUALIZAR ALERTA (Marcar como atendida)
   ============================ */
export const updateAlertStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Alert.findByIdAndUpdate(
      id,
      { status, resolved: status === "atendida" },
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


/* ============================
   📌 RF24 – MANEJO DE ACUMULACIÓN DIARIA
   ============================ */
const handleDailyCriticalSummary = async (alert) => {
  try {
    const today = dayjs().format("YYYY-MM-DD");

    let summary = await DailyAlertSummary.findOne({ date: today });
    if (!summary) {
      summary = await DailyAlertSummary.create({
        date: today,
        criticalCount: 0,
        notifiedToPsychologist: false,
      });
    }

    summary.criticalCount++;

    // Si supera 3 alertas críticas → Notificación RF24
    if (summary.criticalCount >= 3 && !summary.notifiedToPsychologist) {
      const admin = await User.findOne({ rol: "admin" });
      if (admin) {
        await sendEmail({
          to: admin.email,
          subject: "🚨 ACUMULACIÓN DE ALERTAS CRÍTICAS — MENTALIA",
          html: `
            <h2 style="color:#b30000;">🚨 ALERTAS CRÍTICAS ACUMULADAS</h2>
            <p>Hoy se han generado <strong>${summary.criticalCount}</strong> alertas críticas.</p>

            <p style="margin-top:20px;">
              Se recomienda revisión inmediata del panel de riesgo.
            </p>
          `,
        });

        summary.notifiedToPsychologist = true;
      }
    }

    await summary.save();
  } catch (err) {
    console.log("❌ Error en RF24 (acumulación de alertas):", err);
  }
};


/* ============================
   📌 MÉTODO ORIGINAL RF24 (para cron jobs)
   ============================ */
export const checkDailyCriticalAlerts = async () => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const count = await Alert.countDocuments({
      severity: "alto",
      createdAt: { $gte: start },
    });

    if (count >= 3) {
      const admin = await User.findOne({ rol: "admin" });
      if (!admin) return;

      await sendEmail({
        to: admin.email,
        subject: "🚨 ACUMULACIÓN DE ALERTAS CRÍTICAS — MENTALIA",
        html: `
          <h2 style="color:#b30000;">🚨 ALERTAS CRÍTICAS ACUMULADAS</h2>
          <p>Hoy se han generado <strong>${count}</strong> alertas críticas.</p>

          <p style="margin-top:20px;">
            Se recomienda revisión inmediata del panel de riesgo.
          </p>
        `,
      });

      console.log("📨 Notificación de acumulación enviada.");
    }

  } catch (err) {
    console.log("❌ Error verificando alertas acumuladas:", err);
  }
};
