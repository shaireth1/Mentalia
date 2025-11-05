// routes/chatbot.js
const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation"); // 👈 Importamos el modelo

// 🎯 Diccionario de palabras clave asociadas a emociones
const emotionKeywords = {
  tristeza: ["triste", "llorar", "solo", "sola", "vacío", "extraño", "perdí", "murió", "muerte", "pena", "nostalgia"],
  ansiedad: ["ansioso", "ansiosa", "nervioso", "nerviosa", "preocupado", "preocupada", "estresado", "estresada", "presión", "inquieto"],
  miedo: ["miedo", "temor", "asustado", "asustada", "pánico", "terror", "preocupación", "inseguro"],
  enojo: ["enojado", "enojada", "rabia", "furioso", "molesto", "ira", "odio"],
  estrés: ["agotado", "estresado", "cansado", "presión", "saturado", "bloqueado"],
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

// 💬 Respuestas empáticas (PAP)
const responsesByEmotion = {
  tristeza: [
    "💜 Lamento mucho lo que estás pasando. Lo que sientes es completamente válido.",
    "💜 Puedo sentir tu tristeza. Gracias por confiar en mí para compartirla. No estás sol@.",
    "💜 A veces llorar o sentirse mal es una forma de sanar. Estoy aquí contigo.",
  ],
  ansiedad: [
    "💭 Respira conmigo un momento. Inhala profundo... exhala lento. Estoy aquí contigo.",
    "💜 Entiendo esa sensación de ansiedad. ¿Quieres que te enseñe una técnica breve para calmarte?",
    "💜 Estás haciendo lo mejor que puedes, incluso si no se siente así ahora.",
  ],
  miedo: [
    "💜 Entiendo que tengas miedo. A veces el miedo solo quiere protegernos. Cuéntame más si quieres.",
    "💜 No estás sol@. Hablar del miedo hace que pierda fuerza.",
    "💜 Está bien sentir miedo, no significa debilidad. Estoy contigo.",
  ],
  enojo: [
    "😤 Puedo notar tu enojo. Es válido sentirse así cuando algo duele o se siente injusto.",
    "💜 A veces el enojo es una forma de decir 'me importa'. Cuéntame qué pasó.",
    "💜 Puedes soltar un poco esa rabia aquí, estoy para escucharte sin juzgar.",
  ],
  estrés: [
    "💜 Parece que estás agotad@. Has estado haciendo mucho, mereces un respiro.",
    "💭 El estrés puede ser abrumador, pero no estás sol@. Podemos hablar de lo que te presiona.",
    "💜 Quizás necesites pausar un momento. Estoy aquí contigo.",
  ],
  neutral: [
    "💜 Gracias por hablar conmigo. Cuéntame cómo te sientes hoy.",
    "💜 Te escucho con atención, sin juicios. ¿Cómo va tu día?",
  ],
  crisis: [
    "⚠️ Lamento mucho que te sientas así. No estás sol@ 💛. Por favor contacta la línea 106 (Colombia) o acude a urgencias. ¿Quieres que te comparta contactos ahora?",
    "⚠️ Entiendo que todo puede sentirse muy pesado. No enfrentes esto sol@. Línea 106 o el 141 (si eres menor).",
  ],
};

// 🧠 Detección de emoción
function detectEmotion(message) {
  const lower = message.toLowerCase();
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(word => lower.includes(word))) return emotion;
  }
  return "neutral";
}

// 🗣️ Endpoint principal del chatbot
router.post("/message", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ response: "Por favor, escribe algo." });
    }

    const lowerMsg = message.toLowerCase();

    // 🔎 Detección de crisis
    const isCrisis = crisisPhrases.some(p => lowerMsg.includes(p));
    if (isCrisis) {
      const response = responsesByEmotion.crisis[Math.floor(Math.random() * responsesByEmotion.crisis.length)];
      return res.json({ response, emotion: "crisis", isCrisis: true });
    }

    // 💬 Detección de emoción
    const emotion = detectEmotion(lowerMsg);

    // 🩷 Seleccionar respuesta empática
    const responses = responsesByEmotion[emotion] || responsesByEmotion.neutral;
    const response = responses[Math.floor(Math.random() * responses.length)];

    // 🧾 Guardar conversación en MongoDB (por sesión)
    const sessionId = req.session.id;
    let convo = await Conversation.findOne({ sessionId });

    if (!convo) {
      convo = new Conversation({ sessionId, messages: [] });
    }

    convo.messages.push({ sender: "user", text: message, emotion });
    convo.messages.push({ sender: "bot", text: response, emotion });
    await convo.save();

    res.json({ response, emotion, isCrisis: false });
  } catch (error) {
    console.error("❌ Error en chatbot:", error);
    res.status(500).json({ response: "Error interno del chatbot." });
  }
});

module.exports = router;
