// backend/controllers/chatbotController.js
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";
import { getResponse } from "../utils/responseHelper.js";
import Conversation from "../models/Conversation.js";
import ChatSession from "../models/ChatSession.js";
import { updateEmotionalMemory } from "../utils/emotionalMemory.js";
import { toneTransform } from "../utils/tones.js";
import CrisisPhrase from "../models/CrisisPhrase.js";
import { anonymizeText } from "../utils/anonymize.js";

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
  "me voy a matar",
  "hacerme daño",
  "estoy pensando en hacerme daño",
  "no aguanto más",
  "no aguanto mas",
  "acabar con todo",
  "no veo salida",
  "no vale la pena vivir",
  "no vale la pena seguir viviendo",
  "ya no quiero existir",
  "ya no quiero exisitir",
  "ya no quiero seguir",

  // posibles a terceros
  "voy a matar a mi amigo",
  "voy a matar a alguien",
  "voy a matar",
  "matar a alguien",
  "matar a mi amigo",
  "lo voy a matar",
  "hacer daño a alguien",
];

// ⚡ Términos rápidos para decidir si vale la pena buscar crisis
const crisisQuickTerms = [
  "me quiero morir",
  "me voy a matar",
  "quiero morir",
  "quitarme la vida",
  "suicid",
  "no aguanto más",
  "no aguanto mas",
  "acabar con todo",
  "no veo salida",
  "no vale la pena",
  "no quiero vivir",
  "ya no quiero existir",
  "ya no quiero seguir",
  "estoy pensando en hacerme daño",
  "hacerme daño",
  "dañarme",
  "matarme",
  "voy a matar",
  "matar a",
  "matar a alguien",
  "matar a mi",
  "lo voy a matar",
];

// 🟣 Otras listas
const positiveKeywords = [
  "gracias",
  "mejor",
  "bien",
  "tranquil@",
  "tranquila",
  "tranquilo",
  "aliviad@",
  "aliviada",
  "aliviado",
  "funcionó",
  "funciono",
  "me ayudó",
  "me ayudo",
  "sirvió",
  "sirvio",
];

// 🟣 Detectores auxiliares no-crisis
const detectGreeting = (t = "") =>
  /\b(hola|buenas|hey|ey|hi|hello)\b/i.test(t);

const detectOffTopic = (t = "") =>
  /\b(celular|precio|dinero|plata|tel[eé]fono|computador|juego|juegos|m[úu]sica|musica|video|videos)\b/i.test(
    t
  );

const detectAffirmative = (t = "") =>
  /\b(s[ií]|sí|si|claro|dale|ok|okay|de una|por favor|bueno|vale)\b/i.test(t);

const detectPositive = (t = "") =>
  positiveKeywords.some((k) => t.toLowerCase().includes(k));

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

// 🧩 Fallback de emoción cuando el modelo tiene poca confianza (RF8)
function inferEmotionFromWords(lower = "") {
  if (
    /triste|tristeza|deprimid[oa]|sin ganas|lloro|llorando/i.test(lower)
  ) {
    return "tristeza";
  }
  if (
    /ansios[oa]|ansiedad|nervios[oa]|nervioso|preocupad[oa]|angustiad[oa]|agobiad[oa]/i.test(
      lower
    )
  ) {
    return "ansiedad";
  }
  if (/estr[eé]s|estresad[oa]|saturad[oa]|reventad[oa]/i.test(lower)) {
    return "estrés";
  }
  if (/miedo|temor|asustad[oa]|p[áa]nico|terror/i.test(lower)) {
    return "miedo";
  }
  if (/enojo|enojad[oa]|rabia|ira|furios[oa]|odio|odiar/i.test(lower)) {
    return "enojo";
  }
  return null;
}

