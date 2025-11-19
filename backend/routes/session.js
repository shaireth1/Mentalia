// backend/routes/session.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getSessions,
  logoutCurrent,
  logoutAll,
} from "../controllers/sessionController.js";

const router = express.Router();

router.get("/", authMiddleware, getSessions);
router.post("/logout-current", authMiddleware, logoutCurrent);
router.post("/logout-all", authMiddleware, logoutAll);

export default router;
