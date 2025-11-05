// routes/chatbot.js
const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");

// 🎯 Diccionario de palabras clave asociadas a emociones
const emotionKeywords = {
  tristeza: ["triste", "llorar", "solo", "sola", "vacío", "extraño", "perdí", "murió", "muerte", "pena", "nostalgia"],
  ansiedad: ["ansioso", "ansiosa", "nervioso", "nerviosa", "preocupado", "preocupada", "estresado", "estresada", "presión", "inquieto"],
  miedo: ["miedo", "temor", "asustado", "asustada", "pánico", "terror", "inseguro", "inseguridad"],
  enojo: ["enojado", "enojada", "rabia", "furioso", "molesto", "ira", "odio", "fastidio"],
  estrés: ["agotado", "estresado", "estresada", "cansado", "cansada", "saturado", "bloqueado"],
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
  "acabaré con mi vida"
];

// 💬 Respuestas empáticas tipo PAP (Primeros Auxilios Psicológicos)
const responsesByEmotion = {
  tristeza: [
    "💜 Lamento mucho lo que estás pasando. No estás sol@, estoy aquí para acompañarte.",
    "😢 Tu tristeza es válida. No necesitas ocultarla. Estoy aquí contigo, sin juicios.",
    "🌧️ Hay días en que todo pesa más, pero hablar puede aliviar un poco esa carga. Te escucho."
  ],
  ansiedad: [
    "💭 Entiendo esa sensación de ansiedad. Respira conmigo, poco a poco.",
    "😌 No estás sol@. Podemos ir paso a paso. Cuéntame qué te preocupa más.",
    "💜 Gracias por confiar en mí para contarlo. Podemos hablarlo sin prisa."
  ],
  miedo: [
    "💭 Entiendo que tengas miedo. Es normal sentirlo cuando algo nos duele o preocupa.",
    "💜 No estás sol@. Hablar de lo que temes puede ayudarte a sentirte más tranquil@.",
    "😢 Está bien tener miedo. Estoy aquí para acompañarte en lo que necesites."
  ],
  enojo: [
    "😤 Es válido sentirse molesto cuando las cosas no salen como esperas.",
    "💜 A veces el enojo protege algo importante para ti. Podemos hablarlo si quieres.",
    "💭 Está bien expresar lo que sientes. Estoy aquí para escucharte sin juicios."
  ],
  estrés: [
    "😔 Parece que estás pasando por mucho estrés. Respira un momento, te escucho.",
    "💜 Estás haciendo lo mejor que puedes, incluso si no lo parece. Estoy contigo.",
    "🌱 Tal vez necesitas una pausa. Podemos hablar de cómo aliviar esa carga."
  ],
  neutral: [
    "💜 Gracias por contarme cómo te sientes. Estoy aquí para escucharte, sin juicios.",
    "💭 A veces no sabemos muy bien cómo nos sentimos, y eso también está bien. Cuéntame un poco más.",
    "💬 Lo que estás viviendo es importante. Te estoy escuchando."
  ],
  crisis: [
    "⚠️ Si sientes que no puedes más, por favor contacta con alguien ahora mismo. No tienes que enfrentar esto sol@.",
    "⚠️ Lamento mucho que te sientas así. Puedes comunicarte con la Línea 106 (Colombia) o acudir al servicio de urgencias más cercano.",
    "⚠️ Tu vida es importante. No estás sol@, hay ayuda disponible ahora mismo: Línea 106 o 141 si eres menor de edad."
  ]
};

// 📊 Detectar emoción
function detectEmotion(message) {
  const lower = message.toLowerCase();
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(word => lower.includes(word))) return emotion;
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

    // 🚨 Detectar crisis
    const isCrisis = crisisPhrases.some(p => lowerMsg.includes(p));
    if (isCrisis) {
      const response = responsesByEmotion.crisis[Math.floor(Math.random() * responsesByEmotion.crisis.length)];
      await saveConversation(req, message, response, "crisis");
      return res.json({ response, emotion: "crisis" });
    }

    // 🔹 Detectar emoción
    const emotion = detectEmotion(lowerMsg);
    const responses = responsesByEmotion[emotion] || responsesByEmotion.neutral;
    const response = responses[Math.floor(Math.random() * responses.length)];

    // 💾 Guardar conversación
    await saveConversation(req, message, response, emotion);

    res.json({ response, emotion });
  } catch (error) {
    console.error("❌ Error en chatbot:", error);
    res.status(500).json({ response: "Error interno del chatbot." });
  }
});

// 🧾 Función para guardar conversación
async function saveConversation(req, message, response, emotion) {
  const sessionId = req.session.id;
  const userId = req.session.userId || null;
  const type = userId ? "registrado" : "anonimo";

  let convo = await Conversation.findOne(userId ? { userId } : { sessionId });

  if (!convo) {
    convo = new Conversation({ sessionId, userId, type, messages: [] });
  }

  convo.messages.push({ sender: "user", text: message, emotion });
  convo.messages.push({ sender: "bot", text: response, emotion });

  await convo.save();
}

// 🚪 Endpoint para finalizar sesión anónima
router.post("/end-session", async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ error: "Falta sessionId" });

    await Conversation.updateOne(
      { sessionId },
      { $set: { endedAt: new Date() } }
    );

    console.log(`🧹 Sesión anónima finalizada: ${sessionId}`);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error al cerrar sesión:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
