const express = require("express");
const router = express.Router();
const { handleAnonChat, handleAuthChat } = require("../controllers/chatbotController");

// 🧠 Chat para usuario anónimo
router.post("/anonimo", handleAnonChat);

// 🧠 Chat para usuario autenticado
router.post("/autenticado", handleAuthChat);

module.exports = router;
