// backend/routes/journal.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createEntry,
  getEntries,
  deleteEntry,
  updateEntry
} from "../controllers/journalController.js";

const router = express.Router();

router.post("/", authMiddleware, createEntry);
router.get("/", authMiddleware, getEntries);
router.put("/:id", authMiddleware, updateEntry);
router.delete("/:id", authMiddleware, deleteEntry);

export default router;
