// controllers/chatbotController.js

const empatheticResponses = {
  informal: [
    "Entiendo cómo te sientes 💜",
    "Estoy aquí para escucharte 🤍",
    "Lo que estás viviendo es importante 💫",
    "Gracias por contarme cómo te sientes 💬",
    "Sé que esto es difícil, pero no estás sol@ 🌷"
  ],
  formal: [
    "Comprendo la situación que estás atravesando.",
    "Estoy disponible para atenderte y ofrecerte apoyo.",
    "Tu bienestar es importante para nosotros.",
    "Gracias por comunicar cómo te encuentras.",
    "Reconozco que es un momento complicado, pero no estás solo/a."
  ]
};

const crisisPhrases = [
  "me quiero morir",
  "no aguanto más",
  "quiero acabar con todo",
  "no veo ninguna salida",
  "ya no quiero existir",
  "no vale la pena seguir viviendo",
  "estoy pensando en hacerme daño"
];

exports.procesarMensaje = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ msg: "Mensaje inválido" });
    }

    // 🧠 Crear sesión si no existe
    if (!req.session.chatHistory) req.session.chatHistory = [];
    if (!req.session.chatTone) req.session.chatTone = "informal"; // valor por defecto

    const lowerMsg = message.toLowerCase();

    // 🟣 1. Permitir cambiar el tono
    if (lowerMsg.includes("modo formal")) {
      req.session.chatTone = "formal";
      return res.json({
        response: "✅ Has cambiado al modo formal.",
        tone: "formal",
        chatHistory: req.session.chatHistory
      });
    }

    if (lowerMsg.includes("modo informal")) {
      req.session.chatTone = "informal";
      return res.json({
        response: "✅ Has cambiado al modo informal.",
        tone: "informal",
        chatHistory: req.session.chatHistory
      });
    }

    // 🟢 2. Detectar crisis
    const isCrisis = crisisPhrases.some(p => lowerMsg.includes(p));
    let botResponse;
    let emotion = "neutral";

    if (isCrisis) {
      botResponse =
        "💛 Lamento mucho que te sientas así. No estás sol@, por favor contacta una línea de ayuda:\n📞 Línea 106 (Colombia) o 018000 113 113.";
      emotion = "crisis";
    } else {
      // 🟡 3. Analizar emoción básica
      if (lowerMsg.includes("triste") || lowerMsg.includes("mal")) emotion = "tristeza";
      else if (lowerMsg.includes("ansioso") || lowerMsg.includes("estresado")) emotion = "estrés";
      else if (lowerMsg.includes("miedo")) emotion = "miedo";
      else if (lowerMsg.includes("enojado") || lowerMsg.includes("rabia")) emotion = "enojo";

      // 🔹 4. Escoger frase según tono actual
      const tone = req.session.chatTone;
      const responses = empatheticResponses[tone];
      botResponse = responses[Math.floor(Math.random() * responses.length)];
    }

    // 🟤 5. Guardar en historial
    const interaction = {
      user: message,
      bot: botResponse,
      emotion,
      tone: req.session.chatTone,
      timestamp: new Date()
    };
    req.session.chatHistory.push(interaction);

    // 🟢 6. Devolver respuesta
    res.json({
      currentResponse: botResponse,
      emotion,
      tone: req.session.chatTone,
      chatHistory: req.session.chatHistory
    });
  } catch (err) {
    console.error("❌ Error en chatbot:", err);
    res.status(500).json({ msg: "Error interno del chatbot" });
  }
};
