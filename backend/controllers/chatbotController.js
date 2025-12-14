// backend/controllers/chatbotController.js
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";
import { getResponse } from "../utils/responseHelper.js";
import Conversation from "../models/Conversation.js";
import ChatSession from "../models/ChatSession.js";
import { updateEmotionalMemory } from "../utils/emotionalMemory.js";
import { toneTransform } from "../utils/tones.js";
import CrisisPhrase from "../models/CrisisPhrase.js";
import { anonymizeText } from "../utils/anonymize.js";
import { createAlert } from "./alertController.js";



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
  "me quiero matar",          // 🆕 agregado
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

// ⚡ Términos rápidos para decidir evaluación rápida
const crisisQuickTerms = [
  "me quiero morir",
  "me voy a matar",
  "me quiero matar",          // 🆕 agregado
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
  "feliz"
];

// 🟣 Detectores auxiliares no-crisis
const detectGreeting = (t = "") =>
  /\b(hola|buenas|hey|ey|hi|hello)\b/i.test(t);

const detectOffTopic = (t = "") =>
  /\b(celular|precio|dinero|plata|tel[eé]fono|computador|juego|juegos|m[úu]sica|musica|video|videos)\b/i.test(t);

const detectAffirmative = (t = "") =>
  /\b(s[ií]|sí|si|claro|dale|ok|okay|de una|por favor|bueno|vale)\b/i.test(t);
// 🟣 Detectar solicitud explícita de técnica
function detectTechniqueRequest(t = "") {
  return (
    /\btécnica\b/i.test(t) ||
    /tecnica/i.test(t) ||
    /quiero.*técnica/i.test(t) ||
    /quiero.*tecnica/i.test(t) ||
    /dame.*técnica/i.test(t) ||
    /dame.*tecnica/i.test(t) ||
    /necesito.*técnica/i.test(t) ||
    /ayuda.*calmarme/i.test(t) ||
    /enséñame.*técnica/i.test(t)
  );
}

const detectPositive = (t = "") =>
  positiveKeywords.some((k) => t.toLowerCase().includes(k));

// 🟣 Manejo de contexto por sesión
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

// 🟣 Detectar "mal", "me siento mal", etc.
function detectGenericBad(lower = "") {
  if (
    /\bmal\b/.test(lower) ||
    /me siento mal/.test(lower) ||
    /estoy mal/.test(lower) ||
    /ando mal/.test(lower) ||
    /no estoy bien/.test(lower) ||
    /no me siento bien/.test(lower) ||
    /fatal/.test(lower) ||
    /horrible/.test(lower)
  ) {
    return "tristeza"; // emocionalmente válido
  }
  return null;
}

