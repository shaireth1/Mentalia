// backend/controllers/chatbotController.js
const crypto = require("crypto");
const ChatSession = require("../models/ChatSession");
const anonymize = require("../utils/anonymize");

// Banco ampliado de respuestas (PAP + variaciones)
const empatheticBank = {
  tristeza: [
    "Siento que estás pasando un momento doloroso. Estoy aquí para escucharte. ¿Quieres contarme qué ocurrió?",
    "Lamento que te sientas triste. A veces compartir lo que duele ayuda. ¿Qué ha pasado?",
    "Entiendo... gracias por contármelo. Respira un momento, y si quieres, dime más de lo que sientes."
  ],
  ansiedad: [
    "Pareces estar experimentando ansiedad. Vamos a respirar juntos un par de veces: inhala lento... exhala. ¿Quieres intentar?",
    "La ansiedad puede sentirse muy intensa. Está bien pedir calma. ¿Puedes describir qué pensamientos tienes ahora?",
    "Veo que te sientes ansios@. ¿Quieres que te proponga una técnica breve para bajar la tensión?"
  ],
  estrés: [
    "El estrés nos indica que te importa algo mucho. ¿Qué tarea o situación te está generando esto ahora?",
    "Si te parece, podemos identificar un paso pequeño y concreto para aliviar un poco la carga. ¿Te gustaría eso?",
    "Estás poniendo mucho esfuerzo; está bien parar y respirar. ¿Quieres que te sugiera una pausa rápida?"
  ],
  miedo: [
    "El miedo es una señal protectora. Está bien sentirlo. ¿Puedes decirme qué lo provoca en este momento?",
    "Cuando el miedo aparece, a veces nombrarlo ayuda. ¿Te gustaría decirlo con tus propias palabras?",
    "Entiendo que tengas miedo. Si quieres, podemos hablar de pasos pequeños y seguros para manejarlo."
  ],
  enojo: [
    "Es válido sentir enojo cuando algo nos afecta. ¿Quieres contarme qué pasó para que te enojes?",
    "El enojo puede ser señal de límites que se han traspasado. ¿Te gustaría expresarlo conmigo sin filtros?",
    "Gracias por compartir tu enojo. ¿Quieres que proponga una manera segura de descargar esa energía?"
  ],
  neutral: [
    "Gracias por contarme. ¿Quieres profundizar en lo que sientes o prefieres una técnica para calmarte?",
    "Veo que mencionas algo; si quieres, podemos explorar cómo afectó eso tu día.",
    "Gracias por confiar en contarme. ¿Hay algo específico que quieras trabajar ahora?"
  ]
};

// Frases de riesgo (configurable desde DB/archivo en futuro)
let crisisPhrases = [
  "me quiero morir",
  "no aguanto más",
  "quiero acabar con todo",
  "no veo ninguna salida",
  "ya no quiero existir",
  "no vale la pena seguir viviendo",
  "estoy pensando en hacerme daño",
  "me quiero hacer daño"
];

// Análisis simple con scoring (palabras y sinónimos)
function analyzeEmotion(text) {
  const t = text.toLowerCase();

  // Mapar palabras a emociones con peso
  const lexicon = {
    tristeza: ["triste", "deprim", "llor", "abat", "desanim", "melancol"],
    ansiedad: ["ansios", "ansiedad", "nervios", "preocup", "panico", "angustia"],
    estrés: ["estres", "agot", "sobrecarg", "presion", "estresado"],
    miedo: ["miedo", "temor", "asust", "pavor"],
    enojo: ["enoj", "ira", "rabia", "molest", "furia"]
  };

  // Score
  const scores = { tristeza:0, ansiedad:0, estrés:0, miedo:0, enojo:0 };
  for (const [emo, keywords] of Object.entries(lexicon)) {
    for (const kw of keywords) {
      // multiplicar matches
      const re = new RegExp(kw, "gi");
      const matches = (t.match(re) || []).length;
      scores[emo] += matches;
    }
  }

  // If no tokens matched, neutral small baseline
  const total = Object.values(scores).reduce((a,b)=>a+b,0);
  if (total === 0) return { emotion: "neutral", confidence: 0.55 }; // baja confianza

  // decide mayor puntaje
  let best = "neutral";
  let bestScore = 0;
  for (const [k,v] of Object.entries(scores)) {
    if (v > bestScore) { best = k; bestScore = v; }
  }

  // simple confidence: normalized by total matches (soft)
  const confidence = Math.min(0.99, (bestScore / (total)) * 0.9 + 0.1);

  // Map 'estrés' key
  const emotionKey = best === "estrés" ? "estrés" : best;

  return { emotion: emotionKey, confidence: Number(confidence.toFixed(2)) };
}

