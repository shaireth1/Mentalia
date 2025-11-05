// models/Conversation.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "bot"], required: true },
  text: { type: String, required: true },
  emotion: { type: String, default: "neutral" },
  createdAt: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
  sessionId: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  type: { type: String, enum: ["anonimo", "registrado"], required: true },
  messages: [messageSchema],
  startedAt: { type: Date, default: Date.now },
  endedAt: { type: Date }
});

// 🔹 Si es anónimo, se eliminará automáticamente 10 minutos después de su última actualización
conversationSchema.index(
  { updatedAt: 1 },
  { expireAfterSeconds: 600 } // 600 segundos = 10 minutos
);

conversationSchema.set("timestamps", true);

module.exports = mongoose.model("Conversation", conversationSchema);
