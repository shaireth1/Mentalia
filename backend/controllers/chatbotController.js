// backend/controllers/chatbotController.js
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";
import { getResponse } from "../utils/responseHelper.js";
import Conversation from "../models/Conversation.js";
import ChatSession from "../models/ChatSession.js";
import { updateEmotionalMemory } from "../utils/emotionalMemory.js";

// 🧩 Memoria contextual por sesión
const sessionContext = new Map();

// 🔍 Listas clave
const crisisKeywords = [
  "suicid", "matarme", "morir", "quitarme la vida", "no quiero vivir",
  "no aguanto más", "acabar con todo", "no veo salida", "no vale la pena",
  "no quiero existir", "hacerme daño",
  // inglés
  "i want to die", "kill myself", "i want to be dead", "i can't take it anymore",
  "i dont want to live", "i'm done", "i give up"
];

const positiveKeywords = [
  "gracias", "mejor", "bien", "tranquil@", "tranquila", "aliviad@", "funcionó", "me ayudó", "sirvió"
];

// ✅ Detectores
const detectCrisis = (t = "") => crisisKeywords.some(k => t.toLowerCase().includes(k));
const detectGreeting = (t = "") => /\b(hola|buenas|hey|ey|hi|hello)\b/i.test(t);
const detectOffTopic = (t = "") => /\b(celular|precio|dinero|plata|tel[eé]fono|computador|juego|musica|video)\b/i.test(t);
const detectAffirmative = (t = "") => /\b(s[ií]|claro|dale|ok|de una|por favor)\b/i.test(t);
const detectPositive = (t = "") => positiveKeywords.some(k => t.toLowerCase().includes(k));

// ✅ Obtener/actualizar contexto
function getContext(id) {
  return sessionContext.get(id) || { lastEmotion: null, pendingIntent: null, lastReplyType: null };
}
function setContext(id, ctx) {
  sessionContext.set(id, ctx);
}

// ✅ Técnicas concretas por emoción
const techniques = {
  ansiedad: [
    "🌬️ **Técnica 4-2-6:** inhala por 4 segundos, mantén por 2 y exhala por 6. Hazlo 3 veces, sin prisa.",
    "💜 Prueba el 'anclaje sensorial': nombra 3 cosas que ves, 2 que oyes y 1 que sientes. Te traerá al presente.",
    "🫶 Siéntate cómodo, suelta los hombros, y repite: *Estoy aquí y estoy a salvo.*"
  ],
  estrés: [
    "😮‍💨 **Pausa consciente:** respira y estira los brazos 3 veces. No todo debe resolverse hoy.",
    "🌿 **Técnica 5x5:** piensa en 5 cosas que hiciste bien hoy, aunque sean pequeñas.",
    "💭 Camina 1 minuto o bebe agua conscientemente. A veces lo simple también sana."
  ],
  tristeza: [
    "💜 Escribe lo que sientes sin juzgarlo. A veces darle palabras al dolor lo aligera.",
    "🌷 Abraza una manta o algo cálido. El cuerpo también necesita contención.",
    "💭 Escucha una canción suave o dibuja algo que te calme. No importa si no es perfecto."
  ]
};

// ✅ Respuestas de refuerzo positivo
const positiveReplies = [
  "💜 Me alegra saber que te sientes un poco mejor. Cada paso, por pequeño que sea, cuenta mucho.",
  "🌷 Qué bonito leer eso. Cuidarte y reconocer cómo te sientes es un gran avance.",
  "💫 Me alegra que algo te haya servido. Estoy orgullos@ de ti por seguir hablando de lo que sientes.",
  "💛 Saber que te sientes un poco mejor me alegra mucho. Tómate este momento para respirar y agradecerte a ti mism@.",
  "🌻 Gracias por compartir eso. Estoy contigo en cada pequeño progreso."
];

