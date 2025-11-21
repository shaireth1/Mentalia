// backend/controllers/chatbotController.js
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";
import { getResponse } from "../utils/responseHelper.js";
import Conversation from "../models/Conversation.js";
import ChatSession from "../models/ChatSession.js";
import { updateEmotionalMemory } from "../utils/emotionalMemory.js";
import { toneTransform } from "../utils/tones.js";
import CrisisPhrase from "../models/CrisisPhrase.js";

// 🧠 Memoria contextual por sesión (no se guarda en BD)
const sessionContext = new Map();

// 🟣 Palabras clave estáticas de crisis (fallback)
const crisisKeywordsStatic = [
  "me quiero morir",
  "quiero morir",
  "no quiero vivir",
  "prefiero morir",
  "quitarme la vida",
  "suicidio",
  "suicidarme",
  "matarme",
  "hacerme daño",
  "no aguanto más",
  "no aguanto mas",
  "acabar con todo",
  "no veo salida",
  "no vale la pena vivir",
  "ya no quiero existir",
  "ya no quiero exisitir",
  "ya no quiero seguir",

  // posibles a terceros
  "matar a alguien",
  "hacerse daño a alguien",
  "hacer daño a alguien",
];

// para detectar rápidamente presencia de términos generales
const crisisQuickTerms = [
  "morir",
  "morirme",
  "morirme",
  "suicid",
  "matarme",
  "matar a alguien",
  "no aguanto",
  "no quiero vivir",
  "acabar con todo",
  "no veo salida",
  "no quiero existir",
  "hacerme daño",
];

// 🟣 Otras listas
const positiveKeywords = [
  "gracias", "mejor", "bien", "tranquil@", "tranquila",
  "aliviad@", "funcionó", "me ayudó", "sirvió"
];

// 🟣 Detectores auxiliares no-crisis
const detectGreeting = (t = "") => /\b(hola|buenas|hey|ey|hi|hello)\b/i.test(t);
const detectOffTopic = (t = "") =>
  /\b(celular|precio|dinero|plata|tel[eé]fono|computador|juego|musica|video)\b/i.test(t);
const detectAffirmative = (t = "") => /\b(s[ií]|claro|dale|ok|de una|por favor)\b/i.test(t);
const detectPositive = (t = "") => positiveKeywords.some(k => t.toLowerCase().includes(k));

// 🟣 Contexto por sesión
function getContext(id) {
  return (
    sessionContext.get(id) || {
      lastEmotion: null,
      pendingIntent: null,
      lastReplyType: null,
      tone: "informal",
    }
  );
}

function setContext(id, ctx) {
  const prev = sessionContext.get(id) || {};
  sessionContext.set(id, { ...prev, ...ctx });
}

// 🟣 Técnicas por emoción
const techniques = {
  ansiedad: [
    "🌬️ **Técnica 4-2-6:** inhala 4s, mantén 2s y exhala 6s. Hazlo 3 veces.",
    "💜 Prueba 3-2-1: nombra 3 cosas que ves, 2 que escuchas y 1 que sientes.",
    "🫶 Repite: *Estoy a salvo, puedo ir a mi ritmo.*",
  ],
  estrés: [
    "😮‍💨 **Pausa consciente:** respira hondo y estira los hombros 3 veces.",
    "🌿 Haz una lista de 3 cosas que hiciste hoy. Cada una cuenta.",
    "💭 Bebe agua lentamente y respira. A veces lo simple ayuda.",
  ],
  tristeza: [
    "💜 Escribe lo que sientes sin juzgarlo. Te puede liberar un poco.",
    "🌷 Abraza algo cálido o suave para calmar el cuerpo.",
    "💭 Escoge una canción tranquila y respira mientras la escuchas.",
  ],
};

// 🟣 Respuestas positivas
const positiveReplies = [
  "💜 Qué bueno que te sientes un poco mejor. Estoy contigo.",
  "🌷 Cada pequeño paso cuenta. Me alegra leerte así.",
  "💫 Me alegra que algo te haya servido. Estoy orgullos@ de ti.",
  "💛 Gracias por compartir eso conmigo. Mereces sentirte mejor.",
  "🌻 Me alegra mucho leer eso. Respira un momento y agradécete.",
];

// ===========================================================
//    🔥 RF9 PRO — DETECCIÓN DE FRASES DE RIESGO DINÁMICA
// ===========================================================

