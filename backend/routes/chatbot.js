// backend/routes/chatbot.js
import express from "express";
import { handleAnonChat, handleAuthChat } from "../controllers/chatbotController.js";

const router = express.Router();

// 🟣 Chat para sesión anónima
router.post("/anonimo", handleAnonChat);

// 🔵 Chat para usuario autenticado
router.post("/autenticado", handleAuthChat);

export default router;
