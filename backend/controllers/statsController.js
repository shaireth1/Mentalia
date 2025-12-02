// backend/controllers/statsController.js
import Conversation from "../models/Conversation.js";
import Alert from "../models/Alert.js";
import JournalEntry from "../models/JournalEntry.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import AdminLog from "../models/AdminLog.js";

/* ----------------- Helpers comunes ----------------- */

const MONTH_LABELS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function aggregateStats({
  usersCount,
  chatbotUsage,
  emotions,
  alerts,
  avgSessionTime,
  registeredUsers,
  anonymousUsers
}) {
  return {
    usersCount,
    chatbotUsage,
    emotions,
    alerts,
    avgSessionTime,
    registeredUsers,
    anonymousUsers
  };
}

async function safeAdminLog(payload) {
  try {
    await AdminLog.create(payload);
  } catch (err) {
    console.error("❌ Error registrando AdminLog (stats):", err);
  }
}

/* ----------------- Cálculo general de stats (totales) ----------------- */

async function calculateStats() {
  const chatbotUsage = await Conversation.countDocuments();
  const alerts = await Alert.countDocuments({ isCritical: true });
  const usersCount = await JournalEntry.distinct("userId").then((arr) => arr.length);

  const emotions = await JournalEntry.aggregate([
    { $match: { deleted: false } },
    { $group: { _id: "$emotion", total: { $sum: 1 } } }
  ]);

  // Tiempo promedio de sesión (en segundos) usando startedAt y endedAt reales
  const durationsAgg = await Conversation.aggregate([
    {
      $match: {
        startedAt: { $ne: null },
        endedAt: { $ne: null }
      }
    },
    {
      $project: {
        duration: {
          $divide: [{ $subtract: ["$endedAt", "$startedAt"] }, 1000] // ms → s
        }
      }
    },
    {
      $group: {
        _id: null,
        avgDuration: { $avg: "$duration" }
      }
    }
  ]);

  const avgSessionTime = durationsAgg[0]?.avgDuration || 0;

  // Registrados vs anónimos usando field type: "registrado" | "anonimo"
  const registeredUsers = await Conversation.countDocuments({ type: "registrado" });
  const anonymousUsers = await Conversation.countDocuments({ type: "anonimo" });

  return aggregateStats({
    usersCount,
    chatbotUsage,
    emotions,
    alerts,
    avgSessionTime,
    registeredUsers,
    anonymousUsers
  });
}

/* ----------------- RF18: /stats (totales + PDF + Excel) ----------------- */

export async function getStats(req, res) {
  try {
    const stats = await calculateStats();

    await safeAdminLog({
      adminId: req.user?.id,
      action: "CONSULTAR ESTADÍSTICAS",
      endpoint: "/stats",
      ip: req.ip
    });

    res.json(stats);
  } catch (err) {
    console.error("❌ Error obteniendo estadísticas:", err);
    res.status(500).json({ msg: "Error obteniendo estadísticas" });
  }
}

export async function exportPDF(req, res) {
  try {
    const stats = await calculateStats();

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=estadisticas.pdf");

    doc.pipe(res);

    doc.fontSize(18).text("Reporte de Estadísticas - MENTALIA", { underline: true });
    doc.moveDown();

    doc.fontSize(12).text(`Usuarios atendidos: ${stats.usersCount}`);
    doc.text(`Conversaciones totales: ${stats.chatbotUsage}`);
    doc.text(`Alertas críticas: ${stats.alerts}`);
    doc.text(`Tiempo promedio de sesión: ${stats.avgSessionTime.toFixed(2)} segundos`);
    doc.text(`Usuarios registrados: ${stats.registeredUsers}`);
    doc.text(`Usuarios anónimos: ${stats.anonymousUsers}`);

    doc.moveDown();
    doc.text("Emociones detectadas:");
    stats.emotions.forEach((e) => {
      doc.text(`• ${e._id}: ${e.total}`);
    });

    doc.end();

    await safeAdminLog({
      adminId: req.user?.id,
      action: "EXPORTAR PDF",
      endpoint: "/stats/pdf",
      ip: req.ip
    });
  } catch (err) {
    console.error("❌ Error exportando PDF:", err);
    res.status(500).json({ msg: "Error exportando PDF" });
  }
}

