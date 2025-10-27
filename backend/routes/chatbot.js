// backend/routes/chatbot.js
const express = require("express");
const router = express.Router();

let chatHistory = [];

/* =====================================================
   🧩 Mapa de emociones mejorado (con variaciones de género)
===================================================== */
const emotionMap = {
  tristeza: [
    "triste", "tristeza", "solo", "sola", "mal", "vacío", "vacio",
    "deprimido", "deprimida", "sin ganas", "llorar", "abrumado", "abrumada"
  ],
  estres: [
    "estresado", "estresada", "estresante", "agotado", "agotada", "cansado",
    "cansada", "presionado", "presionada", "ansioso", "ansiosa", "preocupado", "preocupada"
  ],
  miedo: [
    "miedo", "asustado", "asustada", "nervioso", "nerviosa", "temor", "inseguro", "insegura"
  ],
  enojo: [
    "enojado", "enojada", "molesto", "molesta", "rabia", "furioso", "furiosa", "frustrado", "frustrada"
  ],
  alegria: [
    "feliz", "contento", "contenta", "tranquilo", "tranquila", "bien", "agradecido", "agradecida"
  ]
};

/* =====================================================
   🧩 Frases empáticas PAP
===================================================== */
const papResponses = {
  escucha: [
    "Te estoy escuchando 💜, puedes contarme lo que sientas, sin juicios.",
    "Gracias por confiar en mí para contarlo. Estoy aquí para ti 🌱.",
    "Hablar ya es un paso enorme, gracias por hacerlo 💫."
  ],
  calma: [
    "Respira un momento conmigo: inhala profundo... exhala lento 🌿.",
    "Tomémonos un respiro juntos. No tienes que resolverlo todo ahora.",
    "Estás haciendo lo mejor que puedes, y eso ya es suficiente 💜."
  ],
  conecta: [
    "No estás sol@, estoy aquí para ti 💜.",
    "Hablar ayuda, y es valiente que lo hagas.",
    "Aunque sea virtualmente, estás acompañad@ ahora mismo 🤍."
  ],
  informa: [
    "¿Quieres que te comparta una técnica breve para calmarte? 🌸",
    "Podemos intentar una respiración guiada o un ejercicio de calma mental.",
    "A veces escribir o moverte un poco puede ayudarte a soltar lo que sientes."
  ],
  protege: [
    "💛 Lamento mucho que te sientas así. No estás sol@, y hay ayuda disponible.",
    "Por favor contacta una línea de apoyo: Línea 106 (Colombia) o acude a un centro cercano 🕊️.",
    "Hablar de esto ya es un paso enorme. No te quedes sol@, busca a alguien de confianza 💛."
  ]
};

/* =====================================================
   🧩 Frases de crisis
===================================================== */
const crisisPhrases = [
  "me quiero morir",
  "no aguanto más",
  "quiero acabar con todo",
  "no veo salida",
  "ya no quiero existir",
  "no vale la pena seguir viviendo",
  "estoy pensando en hacerme daño"
];

/* =====================================================
   🧩 Funciones auxiliares
===================================================== */
function detectarEmocion(texto) {
  const lower = texto.toLowerCase();
  for (const [emocion, palabras] of Object.entries(emotionMap)) {
    if (palabras.some(p => lower.includes(p))) return emocion;
  }
  return "neutral";
}

function seleccionarRespuesta(etapa) {
  const opciones = papResponses[etapa];
  return opciones[Math.floor(Math.random() * opciones.length)];
}

/* =====================================================
   🧩 Ruta principal del chatbot
===================================================== */
router.post("/message", async (req, res) => {
  const { message } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ msg: "Mensaje vacío o inválido" });
  }

  const lowerMsg = message.toLowerCase();

  // 1️⃣ Detectar crisis
  const isCrisis = crisisPhrases.some(p => lowerMsg.includes(p));
  if (isCrisis) {
    const crisisResponse = seleccionarRespuesta("protege");
    chatHistory.push({ user: message, bot: crisisResponse, emotion: "crisis" });
    return res.json({ emotion: "crisis", botResponse: crisisResponse, chatHistory });
  }

  // 2️⃣ Detectar emoción principal
  const emotion = detectarEmocion(lowerMsg);

  // 3️⃣ Asignar etapa PAP según emoción
  let stage = "escucha";
  if (emotion === "tristeza") stage = "calma";
  else if (emotion === "estres") stage = "conecta";
  else if (emotion === "enojo") stage = "informa";
  else if (emotion === "miedo") stage = "calma";

  // 4️⃣ Elegir respuesta empática
  let empatheticResponse = seleccionarRespuesta(stage);

  // 5️⃣ Personalizar con contexto anterior
  const lastEmotion = chatHistory.length > 0 ? chatHistory.at(-1).emotion : null;
  if (lastEmotion && lastEmotion === emotion) {
    empatheticResponse = `Parece que aún te sientes ${emotion}. Gracias por seguir compartiéndolo 💜. ${empatheticResponse}`;
  } else if (lastEmotion && lastEmotion !== emotion) {
    empatheticResponse = `Noté un cambio en cómo te sientes, ahora parece más ${emotion}. ${empatheticResponse}`;
  }

  // 6️⃣ Guardar y limitar historial
  chatHistory.push({ user: message, bot: empatheticResponse, emotion });
  if (chatHistory.length > 10) chatHistory.shift();

  // 7️⃣ Responder al cliente
  return res.json({
    emotion,
    botResponse: empatheticResponse,
    chatHistory,
    timestamp: new Date()
  });
});

module.exports = router;
