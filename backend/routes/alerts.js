// backend/routes/alerts.js
import express from "express";
import {
  getAlerts,
  getFilteredAlerts,
  updateAlertStatus
} from "../controllers/alertController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();

// Todas estas rutas son solo para administradores (Psicóloga)
router.use(authMiddleware, adminMiddleware);

router.get("/", getAlerts);
router.get("/filter", getFilteredAlerts);
router.put("/:id", updateAlertStatus);

export default router;