// 🟣 Técnicas por emoción
const techniques = {
  ansiedad: [
    "🌬️ **Técnica 4-2-6:** inhala 4 segundos, mantén 2 y exhala 6. Hazlo 3 veces.",
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

  // 1️⃣ filtro rápido — si no hay términos de riesgo, hacemos una revisión mínima
  if (!crisisQuickTerms.some((t) => lower.includes(t))) {
    const phrases = await loadCrisisPhrases();
    for (const p of phrases) {
      if (lower.includes(p.text.toLowerCase())) {
        return { source: "db", phrase: p };
      }
    }
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
    // intento simple de clasificar hacia quién va el riesgo
    let target = "self";

    if (
      lower.includes("matar a ") ||
      lower.includes("voy a matar ") ||
      lower.includes("lo voy a matar") ||
      lower.includes("matar a mi") ||
      lower.includes("matar a alguien") ||
      lower.includes("matar a mi amigo") ||
      lower.includes("voy a matar a")
    ) {
      target = "others";
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

// crear mensaje de contención según el tipo detectado (RF10)
function buildCrisisReply(match) {
  const { target } = match.phrase;

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
//     🧩 Helper para guardar turno en BD (RF11 + RNF4–5)
// ===========================================================
async function saveTurn({
  sessionId,
  type,
  userId,
  userText,
  replyText,
  emotion,
  confidence = null,
}) {
  const chatModel = type === "anonimo" ? ChatSession : Conversation;

  const chat = new chatModel({
    sessionId,
    anonymous: type === "anonimo",
    userId: type === "registrado" ? userId : null,
    type,
    messages: [
      {
        sender: "user",
        text: userText,
        emotion,
        confidence,
      },
      {
        sender: "bot",
        text: replyText,
        emotion,
      },
    ],
  });

  await chat.save();
  updateEmotionalMemory().catch(() => {});
}

// ===========================================================
//     🧩 PROCESAMIENTO PRINCIPAL DEL MENSAJE
// ===========================================================
async function processMessage(
  message,
  type = "anonimo",
  userId = null,
  tone = "informal"
) {
  const original = message || "";

  // 🟣 RNF5 — Anonimización ANTES de procesar o almacenar (solo anónimo)
  const text = type === "anonimo" ? anonymizeText(original) : original;
  const lower = text.toLowerCase();

  const sessionId =
    type === "anonimo"
      ? "anon-" + Math.random().toString(36).substring(2, 9)
      : userId;

  const ctx = getContext(sessionId);
  setContext(sessionId, { tone });

  // 1️⃣ RF9 — DETECCIÓN DE CRISIS (PRIORIDAD MÁXIMA)
  const crisisMatch = await detectCrisisAdvanced(lower);
  if (crisisMatch) {
    const baseReply = buildCrisisReply(crisisMatch);
    const finalReply = toneTransform[tone](baseReply);

    await saveTurn({
      sessionId,
      type,
      userId,
      userText: text,
      replyText: baseReply,
      emotion: "crisis",
      confidence: 100,
    });

    return { reply: finalReply, emotion: "crisis" };
  }

  // 2️⃣ Técnica pendiente (offer_technique) → usuario responde que sí
  if (ctx.pendingIntent === "offer_technique" && detectAffirmative(lower)) {
    const emotion = ctx.lastEmotion || "ansiedad";
    const list = techniques[emotion] || techniques.ansiedad;
    const tip = list[Math.floor(Math.random() * list.length)];

    setContext(sessionId, { lastEmotion: emotion, pendingIntent: null });

    const finalReply = toneTransform[tone](tip);

    await saveTurn({
      sessionId,
      type,
      userId,
      userText: text,
      replyText: tip,
      emotion,
      confidence: null,
    });

    return {
      reply: finalReply,
      emotion,
    };
  }

  // 3️⃣ RESPUESTA POSITIVA (gracias, mejor…)
  if (detectPositive(lower)) {
    const baseReply =
      positiveReplies[Math.floor(Math.random() * positiveReplies.length)];

    const finalReply = toneTransform[tone](baseReply);
    const emotion = ctx.lastEmotion || "neutral";

    await saveTurn({
      sessionId,
      type,
      userId,
      userText: text,
      replyText: baseReply,
      emotion,
      confidence: null,
    });

    return {
      reply: finalReply,
      emotion,
    };
  }

  // 4️⃣ SALUDOS
  if (detectGreeting(lower)) {
    const options = [
      "💬 ¡Hola! Qué gusto tenerte aquí. ¿Cómo te sientes hoy?",
      "🌻 ¡Hola! Estoy aquí para escucharte, sin juicios.",
      "💜 ¡Hola! Cuéntame cómo te sientes en este momento.",
    ];
    const baseReply = options[Math.floor(Math.random() * options.length)];
    const finalReply = toneTransform[tone](baseReply);

    await saveTurn({
      sessionId,
      type,
      userId,
      userText: text,
      replyText: baseReply,
      emotion: "neutral",
      confidence: null,
    });

    return { reply: finalReply, emotion: "neutral" };
  }

  // 5️⃣ OFF-TOPIC
  if (detectOffTopic(lower)) {
    const baseReply =
      "Ese tema se sale un poco de lo emocional 💭. Pero si te parece, cuéntame cómo te has sentido hoy y vemos algo práctico juntos.";
    const finalReply = toneTransform[tone](baseReply);

    await saveTurn({
      sessionId,
      type,
      userId,
      userText: text,
      replyText: baseReply,
      emotion: "neutral",
      confidence: null,
    });

    return { reply: finalReply, emotion: "neutral" };
  }

  // 6️⃣ ANÁLISIS EMOCIONAL (RF8)
  const { emotion: rawEmotion, confidence } = analyzeEmotion(text);
  const lastEmotion = ctx.lastEmotion;

  let effectiveEmotion = rawEmotion;
  let finalConfidence = confidence;

  // Fallback inteligente cuando la confianza es baja
  if (confidence < 60) {
    const inferred = inferEmotionFromWords(lower);

    if (inferred) {
      effectiveEmotion = inferred;
      finalConfidence = 75;
    } else if (lastEmotion) {
      // usar la última emoción conocida
      effectiveEmotion = lastEmotion;
    } else {
      const baseReply =
        "🤔 No estoy completamente segur@ de cómo te sientes. ¿Dirías que es tristeza, ansiedad, estrés, miedo o enojo?";
      const finalReply = toneTransform[tone](baseReply);

      await saveTurn({
        sessionId,
        type,
        userId,
        userText: text,
        replyText: baseReply,
        emotion: "neutral",
        confidence,
      });

      return { reply: finalReply, emotion: "neutral" };
    }
  }

  // si llegamos aquí, tenemos una emoción efectiva
  setContext(sessionId, { lastEmotion: effectiveEmotion, pendingIntent: null });

  // 7️⃣ RESPUESTA EMPÁTICA BASE (RF7)
  let baseReply = getResponse(effectiveEmotion);

  // 8️⃣ OFRECER TÉCNICA (solo algunas emociones)
  if (["ansiedad", "estrés", "tristeza"].includes(effectiveEmotion)) {
    if (Math.random() < 0.5) {
      baseReply +=
        " 💜 Si quieres, puedo compartirte una técnica breve para calmarte.";
      setContext(sessionId, {
        lastEmotion: effectiveEmotion,
        pendingIntent: "offer_technique",
      });
    }
  }

  const finalReply = toneTransform[tone](baseReply);

  // 9️⃣ GUARDAR CONVERSACIÓN EN BD (RF11 + RNF4–5)
  await saveTurn({
    sessionId,
    type,
    userId,
    userText: text,
    replyText: baseReply,
    emotion: effectiveEmotion,
    confidence: finalConfidence,
  });

  return {
    reply: finalReply,
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

    const response = await processMessage(
      message,
      "anonimo",
      null,
      tone || "informal"
    );
    res.json(response);
  } catch (err) {
    console.error("❌ Error en handleAnonChat:", err);
    res
      .status(500)
      .json({ reply: "Ocurrió un error procesando tu mensaje. 😔" });
  }
}

export async function handleAuthChat(req, res) {
  try {
    const { message, userId, tone } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });
    }

    const response = await processMessage(
      message,
      "registrado",
      userId,
      tone || "informal"
    );
    res.json(response);
  } catch (err) {
    console.error("❌ Error en handleAuthChat:", err);
    res
      .status(500)
      .json({ reply: "No se pudo procesar tu mensaje. 😔" });
  }
}