// caché simple en memoria para no ir a la BD en cada mensaje
let crisisCache = {
  lastLoad: 0,
  phrases: [],
};

async function loadCrisisPhrases() {
  const now = Date.now();
  // recargar cada 60 segundos
  if (now - crisisCache.lastLoad < 60 * 1000 && crisisCache.phrases.length > 0) {
    return crisisCache.phrases;
  }

  try {
    const list = await CrisisPhrase.find();
    crisisCache = {
      lastLoad: now,
      phrases: list,
    };
    return list;
  } catch (err) {
    console.error("❌ Error cargando CrisisPhrase desde BD:", err);
    return crisisCache.phrases || [];
  }
}

// detectar crisis desde BD + fallback estático
async function detectCrisisAdvanced(text) {
  const lower = text.toLowerCase();

  // 1️⃣ filtro rápido — si ni siquiera hay términos de riesgo, ahorramos trabajo
  if (!crisisQuickTerms.some((t) => lower.includes(t))) {
    // igual revisamos palabras exactas por si el admin configuró otras frases
    const phrases = await loadCrisisPhrases();
    for (const p of phrases) {
      if (lower.includes(p.text.toLowerCase())) {
        return { source: "db", phrase: p };
      }
    }

    // ni rastro → sin crisis
    return null;
  }

  // 2️⃣ revisar en BD configurada por la psicóloga
  const phrases = await loadCrisisPhrases();
  for (const p of phrases) {
    if (lower.includes(p.text.toLowerCase())) {
      return { source: "db", phrase: p };
    }
  }

  // 3️⃣ fallback estático (por si la BD aún está vacía)
  const staticHit = crisisKeywordsStatic.find((k) => lower.includes(k));
  if (staticHit) {
    // intento simple de clasificar
    let target = "unspecified";
    if (lower.includes("matar a alguien") || lower.includes("hacer daño a otros")) {
      target = "others";
    } else {
      target = "self";
    }

    return {
      source: "static",
      phrase: {
        text: staticHit,
        category: "suicidio",
        severity: "alto",
        target,
      },
    };
  }

  return null;
}

// crear mensaje de contención según el tipo detectado
function buildCrisisReply(match) {
  const { category, severity, target } = match.phrase;

  // riesgo hacia sí mismo (suicidio / autolesión / ideación de muerte)
  if (target === "self") {
    return (
      "💛 Lo que estás sintiendo es muy importante y no estás sol@ en esto. " +
      "En este momento es muy importante que no te quedes con esto en silencio. " +
      "Si estás en Colombia, puedes comunicarte con la Línea 106 o con emergencias al 123. " +
      "También puedes hablar con un profesional de tu institución o alguien de confianza. " +
      "Si sientes que corres peligro inmediato, por favor busca ayuda de urgencias de inmediato."
    );
  }

  // riesgo hacia otros (ira / violencia / daño a terceros)
  if (target === "others") {
    return (
      "⚠️ Lo que mencionas refleja mucha intensidad emocional. " +
      "Hacer daño a otras personas no es una solución y puede traer consecuencias muy graves para ti y para los demás. " +
      "Te sugiero hablar con un profesional de salud mental o con alguien de confianza para procesar lo que sientes. " +
      "Si sientes que podrías perder el control, busca apoyo profesional o de emergencia en tu zona."
    );
  }

  // caso genérico / no especificado
  return (
    "💛 Percibo que estás pasando por un momento muy difícil. " +
    "No tienes que atravesarlo en soledad. Hablar con alguien de confianza o con un profesional puede marcar la diferencia. " +
    "Si estás en una situación de riesgo, por favor comunícate con una línea de ayuda o con servicios de urgencias en tu localidad."
  );
}

