// backend/controllers/chatbotController.js
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";
import { getResponse } from "../utils/responseHelper.js";
import Conversation from "../models/Conversation.js";
import ChatSession from "../models/ChatSession.js";
import { updateEmotionalMemory } from "../utils/emotionalMemory.js";
import { toneTransform } from "../utils/tones.js";

// 🧠 Memoria contextual por sesión (no se guarda en BD)
const sessionContext = new Map();

/**
 * 🔎 PALABRAS CLAVE DE CRISIS
 */

// ⛔ Crisis de autolesión / suicidio (RF9)
const selfHarmKeywords = [
  // Frases explícitas del requisito
  "me quiero morir",
  "no aguanto más",
  "no aguanto mas",
  "quiero acabar con todo",
  "no veo ninguna salida",
  "ya no quiero existir",
  "no vale la pena seguir viviendo",
  "estoy pensando en hacerme daño",

  // Variantes y sinónimos
  "quiero morir",
  "quiero morirme",
  "me voy a morir",
  "me voy a matar",
  "me quiero matar",
  "quiero suicidarme",
  "voy a suicidarme",
  "suicidarme",
  "suicidio",
  "suicidar",
  "quitarme la vida",
  "quitarme mi vida",
  "no quiero vivir",
  "acabar con mi vida",
  "terminar con mi vida",
  "ya no doy más",
  "ya no doy mas",
  "no puedo más con esto",
  "no puedo mas con esto",
  "ya no puedo con la vida",
  "preferiría estar muert",
  "preferiria estar muert",
  "morir",        // intencionalmente amplio para el prototipo
  "morirme",
  "desaparecer",
];

// ⚠️ Crisis de violencia hacia OTRAS personas
const violenceKeywords = [
  "matar a alguien",
  "matar a todos",
  "matar a todo el mundo",
  "los voy a matar",
  "las voy a matar",
  "lo voy a matar",
  "la voy a matar",
  "voy a matar a",
  "voy a matarlos",
  "voy a matarlas",
  "asesinar a alguien",
  "asesinar a esa persona",
  "hacerle daño a alguien",
  "hacer daño a alguien",
  "lastimar a alguien",
  "lastimar a esa persona",
  "pegarle a alguien",
  "golpear a alguien",
  "disparar a alguien",
  "atacar a alguien",
  "hacer algo muy malo a alguien",
];

// Frases de malestar extremo pero menos explícitas
const genericCrisisKeywords = [
  "no aguanto más",
  "no aguanto mas",
  "acabar con todo",
  "no veo salida",
  "no veo ninguna salida",
  "ya no puedo más",
  "ya no puedo mas",
  "no tiene sentido seguir",
];

const positiveKeywords = [
  "gracias",
  "mejor",
  "bien",
  "tranquil@",
  "tranquila",
  "aliviad@",
  "funcionó",
  "me ayudó",
  "sirvió",
];

// Detectores básicos
const detectSelfHarmCrisis = (t = "") => {
  const text = t.toLowerCase();
  return selfHarmKeywords.some((k) => text.includes(k));
};

const detectViolenceCrisis = (t = "") => {
  const text = t.toLowerCase();
  return violenceKeywords.some((k) => text.includes(k));
};

const detectGenericCrisis = (t = "") => {
  const text = t.toLowerCase();
  return genericCrisisKeywords.some((k) => text.includes(k));
};

const detectGreeting = (t = "") =>
  /\b(hola|buenas|hey|ey|hi|hello)\b/i.test(t);

const detectOffTopic = (t = "") =>
  /\b(celular|precio|dinero|plata|tel[eé]fono|computador|juego|musica|video)\b/i.test(
    t
  );

const detectAffirmative = (t = "") =>
  /\b(s[ií]|claro|dale|ok|de una|por favor)\b/i.test(t);

const detectPositive = (t = "") =>
  positiveKeywords.some((k) => t.toLowerCase().includes(k));

