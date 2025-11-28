import Conversation from "../models/Conversation.js";
import Alert from "../models/Alert.js";
import JournalEntry from "../models/JournalEntry.js";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";

function aggregateStats(usersCount, chatbotUsage, emotions, alerts) {
  return { usersCount, chatbotUsage, emotions, alerts };
}

export async function getStats(req, res) {
  try {
    const chatbotUsage = await Conversation.countDocuments();
    const alerts = await Alert.countDocuments({ isCritical: true });
    const usersCount = await JournalEntry.distinct("userId").then(arr => arr.length);

    const emotions = await JournalEntry.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$emotion", total: { $sum: 1 } } }
    ]);

    res.json(aggregateStats(usersCount, chatbotUsage, emotions, alerts));
  } catch (err) {
    res.status(500).json({ msg: "Error obteniendo estadísticas" });
  }
}

export async function exportPDF(req, res) {
  try {
    const chatbotUsage = await Conversation.countDocuments();
    const alerts = await Alert.countDocuments({ isCritical: true });
    const usersCount = await JournalEntry.distinct("userId").then(arr => arr.length);

    const emotions = await JournalEntry.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$emotion", total: { $sum: 1 } } }
    ]);

    const stats = aggregateStats(usersCount, chatbotUsage, emotions, alerts);

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=estadisticas.pdf");

    doc.pipe(res);

    doc.text("Estadísticas MENTALIA");
    doc.text(`Usuarios atendidos: ${stats.usersCount}`);
    doc.text(`Conversaciones totales: ${stats.chatbotUsage}`);
    doc.text(`Alertas críticas: ${stats.alerts}`);

    doc.text("Emociones:");
    stats.emotions.forEach(e => {
      doc.text(`- ${e._id}: ${e.total}`);
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ msg: "Error exportando PDF" });
  }
}

export async function exportExcel(req, res) {
  try {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Estadísticas");

    sheet.addRow(["Métrica", "Valor"]);

    const chatbotUsage = await Conversation.countDocuments();
    const alerts = await Alert.countDocuments({ isCritical: true });
    const usersCount = await JournalEntry.distinct("userId").then(arr => arr.length);

    sheet.addRow(["Usuarios atendidos", usersCount]);
    sheet.addRow(["Conversaciones", chatbotUsage]);
    sheet.addRow(["Alertas críticas", alerts]);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=estadisticas.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ msg: "Error exportando Excel" });
  }
}