// ===========================================================
//     🧩 PROCESAMIENTO PRINCIPAL DEL MENSAJE
// ===========================================================
async function processMessage(message, type = "anonimo", userId = null, tone = "informal") {
  const lower = message.toLowerCase();

  const sessionId =
    type === "anonimo"
      ? "anon-" + Math.random().toString(36).substring(2, 9)
      : userId;

  const ctx = getContext(sessionId);
  setContext(sessionId, { tone });

  // 1️⃣ si hay técnica pendiente y el usuario dice que sí
  if (ctx.pendingIntent === "offer_technique" && detectAffirmative(lower)) {
    const emotion = ctx.lastEmotion || "ansiedad";
    const list = techniques[emotion] || techniques.ansiedad;
    const tip = list[Math.floor(Math.random() * list.length)];

    setContext(sessionId, { lastEmotion: emotion, pendingIntent: null });

    return {
      reply: toneTransform[tone](tip),
      emotion,
    };
  }

  // 2️⃣ RESPUESTA POSITIVA
  if (detectPositive(lower)) {
    const reply = positiveReplies[Math.floor(Math.random() * positiveReplies.length)];

    return {
      reply: toneTransform[tone](reply),
      emotion: ctx.lastEmotion || "neutral",
    };
  }

  // 3️⃣ RF9 PRO — DETECCIÓN DE CRISIS
  const crisisMatch = await detectCrisisAdvanced(lower);
  if (crisisMatch) {
    const reply = buildCrisisReply(crisisMatch);
    return { reply: toneTransform[tone](reply), emotion: "crisis" };
  }

  // 4️⃣ SALUDOS
  if (detectGreeting(lower)) {
    const options = [
      "💬 ¡Hola! Qué gusto tenerte aquí. ¿Cómo te sientes hoy?",
      "🌻 ¡Hola! Estoy aquí para escucharte, sin juicios.",
      "💜 ¡Hola! Cuéntame cómo te sientes en este momento.",
    ];
    const reply = options[Math.floor(Math.random() * options.length)];
    return { reply: toneTransform[tone](reply), emotion: "neutral" };
  }

  // 5️⃣ OFF-TOPIC
  if (detectOffTopic(lower)) {
    const reply =
      "Ese tema se sale un poco de lo emocional 💭. Pero si te parece, cuéntame cómo te has sentido hoy y vemos algo práctico juntos.";
    return { reply: toneTransform[tone](reply), emotion: "neutral" };
  }

  // 6️⃣ ANÁLISIS EMOCIONAL
  const { emotion, confidence } = analyzeEmotion(message);
  const lastEmotion = ctx.lastEmotion;

  if (confidence < 60 && !lastEmotion) {
    const reply =
      "🤔 No estoy completamente segur@ de cómo te sientes. ¿Dirías que es tristeza, ansiedad, estrés, miedo o enojo?";
    return { reply: toneTransform[tone](reply), emotion: "neutral" };
  }

  const effectiveEmotion = confidence < 60 && lastEmotion ? lastEmotion : emotion;

  setContext(sessionId, { lastEmotion: effectiveEmotion, pendingIntent: null });

  // 7️⃣ RESPUESTA EMPÁTICA BASE
  let reply = getResponse(effectiveEmotion);

  // 8️⃣ OFRECER TÉCNICA
  if (["ansiedad", "estrés", "tristeza"].includes(effectiveEmotion)) {
    if (Math.random() < 0.5) {
      reply += " 💜 Si quieres, puedo compartirte una técnica breve para calmarte.";
      setContext(sessionId, {
        lastEmotion: effectiveEmotion,
        pendingIntent: "offer_technique",
      });
    }
  }

  // 9️⃣ GUARDAR CONVERSACIÓN EN BD
  const chatModel = type === "anonimo" ? ChatSession : Conversation;

  const chat = new chatModel({
    sessionId,
    anonymous: type === "anonimo",
    userId: type === "registrado" ? userId : null,
    type: type,
    messages: [
      { sender: "user", text: message, emotion: effectiveEmotion, confidence },
      { sender: "bot", text: reply, emotion: effectiveEmotion },
    ],
  });

  await chat.save();
  updateEmotionalMemory().catch(() => {});

  return {
    reply: toneTransform[tone](reply),
    emotion: effectiveEmotion,
  };
}

// ===========================================================
//                      ENDPOINTS
// ===========================================================
export async function handleAnonChat(req, res) {
  try {
    const { message, tone } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });
    }

    const response = await processMessage(message, "anonimo", null, tone || "informal");
    res.json(response);
  } catch (err) {
    console.error("❌ Error en handleAnonChat:", err);
    res.status(500).json({ reply: "Ocurrió un error procesando tu mensaje. 😔" });
  }
}

export async function handleAuthChat(req, res) {
  try {
    const { message, userId, tone } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });
    }

    const response = await processMessage(message, "registrado", userId, tone || "informal");
    res.json(response);
  } catch (err) {
    console.error("❌ Error en handleAuthChat:", err);
    res.status(500).json({ reply: "No se pudo procesar tu mensaje. 😔" });
  }
}
