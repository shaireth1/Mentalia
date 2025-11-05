// models/Conversation.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "bot"], required: true },
  text: { type: String, required: true },
  emotion: { type: String, default: "neutral" },
  createdAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  messages: [messageSchema],
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

module.exports = mongoose.model("Conversation", conversationSchema);