// ✅ Núcleo del procesamiento
async function processMessage(message, type = "anonimo", userId = null) {
  const lower = message.toLowerCase();
  const sessionId = type === "anonimo" ? "anon-" + Math.random().toString(36).substring(2, 9) : userId;
  const ctx = getContext(sessionId);

  // 🟡 1️⃣ Responder técnica pendiente
  if (ctx.pendingIntent === "offer_technique" && detectAffirmative(lower)) {
    const emotion = ctx.lastEmotion || "ansiedad";
    const list = techniques[emotion] || techniques.ansiedad;
    const tip = list[Math.floor(Math.random() * list.length)];
    setContext(sessionId, { lastEmotion: emotion, pendingIntent: null, lastReplyType: "technique" });
    return { reply: tip, emotion };
  }

  // 💚 2️⃣ Reconocer progreso emocional
  if (detectPositive(lower)) {
    const reply = positiveReplies[Math.floor(Math.random() * positiveReplies.length)];
    setContext(sessionId, { ...ctx, pendingIntent: null, lastReplyType: "positive" });
    return { reply, emotion: ctx.lastEmotion || "neutral" };
  }

  // ⚠️ 3️⃣ Crisis prioritaria
  if (detectCrisis(lower)) {
    const reply =
      "💛 Es un momento muy delicado. No estás sol@. Contacta la Línea 106 (Colombia) o 141 (si eres menor de edad). También puedes acudir al servicio de urgencias más cercano.";
    return { reply, emotion: "crisis" };
  }

  // 💬 4️⃣ Saludos
  if (detectGreeting(lower)) {
    const greetings = [
      "💬 ¡Hola! Qué gusto tenerte aquí. ¿Cómo te sientes hoy?",
      "🌻 ¡Hola! Estoy aquí para escucharte, sin juicios.",
      "💜 ¡Hola! Cuéntame cómo te sientes en este momento."
    ];
    const reply = greetings[Math.floor(Math.random() * greetings.length)];
    return { reply, emotion: "neutral" };
  }

  // 🔹 5️⃣ Off-topic
  if (detectOffTopic(lower)) {
    const reply =
      "Ese tema se sale un poco de lo emocional 💭. Pero si te parece, cuéntame cómo te has sentido hoy y vemos algo práctico juntos.";
    return { reply, emotion: "neutral" };
  }

  // 🧠 6️⃣ Analizar emoción
  const { emotion, confidence } = analyzeEmotion(message);
  const lastEmotion = ctx.lastEmotion;

  if (confidence < 60 && !lastEmotion) {
    setContext(sessionId, { lastEmotion: "neutral", pendingIntent: null });
    return {
      reply:
        "🤔 No estoy completamente segur@ de cómo te sientes. ¿Podrías confirmarme si es tristeza, ansiedad, estrés, miedo o enojo?",
      emotion: "neutral"
    };
  }

  const effectiveEmotion = confidence < 60 && lastEmotion ? lastEmotion : emotion;
  setContext(sessionId, { lastEmotion: effectiveEmotion, pendingIntent: null });

  // 💭 7️⃣ Respuesta base empática
  let reply = getResponse(effectiveEmotion, false, false);

  // 🪷 8️⃣ Ofrecer técnica si aplica
  if (["ansiedad", "estrés", "tristeza"].includes(effectiveEmotion)) {
    if (Math.random() < 0.5) {
      reply += " 💜 Si quieres, puedo compartirte una técnica breve para calmarte.";
      setContext(sessionId, { lastEmotion: effectiveEmotion, pendingIntent: "offer_technique" });
    }
  }

  // 💬 9️⃣ Guardar conversación
  const chatModel = type === "anonimo" ? ChatSession : Conversation;
  const chat = new chatModel({
    sessionId,
    anonymous: type === "anonimo",
    userId: type === "autenticado" ? userId : null,
    messages: [
      { sender: "user", text: message, emotion: effectiveEmotion, confidence },
      { sender: "bot", text: reply, emotion: effectiveEmotion }
    ]
  });
  await chat.save();

  // 🧩 10️⃣ Actualizar memoria emocional
  await updateEmotionalMemory().catch(() => {});

  return { reply, emotion: effectiveEmotion };
}

// 🔹 Endpoints
export async function handleAnonChat(req, res) {
  try {
    const { message } = req.body;
    if (!message?.trim())
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });

    const response = await processMessage(message, "anonimo");
    res.json(response);
  } catch (err) {
    console.error("❌ Error en handleAnonChat:", err);
    res.status(500).json({ reply: "Ocurrió un error procesando tu mensaje. 😔" });
  }
}

export async function handleAuthChat(req, res) {
  try {
    const { message, userId } = req.body;
    if (!message?.trim())
      return res.status(400).json({ reply: "Por favor, escribe un mensaje." });

    const response = await processMessage(message, "autenticado", userId);
    res.json(response);
  } catch (err) {
    console.error("❌ Error en handleAuthChat:", err);
    res.status(500).json({ reply: "No se pudo procesar tu mensaje. 😔" });
  }
}