// 🧩 Fallback de emoción cuando la confianza es baja (RF8)
function inferEmotionFromWords(lower = "") {
  // Expresiones generales de malestar
  if (/mal\b|me siento mal|estoy mal|ando mal|no estoy bien|no me siento bien/i.test(lower)) {
    return "tristeza";
  }

  if (/mal|fatal|terrible|horrible|muy mal/i.test(lower)) {
    return "tristeza";
  }

  // Emociones básicas "limpias"
  if (/triste|tristeza|deprimid[oa]|sin ganas|lloro|llorando/i.test(lower)) {
    return "tristeza";
  }
  if (/ansios[oa]|ansiedad|nervios[oa]|nervioso|preocupad[oa]|angustiad[oa]|agobiad[oa]/i.test(lower)) {
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

  // Variantes y errores comunes
  if (/trizte|triztesa|triztea/i.test(lower)) {
    return "tristeza";
  }
  if (/ansieda|ansiado|ansiada/i.test(lower)) {
    return "ansiedad";
  }
  if (/estresad[oa]h?|estrez|estresao/i.test(lower)) {
    return "estrés";
  }
  if (/miedoh|miedito|temeros[oa]/i.test(lower)) {
    return "miedo";
  }
  if (/enojad[oa]h?|molest[oa]|furios[oa]/i.test(lower)) {
    return "enojo";
  }

  return null;
}

// 🟣 Técnicas emocionales
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
// 🔥 CARGA DE FRASES DE RIESGO (RF9)
// ===========================================================

let crisisCache = {
  lastLoad: 0,
  phrases: [],
};

async function loadCrisisPhrases() {
  const now = Date.now();
  if (now - crisisCache.lastLoad < 60 * 1000 && crisisCache.phrases.length > 0) {
    return crisisCache.phrases;
  }

  try {
    const list = await CrisisPhrase.find();
    crisisCache = { lastLoad: now, phrases: list };
    return list;
  } catch (err) {
    console.error("❌ Error cargando CrisisPhrase:", err);
    return crisisCache.phrases || [];
  }
}

// Detección avanzada de crisis
async function detectCrisisAdvanced(text) {
  const lower = text.toLowerCase();

  if (!crisisQuickTerms.some((t) => lower.includes(t))) {
    const phrases = await loadCrisisPhrases();
    for (const p of phrases) {
      if (lower.includes(p.text.toLowerCase())) {
        return { source: "db", phrase: p };
      }
    }
    return null;
  }

  const phrases = await loadCrisisPhrases();
  for (const p of phrases) {
    if (lower.includes(p.text.toLowerCase())) {
      return { source: "db", phrase: p };
    }
  }

  const staticHit = crisisKeywordsStatic.find((k) => lower.includes(k));
  if (staticHit) {
    let target = "self";

    if (
      lower.includes("matar a ") ||
      lower.includes("voy a matar") ||
      lower.includes("lo voy a matar") ||
      lower.includes("matar a mi") ||
      lower.includes("matar a alguien") ||
      lower.includes("matar a mi amigo")
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



// ===========================================================
// 🧩 Helper guardar turno en BD (RF11 + RNF4–5) — FIX DUPLICATE KEY
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
  try {
    const chatModel = type === "anonimo" ? ChatSession : Conversation;

    const userMsg = {
      sender: "user",
      text: userText,
      emotion,
      confidence,
      timestamp: new Date(),
    };

    const botMsg = {
  sender: "bot",
  text: replyText,
  emotion: null,   // 👈 EL BOT NO DEBE GUARDAR EMOCIÓN
  timestamp: new Date(),
};


    const updated = await chatModel.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: {
          sessionId,
          type,
          anonymous: type === "anonimo",
          userId: type === "registrado" ? userId : null,
          startedAt: new Date(),
        },
        $push: {
          messages: { $each: [userMsg, botMsg] },
        },
        $set: { endedAt: null },
      },
      { upsert: true, new: true }
    );

    return updated;

  } catch (err) {
    console.error("❌ Error almacenando turno RF11:", err);
  }

  updateEmotionalMemory().catch(() => {});
}

// ===========================================================
// 🔥 PROCESAMIENTO PRINCIPAL (RF6 + RF8 mejorado)
// ===========================================================
async function processMessage(
  message,
  type = "anonimo",
  userId = null,
  tone = "informal",
  forcedSessionId = null   // ⚡ NUEVO → viene desde frontend
) {
  const original = message || "";

  // RNF5 — anonimización previa
  const text = type === "anonimo" ? anonymizeText(original) : original;
  const lower = text.toLowerCase();

  // RF6 — Sesión anónima estable EN VEZ DE generar una nueva cada mensaje
  const sessionId =
    type === "anonimo"
      ? forcedSessionId || "anon-" + Math.random().toString(36).substring(2, 9)
      : userId;

  const ctx = getContext(sessionId);
  setContext(sessionId, { tone });
  // ⛔ BLOQUEAR RE-DETECCIÓN DE CRISIS
if (ctx.lastEmotion === "crisis") {
  const reply =
    "💛 Gracias por seguir aquí. Me alegra que sigas escribiendo.\n\n" +
    "Ahora lo más importante es que no estés sol@.\n" +
    "¿Hay alguien de confianza o un profesional con quien puedas hablar en este momento?";

  await saveTurn({
    sessionId,
    type,
    userId,
    userText: text,
    replyText: reply,
    emotion: "crisis",
  });

  return {
    reply: toneTransform[tone](reply),
    emotion: "crisis",
  };
}


  // 1️⃣ RF9 — Crisis (máxima prioridad)
  const crisisMatch = await detectCrisisAdvanced(lower);
  if (crisisMatch) {
  const reply =
    "💛 Lo que estás sintiendo es muy importante y no estás sol@.\n\n" +
    "En este momento es muy importante que no te quedes con esto en silencio.\n\n" +
    "📍 **Si estás en Colombia:**\n" +
    "• Línea 106\n" +
    "• Emergencias 123\n\n" +
    "👩‍⚕️ **Psicóloga SENA**\n" +
    "📧 yesicamarcelaibanezalvarez@gmail.com\n" +
    "📱 317 562 7844\n\n" +
    "También puedes hablar con alguien de confianza.\n\n" +
    "⚠️ Si sientes que corres peligro inmediato, por favor busca ayuda de urgencias ahora mismo.";

  await saveTurn({
    sessionId,
    type,
    userId,
    userText: text,
    replyText: reply,
    emotion: "crisis",
    confidence: 100,
  });

  await createAlert({
    phrase: crisisMatch.phrase.text,
    category: crisisMatch.phrase.category,
    severity: crisisMatch.phrase.severity,
    target: crisisMatch.phrase.target,
    sessionId,
    userType: type,
    userId: type === "registrado" ? userId : null,
    message: text,
  });

  // 🔒 BLOQUEO DE FLUJO
  setContext(sessionId, {
    lastEmotion: "crisis",
    pendingIntent: null,
  });

  return {
    reply: toneTransform[tone](reply),
    emotion: "crisis",
  };
}


    

  // 2️⃣ Técnica pendiente (RF7 + técnicas)
  if (ctx.pendingIntent === "offer_technique") {

    const isYes =
      detectAffirmative(lower) ||
      detectTechniqueRequest(lower) ||
      lower.trim() === "si" ||
      lower.trim() === "sí" ||
      lower.trim() === "claro" ||
      lower.trim() === "dale" ||
      lower.trim() === "ok" ||
      lower.trim() === "okay" ||
      lower.trim() === "vale";

    // Si usuario confirma técnica
    if (isYes) {
      const emotion = ctx.lastEmotion || "ansiedad";
      const list = techniques[emotion] || techniques.ansiedad;
      const tip = list[Math.floor(Math.random() * list.length)];

      setContext(sessionId, { pendingIntent: null });

      const finalReply = toneTransform[tone](tip);

      await saveTurn({
        sessionId,
        type,
        userId,
        userText: text,
        replyText: tip,
        emotion,
      });

      return { reply: finalReply, emotion };
    }

    // Si NO dice sí, NO analizar emoción todavía
  }

  // 2.0 BIS — Confirmación corta "sí" aunque se haya perdido pendingIntent
  if (
    (lower.trim() === "si" || lower.trim() === "sí") &&
    !ctx.pendingIntent &&
    ctx.lastEmotion
  ) {
    const emotion = ctx.lastEmotion || "ansiedad";
    const list = techniques[emotion] || techniques.ansiedad;
    const tip = list[Math.floor(Math.random() * list.length)];

    const finalReply = toneTransform[tone](tip);

    await saveTurn({
      sessionId,
      type,
      userId,
      userText: text,
      replyText: tip,
      emotion,
    });

    return { reply: finalReply, emotion };
  }

  // 2.1 Detectar si el usuario pide técnica directamente SIN que la hayas ofrecido
  if (detectTechniqueRequest(lower)) {
    const emotion = ctx.lastEmotion || "ansiedad";
    const list = techniques[emotion] || techniques.ansiedad;
    const tip = list[Math.floor(Math.random() * list.length)];

    const finalReply = toneTransform[tone](tip);

    await saveTurn({
      sessionId,
      type,
      userId,
      userText: text,
      replyText: tip,
      emotion,
    });

    return { reply: finalReply, emotion };
  }

  // 3️⃣ Respuesta positiva
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

    return { reply: finalReply, emotion };
  }

  // 4️⃣ Saludos
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

  // 5️⃣ Off-topic
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

  // 6️⃣ RF8 — detectar "mal" inmediatamente
  const genericBad = detectGenericBad(lower);
  if (genericBad) {
    const baseReply = getResponse(genericBad);
    const finalReply = toneTransform[tone](baseReply);

    await saveTurn({
      sessionId,
      type,
      userId,
      userText: text,
      replyText: baseReply,
      emotion: genericBad,
      confidence: 80,
    });

    return { reply: finalReply, emotion: genericBad };
  }

  // 7️⃣ ANÁLISIS EMOCIONAL (RF8 PRO — emociones compuestas)
  const { primary, secondary, confidence } = analyzeEmotion(text);
  const lastEmotion = ctx.lastEmotion;

  let effectiveEmotion = primary;
  let finalConfidence = confidence;

  // Si la confianza es baja → fallback clínico
  if (confidence < 60) {
    if (lastEmotion) {
      effectiveEmotion = lastEmotion;
    } else {
      const baseReply =
        secondary
          ? `🤔 Percibo señales de **${primary}** y también algo de **${secondary}**. ¿Dirías que va más hacia una de esas?`
          : `🤔 No estoy completamente segur@ de cómo te sientes. ¿Dirías que es tristeza, ansiedad, estrés, miedo o enojo?`;

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

  // Si hay secundaria → la guardamos en contexto
  if (secondary) {
    setContext(sessionId, { secondaryEmotion: secondary });
  }

  setContext(sessionId, { lastEmotion: effectiveEmotion });

  // ⚠ Confirmación emocional extra si aún hay baja confianza
  if (finalConfidence < 60) {
    const inferred = inferEmotionFromWords(lower);

    if (inferred) {
      effectiveEmotion = inferred;
      finalConfidence = 75;
    } else if (lastEmotion) {
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

  setContext(sessionId, { lastEmotion: effectiveEmotion, pendingIntent: null });

  // 8️⃣ RF7 — Respuesta empática base
  let baseReply = getResponse(effectiveEmotion);

  // 9️⃣ Ofrecer técnica
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

  // 🔟 Guardar en BD (RF11 + RNF4–5)
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
    const { message, tone, sessionId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });
    }

    // ⚡ RF6 — Pasamos el sessionId anónimo generado en frontend
    const response = await processMessage(
      message,
      "anonimo",
      null,
      tone || "informal",
      sessionId || null
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

    // ⚡ Usuarios autenticados NO usan forcedSessionId
    const response = await processMessage(
      message,
      "registrado",
      userId,
      tone || "informal",
      null
    );

    res.json(response);
  } catch (err) {
    console.error("❌ Error en handleAuthChat:", err);
    res
      .status(500)
      .json({ reply: "No se pudo procesar tu mensaje. 😔" });
  }
  }
  