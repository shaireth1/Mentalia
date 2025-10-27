// 📁 backend/routes/chatbot.js
const express = require("express");
const router = express.Router();

// 🌿 Mapeo de emociones según palabras clave
const emotionMap = {
  tristeza: ["triste", "mal", "solo", "deprimido", "decaído", "sin ganas"],
  estres: ["estresado", "cansado", "agotado", "presionado", "ansioso"],
  miedo: ["miedo", "asustado", "preocupado", "nervioso", "inseguro"],
  enojo: ["enojado", "molesto", "frustrado", "rabia", "furioso"],
  alegria: ["feliz", "contento", "tranquilo", "bien", "agradecido"]
};

// 💬 Frases empáticas por emoción
const respuestasEmpaticas = {
  tristeza: [
    "💜 Entiendo que estás pasando por un momento difícil, y está bien sentirte así.",
    "A veces la tristeza pesa, pero no estás sol@ en esto 🌙.",
    "Gracias por confiar en mí para contarlo. Tu sentir es válido y merece cuidado."
  ],
  estres: [
    "Respira un momento, estás haciendo lo mejor que puedes 🌿.",
    "El cansancio emocional es real, y mereces descansar sin sentir culpa.",
    "A veces todo se siente demasiado, pero poco a poco se puede aliviar 💫."
  ],
  miedo: [
    "El miedo también habla de lo mucho que te importa algo 💭.",
    "Entiendo que te sientas así, no tienes que enfrentarlo todo sol@.",
    "Hablar de lo que asusta ya es un acto de valentía 💪."
  ],
  enojo: [
    "Tu enojo también tiene un mensaje, y es válido que lo sientas 🔥.",
    "Es normal sentirse frustrado cuando las cosas duelen o no salen bien.",
    "Estoy aquí, puedes desahogarte. No voy a juzgarte ❤️."
  ],
  alegria: [
    "✨ Me alegra mucho escuchar eso, mereces sentirte así.",
    "Qué lindo leer algo positivo, guárdalo como un momento bonito.",
    "Disfruta este instante, te lo ganaste 💛."
  ],
  neutral: [
    "Estoy aquí para escucharte, cuéntame más 💬.",
    "Gracias por compartir cómo te sientes. ¿Quieres que hablemos más de eso?",
    "No estás sol@, este es un espacio para ti 💜."
  ]
};

// 🧠 Función para detectar emoción
function detectarEmocion(texto) {
  const lower = texto.toLowerCase();
  for (const [emocion, palabras] of Object.entries(emotionMap)) {
    if (palabras.some((p) => lower.includes(p))) return emocion;
  }
  return "neutral";
}

// 💫 Función para generar respuesta empática
function generarRespuestaEmpatica(emocion) {
  const frases = respuestasEmpaticas[emocion] || respuestasEmpaticas.neutral;
  return frases[Math.floor(Math.random() * frases.length)];
}

// 💌 Endpoint principal del chatbot
router.post("/message", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ msg: "Mensaje vacío o inválido" });
    }

    const emotion = detectarEmocion(message);
    const botResponse = generarRespuestaEmpatica(emotion);

    return res.status(200).json({
      userMessage: message,
      botResponse,
      emotion,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("❌ Error en chatbot:", error);
    res.status(500).json({ msg: "Error interno del chatbot" });
  }
});

module.exports = router;
