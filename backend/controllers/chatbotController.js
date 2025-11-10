// backend/controllers/chatbotController.js
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";
import { getResponse } from "../utils/responseHelper.js";
import { updateEmotionalMemory, loadMemory } from "../utils/emotionalMemory.js";
import Conversation from "../models/Conversation.js";
import ChatSession from "../models/ChatSession.js";

export async function handleAnonChat(req, res) {
  try {
    const { message } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });
    }

    // 🔹 Analizar emoción del mensaje
    const { emotion, confidence } = analyzeEmotion(message);

    // 🔹 Detectar crisis
    const isCrisis = /suicid|matarme|morir|quitarme la vida|no quiero vivir/i.test(message);

    // 🔹 Obtener respuesta base
    let reply = getResponse(emotion, /hola|buenas/i.test(message), isCrisis);

    // 🔹 Ajustar respuesta según memoria emocional (si existe)
    const memory = loadMemory();
    if (memory[emotion]?.score > 0.3) {
      reply += " 🌱 Gracias por seguir confiando en mí. Estoy aprendiendo de ti.";
    }

    // 🔹 Guardar sesión temporal en MongoDB
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

    // 🧠 Actualizar memoria emocional después de cada mensaje
    await updateEmotionalMemory();

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en handleAnonChat:", error);
    res.status(500).json({ reply: "Ocurrió un error procesando tu mensaje. 😔" });
  }
}

export async function handleAuthChat(req, res) {
  try {
    const { message, userId } = req.body;
    if (!message?.trim()) {
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });
    }

    // 🔹 Analizar emoción
    const { emotion, confidence } = analyzeEmotion(message);
    const isCrisis = /suicid|matarme|morir|quitarme la vida|no quiero vivir/i.test(message);

    // 🔹 Generar respuesta
    let reply = getResponse(emotion, /hola|buenas/i.test(message), isCrisis);

    const memory = loadMemory();
    if (memory[emotion]?.score > 0.4) {
      reply += " 💜 He notado que te sientes un poco mejor últimamente. Me alegra eso.";
    }

    // 🔹 Guardar conversación
    const conversation = new Conversation({
      userId,
      type: "registrado",
      messages: [
        { sender: "user", text: message, emotion, confidence },
        { sender: "bot", text: reply, emotion },
      ],
    });
    await conversation.save();

    await updateEmotionalMemory();

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en handleAuthChat:", error);
    res.status(500).json({ reply: "No se pudo procesar tu mensaje. 😔" });
  }
}
