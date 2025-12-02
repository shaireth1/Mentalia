import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { logAdminAction } from "../middleware/logAdminAction.js";

// ALERTAS
import { 
  getCriticalAlerts,
  resolveAlert,
  getConversationByAlert,
  searchConversations,
  getPendingCriticalCount
} from "../controllers/psychologistController.js";

// FRASES DE RIESGO
import {
  getPhrases,
  createPhrase,
  updatePhrase,
  deletePhrase
} from "../controllers/riskPhraseAdminController.js";

// ESTADÍSTICAS
import {
  getStats,
  exportPDF,
  exportExcel
} from "../controllers/statsController.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware, logAdminAction);

// ------- ALERTAS (RF16) -------
router.get("/alerts", getCriticalAlerts);
router.put("/alerts/:id/resolve", resolveAlert);
router.get("/alerts/:alertId/conversation", getConversationByAlert);
router.get("/alerts/pending/count", getPendingCriticalCount);

// ------- BUSCAR (RF21) -------
router.get("/conversations/search", searchConversations);

// ------- FRASES DE RIESGO (RF23) -------
router.get("/phrases", getPhrases);
router.post("/phrases", createPhrase);
router.put("/phrases/:id", updatePhrase);
router.delete("/phrases/:id", deletePhrase);

// ------- ESTADÍSTICAS (RF22 – RF18) -------
router.get("/stats", getStats);
router.get("/stats/pdf", exportPDF);
router.get("/stats/excel", exportExcel);

export default router;
