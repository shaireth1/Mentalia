// routes/chatbot.js
const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

router.post("/message", chatbotController.procesarMensaje);

module.exports = router;
