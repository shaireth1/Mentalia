// routes/chatbot.js
const express = require("express");
const router = express.Router();
const { getResponse } = require("../utils/responseHelper");
const Conversation = require("../models/Conversation");

// 🎯 Diccionario básico de palabras clave para detectar emociones
const emotionKeywords = {
  tristeza: ["triste", "llorar", "solo", "sola", "vacío", "extraño", "perdí", "murió", "muerte", "pena", "nostalgia"],
  ansiedad: ["ansioso", "ansiosa", "nervioso", "nerviosa", "preocupado", "preocupada", "inquieto", "inquieta"],
  miedo: ["miedo", "temor", "asustado", "asustada", "pánico", "terror", "inseguro", "inseguridad"],
  enojo: ["enojado", "enojada", "rabia", "furioso", "molesto", "ira", "odio", "fastidio"],
  estrés: ["estresado", "estresada", "cansado", "cansada", "agotado", "presión", "saturado", "bloqueado"],
};

// ⚠️ Frases de riesgo (RF9)
const crisisPhrases = [
  "me quiero morir",
  "no aguanto más",
  "quiero acabar con todo",
  "no veo ninguna salida",
  "ya no quiero existir",
  "no vale la pena seguir viviendo",
  "estoy pensando en hacerme daño",
  "suicidarme",
];

// 🧠 Detectar emoción en el texto
function detectEmotion(message) {
  const lower = message.toLowerCase();
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some((word) => lower.includes(word))) return emotion;
  }
  return "neutral";
}

// 📍 Endpoint principal del chatbot
router.post("/message", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "")
      return res.status(400).json({ response: "Por favor, escribe algo." });

    const lowerMsg = message.toLowerCase();

    // 🔹 Detectar si el usuario está saludando
    const isGreeting = ["hola", "buenas", "hey", "holi"].some((word) =>
      lowerMsg.includes(word)
    );

    // 🔹 Detectar si hay frases de crisis
    const isCrisis = crisisPhrases.some((p) => lowerMsg.includes(p));

    // 🔹 Detectar emoción
    const emotion = detectEmotion(lowerMsg);

    // 🔹 Generar respuesta empática desde el JSON
    const response = getResponse(emotion, isGreeting, isCrisis);

    // 💾 Guardar la conversación (sesión temporal)
    const sessionId = req.session.id;
    let convo = await Conversation.findOne({ sessionId });

    if (!convo) {
      convo = new Conversation({ sessionId, messages: [] });
    }

    convo.messages.push({ sender: "user", text: message, emotion });
    convo.messages.push({ sender: "bot", text: response, emotion });
    await convo.save();

    // 📤 Enviar respuesta al frontend
    res.json({ response, emotion, isCrisis });

  } catch (error) {
    console.error("❌ Error en chatbot:", error);
    res.status(500).json({ response: "Error interno del chatbot." });
  }
});

module.exports = router;
