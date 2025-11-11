// backend/controllers/chatbotController.js
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";
import { getResponse } from "../utils/responseHelper.js";
import { updateEmotionalMemory } from "../utils/emotionalMemory.js";
import Conversation from "../models/Conversation.js";
import ChatSession from "../models/ChatSession.js";

export async function handleAnonChat(req, res) {
  try {
    const { message, tone = "informal" } = req.body;

    if (!message || message.trim() === "")
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });

    // 🧠 Analizar emoción del mensaje
    const { emotion, confidence } = analyzeEmotion(message);

    // ⚠️ Detectar frases de crisis o riesgo
    const isCrisis =
      /suicid|matarme|morir|quitarme la vida|no quiero vivir|acabar con todo|ya no quiero existir/i.test(
        message
      );

    // 💬 Obtener respuesta empática
    const reply = getResponse(emotion, /hola|buenas/i.test(message), isCrisis, tone);

    // 🧾 Crear sesión temporal anónima
    const sessionId = "anon-" + Math.random().toString(36).substring(2, 10);
    const chat = new ChatSession({
      sessionId,
      anonymous: true,
      tone,
      messages: [
        { sender: "user", text: message, emotion, confidence },
        { sender: "bot", text: reply, emotion },
      ],
    });
    await chat.save();

    // 🔄 Actualizar memoria emocional del sistema
    await updateEmotionalMemory();

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en handleAnonChat:", error);
    res.status(500).json({ reply: "Ocurrió un error procesando tu mensaje. 😔" });
  }
}

export async function handleAuthChat(req, res) {
  try {
    const { message, userId, tone = "formal" } = req.body;

    if (!message)
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });

    // 🧠 Analizar emoción
    const { emotion, confidence } = analyzeEmotion(message);

    // ⚠️ Detectar crisis
   // Detección extendida de frases de crisis (RF9)
// Detección ampliada de frases de crisis (RF9 completo)
const isCrisis = /suicid|matarme|morir|quitarme\s+la\s+vida|no\s+quiero\s+vivir|no\s+aguanto\s+m[aá]s|quiero\s+acabar\s+con\s+todo|no\s+veo(\s+ninguna)?\s+salida|no\s+vale\s+la\s+pena\s+vivir|hacerme\s+daño/i.test(message);



    // 💬 Obtener respuesta empática
    const reply = getResponse(emotion, /hola|buenas/i.test(message), isCrisis, tone);

    // 🧾 Guardar conversación en base de datos
    const conversation = new Conversation({
      userId,
      type: "registrado",
      messages: [
        { sender: "user", text: message, emotion, confidence },
        { sender: "bot", text: reply, emotion },
      ],
    });
    await conversation.save();

    // 🔄 Actualizar memoria emocional
    await updateEmotionalMemory();

    res.json({ reply });
  } catch (error) {
    console.error("❌ Error en handleAuthChat:", error);
    res.status(500).json({ reply: "No se pudo procesar tu mensaje. 😔" });
  }
}