// Crear respuesta basada en PAP + small logic
function craftResponse({ emotion, confidence, tone, userText, needsConfirmation=false }) {
  // choose bank
  const bank = empatheticBank[emotion] || empatheticBank["neutral"];
  // choose a variant
  const template = bank[Math.floor(Math.random() * bank.length)];

  // Tone handling (simple)
  if (tone === "formal") {
    return template.replace("¿", "Por favor, ¿").replace("Estoy", "Estoy aquí para ayudarle.");
  }
  return template;
}

function isCrisis(text) {
  const t = text.toLowerCase();
  return crisisPhrases.some(p => t.includes(p));
}

// generar sessionId
function newSessionId() {
  return crypto.randomBytes(12).toString("hex");
}

// Controller principal
exports.message = async (req, res) => {
  try {
    // tone: 'informal' or 'formal' -> can come from req.body.tone or header 'x-tone'
    const tone = (req.body.tone || req.headers["x-tone"] || "informal").toLowerCase();
    let { message, sessionId } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ msg: "Mensaje inválido" });
    }

    // anonimizar input antes de procesar/almacenar
    const anonText = anonymize(message);

    // Si no hay sessionId, crear uno y nueva sesión
    if (!sessionId) {
      sessionId = newSessionId();
      // crear registro inicial
      const newSession = new ChatSession({ sessionId, anonymous: true, messages: [] });
      await newSession.save();
    }

    // buscar sesión
    let session = await ChatSession.findOne({ sessionId });
    if (!session) {
      session = new ChatSession({ sessionId, anonymous: true, messages: [] });
    }

    // Guardar mensaje del usuario anonimizado
    session.messages.push({
      sender: "user",
      text: anonText,
      emotion: "unknown",
      confidence: 0,
      tone
    });

    // Detección de frase de riesgo (crisis) - prioridad
    if (isCrisis(anonText)) {
      const botText = "💛 Lamento mucho que te sientas así. No estás sol@. Si estás en peligro inmediato, por favor contacta la línea 106 (Colombia) o acude al servicio de urgencias. ¿Quieres que te comparta contactos o recursos ahora?";
      session.messages.push({
        sender: "bot",
        text: botText,
        emotion: "crisis",
        confidence: 1,
        tone
      });
      await session.save();
      return res.json({
        currentResponse: botText,
        emotion: "crisis",
        confidence: 1,
        tone,
        sessionId,
        crisis: true
      });
    }

    // Analizar emoción y confianza
    const { emotion, confidence } = analyzeEmotion(anonText);

    // Si confianza baja (< 0.60) pedimos confirmación (no asumimos)
    if (confidence < 0.60) {
      const ask = "Creo que no me queda del todo claro cómo te sientes. ¿Podrías decirme si te sientes: triste, ansios@, estresad@, con miedo o enojad@? Responde una palabra si puedes.";
      session.messages.push({
        sender: "bot",
        text: ask,
        emotion: "clarify",
        confidence,
        tone
      });
      await session.save();
      return res.json({
        currentResponse: ask,
        emotion: "uncertain",
        confidence,
        tone,
        sessionId,
        needsConfirmation: true
      });
    }

    // Si confianza suficiente -> generar respuesta (PAP)
    const reply = craftResponse({ emotion, confidence, tone, userText: anonText });

    // Guardamos análisis y respuesta
    // actualizamos último message (user) con emotion/confidence
    const lastIdx = session.messages.length - 1;
    if (lastIdx >= 0) {
      session.messages[lastIdx].emotion = emotion;
      session.messages[lastIdx].confidence = confidence;
    }

    session.messages.push({
      sender: "bot",
      text: reply,
      emotion,
      confidence,
      tone
    });

    // Guardar sesión (sin metadatos de usuario, es anónima)
    await session.save();

    // Devolver respuesta al frontend
    return res.json({
      currentResponse: reply,
      emotion,
      confidence,
      tone,
      sessionId,
      crisis: false
    });
  } catch (err) {
    console.error("❌ Error en chatbot:", err);
    return res.status(500).json({ msg: "Error interno del chatbot", error: err.message });
  }
};
