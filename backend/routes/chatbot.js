// routes/chatbot.js
const express = require("express");
const router = express.Router();

// 🎯 Palabras clave asociadas a emociones
const emotionKeywords = {
  tristeza: ["triste", "llorar", "solo", "sola", "vacío", "extraño", "perdí", "murió", "muerte", "me duele", "pena", "nostalgia"],
  ansiedad: ["ansioso", "ansiosa", "nervioso", "nerviosa", "preocupado", "preocupada", "estresado", "estresada", "presión", "inquieto"],
  miedo: ["miedo", "temor", "asustado", "asustada", "pánico", "terror", "inseguro", "inseguridad"],
  enojo: ["enojado", "enojada", "rabia", "furioso", "molesto", "ira", "odio", "fastidio"],
  estrés: ["agotado", "estresado", "estresada", "cansado", "cansada", "presión", "saturado", "bloqueado"],
};

// 💬 Frases de riesgo (RF9)
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

// 💫 Respuestas empáticas tipo PAP
const responsesByEmotion = {
  saludo: [
    "💜 ¡Hola! Qué gusto verte por aquí. Este es tu espacio seguro, puedes contarme cómo te sientes hoy.",
    "🌷 Hola, gracias por escribirme. ¿Cómo te sientes en este momento?",
    "💫 ¡Hola! Me alegra que estés aquí. Cuéntame, ¿cómo ha ido tu día?",
  ],
  tristeza: [
    "💜 Lamento mucho lo que estás pasando. Perder o extrañar algo que amamos duele mucho. Estoy aquí contigo.",
    "💜 Puedo sentir tu tristeza. Gracias por confiar en mí para compartirla. No estás sol@, y puedes hablar conmigo todo lo que necesites.",
    "💜 Lo que sientes es completamente válido. Permítete sentir sin juzgarte. Estoy aquí para escucharte.",
  ],
  ansiedad: [
    "💜 Respira un momento conmigo. No estás sol@. A veces la mente va muy rápido, pero podemos ir paso a paso.",
    "💜 Puedo notar que estás ansios@. ¿Quieres que te enseñe una técnica breve de respiración o relajación?",
    "💜 Estás haciendo lo mejor que puedes, incluso cuando se siente demasiado. Estoy aquí contigo.",
  ],
  miedo: [
    "💜 Entiendo que tengas miedo. Es una emoción natural cuando algo nos preocupa o nos duele. Cuéntame qué es lo que te asusta más.",
    "💜 No estás sol@. A veces hablar del miedo ayuda a que pese menos. Estoy contigo.",
    "💜 Está bien sentir miedo, pero no estás sol@ en esto. Puedes contarme más si lo deseas.",
  ],
  enojo: [
    "💜 Puedo notar que estás molesto. Es válido sentirse así cuando las cosas no salen como esperas.",
    "💜 A veces el enojo es una forma de proteger lo que nos importa. ¿Quieres contarme qué te hizo sentir así?",
    "💜 Está bien expresar lo que sientes. Podemos hablarlo con calma si lo deseas.",
  ],
  estrés: [
    "💜 Parece que has estado lidiando con mucho. Date crédito por seguir intentándolo. Estoy aquí para escucharte.",
    "💜 El estrés puede ser muy agotador. Respira, estás haciendo lo mejor que puedes.",
    "💜 Quizás necesitas una pausa o soltar un poco de lo que cargas. Podemos hablar de eso.",
  ],
  neutral: [
    "💜 Gracias por contarme cómo te sientes. Estoy aquí para escucharte, sin juicios.",
    "💜 Te estoy escuchando. Cuéntame un poco más, lo que sientas que necesitas expresar.",
  ],
  crisis: [
    "⚠️ Lamento mucho que te sientas así. No estás sol@. Si estás en peligro o piensas en hacerte daño, por favor contacta la Línea 106 (Colombia) o acude a un servicio de urgencias.",
    "⚠️ Lamento que estés pasando por esto. Por favor, busca ayuda inmediata: Línea 106 o el 141 si eres menor de edad. ¿Quieres que te comparta más recursos?",
  ],
};

// ✨ Detectar saludos
function detectGreeting(message) {
  const greetings = ["hola", "buenas", "hey", "qué tal", "buenos días", "buenas tardes", "buenas noches"];
  return greetings.some(word => message.includes(word));
}

// 📊 Detectar emoción principal
function detectEmotion(message) {
  const lower = message.toLowerCase();
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(word => lower.includes(word))) return emotion;
  }
  return "neutral";
}

// 📍 Ruta principal del chatbot
router.post("/message", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "")
      return res.status(400).json({ response: "Por favor, escribe algo." });

    const lowerMsg = message.toLowerCase();

    // 🆘 Detección de crisis (RF9)
    const isCrisis = crisisPhrases.some(p => lowerMsg.includes(p));
    if (isCrisis) {
      const response =
        responsesByEmotion.crisis[Math.floor(Math.random() * responsesByEmotion.crisis.length)];
      return res.json({ response });
    }

    // 👋 Detección de saludo
    if (detectGreeting(lowerMsg)) {
      const response =
        responsesByEmotion.saludo[Math.floor(Math.random() * responsesByEmotion.saludo.length)];
      return res.json({ response });
    }

    // 💬 Detección de emoción
    const emotion = detectEmotion(lowerMsg);

    // 💜 Elegir respuesta empática
    const responses = responsesByEmotion[emotion] || responsesByEmotion.neutral;
    const response = responses[Math.floor(Math.random() * responses.length)];

    res.json({ response });
  } catch (error) {
    console.error("❌ Error en chatbot:", error);
    res.status(500).json({ response: "Error interno del chatbot." });
  }
});

module.exports = router;