// 🟣 Contexto por sesión
function getContext(id) {
  return (
    sessionContext.get(id) || {
      lastEmotion: null,
      pendingIntent: null,
      lastReplyType: null,
      tone: "informal", // ⭐ tono por defecto
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
    "🌬️ **Técnica 4-2-6:** inhala 4 segundos, mantén 2 y exhala 6. Hazlo 3 veces.",
    "💜 Prueba 3-2-1: nombra 3 cosas que ves, 2 que escuchas y 1 que sientes.",
    "🫶 Repite: *Estoy a salvo, puedo ir a mi propio ritmo.*",
  ],
  estrés: [
    "😮‍💨 **Pausa consciente:** respira hondo y estira los hombros 3 veces.",
    "🌿 Haz una lista de 3 cosas que hiciste hoy. Cada una cuenta.",
    "💭 Bebe agua lentamente y respira. A veces lo simple ayuda.",
  ],
  tristeza: [
    "💜 Escribe lo que sientes sin juzgarlo. Puede ayudarte a liberar un poco lo que llevas dentro.",
    "🌷 Abraza algo cálido o suave para calmar tu cuerpo.",
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

// 🧩 PROCESAMIENTO PRINCIPAL DEL MENSAJE
async function processMessage(
  message,
  type = "anonimo",
  userId = null,
  tone = "informal"
) {
  const lower = message.toLowerCase();
  const applyTone = toneTransform[tone] || toneTransform.informal;

  const sessionId =
    type === "anonimo"
      ? "anon-" + Math.random().toString(36).substring(2, 9)
      : userId;

  const ctx = getContext(sessionId);
  setContext(sessionId, { tone });

  /**
   * 1️⃣ MANEJO DE CRISIS (RF9 + RF10)
   *    - Se prioriza SIEMPRE sobre cualquier otra lógica.
   */

  // 🔴 Autolesión / suicidio
  if (detectSelfHarmCrisis(lower) || detectGenericCrisis(lower)) {
    const reply =
      "💛 Lo que estás expresando es muy delicado y merece atención inmediata. No estás sol@ en esto. En Colombia puedes comunicarte con la Línea 106 o, si eres menor de edad, con la Línea 141. También puedes acudir al servicio de urgencias más cercano o hablar con alguien de confianza en tu entorno.";

    return { reply: applyTone(reply), emotion: "crisis_autolesion" };
  }

  // 🟠 Violencia hacia otras personas
  if (detectViolenceCrisis(lower)) {
    const reply =
      "⚠️ Lo que comentas implica hacer daño a otra persona. No puedo apoyar ni validar ninguna forma de violencia. Es muy importante que hables con un profesional o con alguien de confianza sobre lo que estás sintiendo. Si sientes que puedes lastimar a alguien, por favor busca ayuda inmediata llamando a una línea de emergencia (por ejemplo, el 123 en Colombia) o acudiendo al servicio de urgencias más cercano.";

    return { reply: applyTone(reply), emotion: "crisis_violencia" };
  }

  /**
   * 2️⃣ INTENCIÓN PENDIENTE (técnica de regulación)
   */
  if (ctx.pendingIntent === "offer_technique" && detectAffirmative(lower)) {
    const emotion = ctx.lastEmotion || "ansiedad";
    const list = techniques[emotion] || techniques.ansiedad;
    const tip = list[Math.floor(Math.random() * list.length)];

    setContext(sessionId, { lastEmotion: emotion, pendingIntent: null });

    return {
      reply: applyTone(tip),
      emotion,
    };
  }

  /**
   * 3️⃣ RESPUESTA POSITIVA (agradecimientos, mejoría)
   */
  if (detectPositive(lower)) {
    const reply =
      positiveReplies[Math.floor(Math.random() * positiveReplies.length)];

    return {
      reply: applyTone(reply),
      emotion: ctx.lastEmotion || "neutral",
    };
  }

  /**
   * 4️⃣ SALUDOS
   */
  if (detectGreeting(lower)) {
    const options = [
      "💬 ¡Hola! Qué gusto tenerte aquí. ¿Cómo te sientes hoy?",
      "🌻 ¡Hola! Estoy aquí para escucharte, sin juicios.",
      "💜 ¡Hola! Cuéntame cómo te sientes en este momento.",
    ];
    const reply = options[Math.floor(Math.random() * options.length)];

    return { reply: applyTone(reply), emotion: "neutral" };
  }

  /**
   * 5️⃣ MENSAJES FUERA DE TEMA
   */
  if (detectOffTopic(lower)) {
    const reply =
      "Ese tema se sale un poco de lo emocional 💭. Pero si te parece, cuéntame cómo te has sentido hoy y buscamos algo que pueda ayudarte.";

    return { reply: applyTone(reply), emotion: "neutral" };
  }

  /**
   * 6️⃣ ANÁLISIS EMOCIONAL (RF8)
   */
  const { emotion, confidence } = analyzeEmotion(message);
  const lastEmotion = ctx.lastEmotion;

  // Confianza baja (<60%) y sin historial → pedir aclaración
  if (confidence < 60 && !lastEmotion) {
    const reply =
      "🤔 No estoy completamente segur@ de cómo te sientes. ¿Dirías que se parece más a tristeza, ansiedad, estrés, miedo o enojo?";

    return { reply: applyTone(reply), emotion: "neutral" };
  }

  // Si confianza baja pero hay emoción previa → usar la última
  const effectiveEmotion =
    confidence < 60 && lastEmotion ? lastEmotion : emotion;

  setContext(sessionId, { lastEmotion: effectiveEmotion, pendingIntent: null });

  // 7️⃣ RESPUESTA EMPÁTICA BASE (RF7)
  let reply = getResponse(effectiveEmotion);

  // 8️⃣ OFRECER TÉCNICA (solo a veces)
  if (["ansiedad", "estrés", "tristeza"].includes(effectiveEmotion)) {
    if (Math.random() < 0.5) {
      reply +=
        " 💜 Si quieres, puedo compartirte una técnica breve para calmarte.";
      setContext(sessionId, {
        lastEmotion: effectiveEmotion,
        pendingIntent: "offer_technique",
      });
    }
  }

  // 9️⃣ GUARDAR CONVERSACIÓN EN BD (RF11 + RNF4 + RNF5)
  const chatModel = type === "anonimo" ? ChatSession : Conversation;
  const chat = new chatModel({
    sessionId,
    anonymous: type === "anonimo",
    userId: type === "registrado" ? userId : null,
    type: type,
    messages: [
      {
        sender: "user",
        text: message,
        emotion: effectiveEmotion,
        confidence,
      },
      { sender: "bot", text: reply, emotion: effectiveEmotion },
    ],
  });

  await chat.save();
  updateEmotionalMemory().catch(() => {});

  // 🔟 Aplicar tono
  return {
    reply: applyTone(reply),
    emotion: effectiveEmotion,
  };
}

// ENDPOINTS
export async function handleAnonChat(req, res) {
  try {
    const { message, tone } = req.body;

    if (!message?.trim())
      return res
        .status(400)
        .json({ reply: "Por favor, escribe un mensaje." });

    const response = await processMessage(message, "anonimo", null, tone);
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

    if (!message?.trim())
      return res
        .status(400)
        .json({ reply: "Por favor, escribe un mensaje." });

    const response = await processMessage(
      message,
      "registrado",
      userId,
      tone
    );
    res.json(response);
  } catch (err) {
    console.error("❌ Error en handleAuthChat:", err);
    res
      .status(500)
      .json({ reply: "No se pudo procesar tu mensaje. 😔" });
  }
}
