import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";

import { 
  getCriticalAlerts,
  resolveAlert,
  getConversationByAlert,
  searchConversations,
  getPendingCriticalCount // ⭐ agregado
} from "../controllers/psychologistController.js";

import {
  getPhrases,
  createPhrase,
  updatePhrase,
  deletePhrase
} from "../controllers/riskPhraseAdminController.js";

import {
  getStats,
  exportPDF,
  exportExcel
} from "../controllers/statsController.js";

const router = express.Router();

// 🔐 Middleware global
router.use(authMiddleware);

// RF16
router.get("/alerts", getCriticalAlerts);
router.put("/alerts/:id/resolve", resolveAlert);
router.get("/alerts/:alertId/conversation", getConversationByAlert);

// ⭐⭐⭐ NUEVO: cantidad de alertas pendientes
router.get("/alerts/pending/count", getPendingCriticalCount);

// RF21
router.get("/conversations/search", searchConversations);

// RF23
router.get("/phrases", getPhrases);
router.post("/phrases", createPhrase);
router.put("/phrases/:id", updatePhrase);
router.delete("/phrases/:id", deletePhrase);

// RF18 + RF22
router.get("/stats", getStats);
router.get("/stats/pdf", exportPDF);
router.get("/stats/excel", exportExcel);

export default router;
