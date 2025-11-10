// backend/controllers/chatbotController.js
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";
import { getResponse } from "../utils/responseHelper.js";
import Conversation from "../models/Conversation.js";
import ChatSession from "../models/ChatSession.js";

export async function handleAnonChat(req, res) {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "")
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });

    // 🔹 Analizar emoción
    const { emotion, confidence } = analyzeEmotion(message);

    // 🔹 Detectar crisis
    const isCrisis =
      /suicid|matarme|morir|quitarme la vida|no quiero vivir/i.test(message);

    // 🔹 Obtener respuesta
    const reply = getResponse(emotion, /hola|buenas/i.test(message), isCrisis);

    // 🔹 Guardar sesión temporal (solo en Mongo)
    const sessionId = "anon-" + Math.random().toString(36).substring(2, 10);
    const chat = new ChatSession({
      sessionId,
      anonymous: true,
      messages: [
        { sender: "user", text: message, emotion, confidence },
        { sender: "bot", text: reply, emotion },
      ],
    });
    await chat.save();

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en handleAnonChat:", error);
    res
      .status(500)
      .json({ reply: "Ocurrió un error procesando tu mensaje. 😔" });
  }
}

export async function handleAuthChat(req, res) {
  try {
    const { message, userId } = req.body;
    if (!message)
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });

    const { emotion, confidence } = analyzeEmotion(message);
    const isCrisis =
      /suicid|matarme|morir|quitarme la vida|no quiero vivir/i.test(message);
    const reply = getResponse(emotion, /hola|buenas/i.test(message), isCrisis);

    // 🔹 Guardar conversación del usuario autenticado
    const conversation = new Conversation({
      userId,
      type: "registrado",
      messages: [
        { sender: "user", text: message, emotion, confidence },
        { sender: "bot", text: reply, emotion },
      ],
    });
    await conversation.save();

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en handleAuthChat:", error);
    res.status(500).json({ reply: "No se pudo procesar tu mensaje. 😔" });
  }
}
