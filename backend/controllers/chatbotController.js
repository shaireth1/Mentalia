// 📁 backend/controllers/chatbotController.js

// --- Base de emociones y respuestas empáticas según PAP ---
const empatheticResponses = {
  tristeza: [
    "Siento mucho que estés pasando por un momento así 💜. A veces no es fácil, pero estás haciendo bien al expresarlo.",
    "Llorar o sentirse triste no te hace débil. Es una forma de sanar 💧.",
    "Tu tristeza tiene un motivo, y está bien sentirla. No tienes que ocultarla.",
    "Puedo quedarme contigo mientras te desahogas, si lo necesitas 💫.",
  ],
  estres: [
    "El estrés puede ser abrumador 😣. Respira un momento, no tienes que hacerlo todo ya.",
    "Tu mente está pidiendo una pausa, y eso es completamente válido 💜.",
    "Recuerda que detenerte un momento también es avanzar 🌿.",
    "¿Quieres que te comparta una técnica breve de relajación?",
  ],
  ansiedad: [
    "La ansiedad puede hacer que todo se sienta demasiado rápido 💭. Intenta inhalar profundo, y exhalar lento conmigo.",
    "No estás sol@, la ansiedad no te define 💜.",
    "Te entiendo, a veces la mente se llena de pensamientos difíciles. Estoy aquí para ayudarte a calmarte.",
    "Podemos intentar enfocarnos en algo pequeño y real: tus manos, tu respiración, el momento presente 🌷.",
  ],
  miedo: [
    "Es válido tener miedo 💜. Nadie puede con todo siempre.",
    "Tu miedo no te hace menos fuerte, te hace humano.",
    "Puedes contarme qué te preocupa. A veces, ponerlo en palabras ayuda a que pese menos.",
    "Estás a salvo aquí conmigo, podemos hablar de eso sin juicio 🕊️.",
  ],
  enojo: [
    "Veo que estás molesto 😔. Tu enojo es válido, probablemente te han lastimado o algo no fue justo.",
    "Puedes expresar tu enojo sin dañarte ni dañar a otros. Yo te escucho 💜.",
    "La rabia a veces cubre tristeza o cansancio, ¿crees que pueda ser eso?",
    "Respirar o moverte un poco puede ayudar a liberar parte de esa tensión 💢.",
  ],
  neutral: [
    "Estoy aquí contigo 💜. Cuéntame lo que tengas en mente.",
    "Gracias por escribirme. A veces no saber cómo sentirse también es una emoción válida.",
    "Podemos hablar de lo que quieras, sin prisa ni juicios 🌿.",
    "Tu bienestar importa, aunque hoy no lo sientas tan claro 💫.",
  ]
};

// --- Detección simple de emociones por palabras clave ---
const detectEmotion = (text) => {
  const lower = text.toLowerCase();
  if (lower.match(/triste|deprimid|mal|llorar|solo|sola/)) return "tristeza";
  if (lower.match(/estres|estresad|agotad|cansad/)) return "estres";
  if (lower.match(/ansioso|nervioso|preocupad|inquiet/)) return "ansiedad";
  if (lower.match(/miedo|temor|asustad/)) return "miedo";
  if (lower.match(/enojad|rabia|furios|molest/)) return "enojo";
  return "neutral";
};

// --- Simulación de nivel de confianza ---
const calculateConfidence = (message) => {
  const randomFactor = Math.random() * 0.3 + 0.7; // 70% a 100%
  return Math.round(randomFactor * 100);
};

// --- Controlador principal ---
exports.getResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ msg: "Mensaje inválido" });
    }

    // Analizar emoción
    const emotion = detectEmotion(message);
    const confidence = calculateConfidence(message);

    // Si la confianza es baja (<60%), pedir confirmación
    if (confidence < 60) {
      return res.json({
        response: "No estoy muy segur@ de cómo te sientes 😔. ¿Dirías que es más tristeza, ansiedad o enojo?",
        emotion: "indefinida",
        confidence,
      });
    }

    // Seleccionar respuesta basada en emoción detectada
    const responses = empatheticResponses[emotion] || empatheticResponses.neutral;
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    // Crear registro de análisis
    const analysisResult = {
      emotion,
      confidence,
      timestamp: new Date(),
      userInput: message,
      botResponse: randomResponse,
    };

    console.log("🧠 Análisis emocional:", analysisResult);

    res.status(200).json({
      currentResponse: randomResponse,
      emotion,
      confidence,
      timestamp: analysisResult.timestamp,
    });
  } catch (error) {
    console.error("❌ Error en chatbot:", error);
    res.status(500).json({ msg: "Error en el chatbot", error: error.message });
  }
};