export async function exportExcel(req, res) {
  try {
    const stats = await calculateStats();

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Estadísticas");

    sheet.columns = [
      { header: "Métrica", key: "metric", width: 35 },
      { header: "Valor", key: "value", width: 20 }
    ];

    sheet.addRow({ metric: "Usuarios atendidos", value: stats.usersCount });
    sheet.addRow({ metric: "Conversaciones totales", value: stats.chatbotUsage });
    sheet.addRow({ metric: "Alertas críticas", value: stats.alerts });
    sheet.addRow({ metric: "Tiempo promedio de sesión (s)", value: stats.avgSessionTime.toFixed(2) });
    sheet.addRow({ metric: "Usuarios registrados", value: stats.registeredUsers });
    sheet.addRow({ metric: "Usuarios anónimos", value: stats.anonymousUsers });

    sheet.addRow({});
    sheet.addRow({ metric: "Emociones detectadas", value: "" });

    stats.emotions.forEach((e) => {
      sheet.addRow({ metric: `• ${e._id}`, value: e.total });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=estadisticas.xlsx");

    await workbook.xlsx.write(res);
    res.end();

    await safeAdminLog({
      adminId: req.user?.id,
      action: "EXPORTAR EXCEL",
      endpoint: "/stats/excel",
      ip: req.ip
    });
  } catch (err) {
    console.error("❌ Error exportando Excel:", err);
    res.status(500).json({ msg: "Error exportando Excel" });
  }
}

/* ----------------- NUEVO: /stats/dashboard (tendencias) ----------------- */

export async function getDashboardStats(req, res) {
  try {
    // Últimos 5 meses (incluyendo el actual)
    const now = new Date();
    const months = [];
    const chatbotUsage = [];
    const alertsCritical = [];
    const alertsModerate = [];

    for (let i = 4; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);

      const label = MONTH_LABELS[d.getMonth()];
      months.push(label);

      // Conversaciones del mes
      const convCount = await Conversation.countDocuments({
        createdAt: { $gte: start, $lt: end }
      });
      chatbotUsage.push(convCount);

      // Alertas críticas y moderadas del mes
      const crit = await Alert.countDocuments({
        isCritical: true,
        createdAt: { $gte: start, $lt: end }
      });

      const mod = await Alert.countDocuments({
        isCritical: false,
        createdAt: { $gte: start, $lt: end }
      });

      alertsCritical.push(crit);
      alertsModerate.push(mod);
    }

    // Emociones totales (no por mes, pero sí reales)
    const emotionsAgg = await JournalEntry.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$emotion", total: { $sum: 1 } } },
      { $sort: { total: -1 } }
    ]);

    // Formato para frontend
    const colorsByEmotion = {
      ansiedad: "#8A5BFF",
      estrés: "#FF4D4D",
      estres: "#FF4D4D",
      tristeza: "#4D8DFF",
      preocupacion: "#FFCC66",
      preocupación: "#FFCC66",
      enojo: "#66CC66"
    };

    const emotions = emotionsAgg.map((e, idx) => ({
      emotion: e._id || "Sin etiqueta",
      count: e.total,
      color: colorsByEmotion[e._id?.toLowerCase()] || [
        "#8A5BFF",
        "#FF4D4D",
        "#4D8DFF",
        "#FFCC66",
        "#66CC66",
        "#FF88AA",
        "#00C2FF"
      ][idx % 7]
    }));

    await safeAdminLog({
      adminId: req.user?.id,
      action: "CONSULTAR STATS DASHBOARD",
      endpoint: "/stats/dashboard",
      ip: req.ip
    });

    res.json({
      months,
      chatbotUsage,
      alerts: {
        critical: alertsCritical,
        moderate: alertsModerate
      },
      emotions
    });
  } catch (err) {
    console.error("❌ Error obteniendo stats dashboard:", err);
    res.status(500).json({ msg: "Error obteniendo estadísticas del dashboard" });
  }
}
