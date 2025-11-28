import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { logAdminAction } from "../middleware/logAdminAction.js";

import { 
  getCriticalAlerts,
  resolveAlert,
  getConversationByAlert,
  searchConversations,
  getPendingCriticalCount
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

// 🔐 RNF9 — registrar acciones de psicóloga
router.use(authMiddleware, logAdminAction);

// RF16
router.get("/alerts", getCriticalAlerts);
router.put("/alerts/:id/resolve", resolveAlert);
router.get("/alerts/:alertId/conversation", getConversationByAlert);

// ⭐⭐⭐ NUEVO
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
