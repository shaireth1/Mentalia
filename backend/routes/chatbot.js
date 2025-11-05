// backend/routes/chatbot.js
const express = require("express");
const router = express.Router();
const chatbotController = require("../controllers/chatbotController");

// POST /api/chatbot/message
router.post("/message", chatbotController.message);

module.exports = router;
