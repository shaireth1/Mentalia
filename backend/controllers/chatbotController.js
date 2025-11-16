// backend/controllers/chatbotController.js
import { analyzeEmotion } from "../utils/emotionAnalyzer.js";
import { getResponse } from "../utils/responseHelper.js";
import Conversation from "../models/Conversation.js";
import ChatSession from "../models/ChatSession.js";
import { updateEmotionalMemory } from "../utils/emotionalMemory.js";
import { toneTransform } from "../utils/tones.js";

// 🧠 Memoria contextual por sesión (no se guarda en BD)
const sessionContext = new Map();

// 🟣 Listas de palabras clave
const crisisKeywords = [
"suicid", "matarme", "morir", "quitarme la vida", "no quiero vivir",
"no aguanto más", "acabar con todo", "no veo salida", "no vale la pena",
"no quiero existir", "hacerme daño",
// inglés
"i want to die", "kill myself", "i want to be dead", "i can't take it anymore",
"i dont want to live", "i'm done", "i give up"
];

const positiveKeywords = [
"gracias", "mejor", "bien", "tranquil@", "tranquila",
"aliviad@", "funcionó", "me ayudó", "sirvió"
];

// 🟣 Detectores
const detectCrisis = (t = "") => crisisKeywords.some(k => t.toLowerCase().includes(k));
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
tone: "informal" // ⭐ TONO por defecto
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
"🫶 Repite: *Estoy a salvo, puedo ir a mi ritmo.*"
],
estrés: [
"😮‍💨 **Pausa consciente:** respira hondo y estira los hombros 3 veces.",
"🌿 Haz una lista de 3 cosas que hiciste hoy. Cada una cuenta.",
"💭 Bebe agua lentamente y respira. A veces lo simple ayuda."
],
tristeza: [
"💜 Escribe lo que sientes sin juzgarlo. Te puede liberar un poco.",
"🌷 Abraza algo cálido o suave para calmar el cuerpo.",
"💭 Escoge una canción tranquila y respira mientras la escuchas."
]
};

// 🟣 Respuestas positivas
const positiveReplies = [
"💜 Qué bueno que te sientes un poco mejor. Estoy contigo.",
"🌷 Cada pequeño paso cuenta. Me alegra leerte así.",
"💫 Me alegra que algo te haya servido. Estoy orgullos@ de ti.",
"💛 Gracias por compartir eso conmigo. Mereces sentirte mejor.",
"🌻 Me alegra mucho leer eso. Respira un momento y agradécete."
];


// 🧩 PROCESAMIENTO PRINCIPAL DEL MENSAJE
async function processMessage(message, type = "anonimo", userId = null) {
const lower = message.toLowerCase();

const sessionId =
type === "anonimo"
? "anon-" + Math.random().toString(36).substring(2, 9)
: userId;

const ctx = getContext(sessionId);

// 1️⃣ SI HAY TÉCNICA PENDIENTE
if (ctx.pendingIntent === "offer_technique" && detectAffirmative(lower)) {
const emotion = ctx.lastEmotion || "ansiedad";
const list = techniques[emotion] || techniques.ansiedad;
const tip = list[Math.floor(Math.random() * list.length)];

setContext(sessionId, { lastEmotion: emotion, pendingIntent: null });

return {
reply: toneTransform[ctx.tone](tip),
emotion
};
}

// 2️⃣ RESPUESTA POSITIVA
if (detectPositive(lower)) {
const reply = positiveReplies[Math.floor(Math.random() * positiveReplies.length)];

return {
reply: toneTransform[ctx.tone](reply),
emotion: ctx.lastEmotion || "neutral"
};
}

// 3️⃣ CRISIS — prioridad máxima
if (detectCrisis(lower)) {
const reply =
"💛 Es un momento muy delicado. No estás sol@. Contacta la Línea 106 (Colombia) o 141 (si eres menor de edad). También puedes acudir al servicio de urgencias más cercano.";

return { reply: toneTransform[ctx.tone](reply), emotion: "crisis" };
}

// 4️⃣ SALUDOS
if (detectGreeting(lower)) {
const options = [
"💬 ¡Hola! Qué gusto tenerte aquí. ¿Cómo te sientes hoy?",
"🌻 ¡Hola! Estoy aquí para escucharte, sin juicios.",
"💜 ¡Hola! Cuéntame cómo te sientes en este momento."
];
const reply = options[Math.floor(Math.random() * options.length)];

return { reply: toneTransform[ctx.tone](reply), emotion: "neutral" };
}

// 5️⃣ OFF-TOPIC
if (detectOffTopic(lower)) {
const reply =
"Ese tema se sale un poco de lo emocional 💭. Pero si te parece, cuéntame cómo te has sentido hoy y vemos algo práctico juntos.";

return { reply: toneTransform[ctx.tone](reply), emotion: "neutral" };
}

// 6️⃣ ANÁLISIS EMOCIONAL
const { emotion, confidence } = analyzeEmotion(message);
const lastEmotion = ctx.lastEmotion;

// 6.1 — Confianza baja (<60%) y sin historial → pedir aclaración
if (confidence < 60 && !lastEmotion) {
const reply =
"🤔 No estoy completamente segur@ de cómo te sientes. ¿Dirías que es tristeza, ansiedad, estrés, miedo o enojo?";

return { reply: toneTransform[ctx.tone](reply), emotion: "neutral" };
}

// 6.2 — Si confianza baja pero hay emoción previa → usar la última
const effectiveEmotion = confidence < 60 && lastEmotion ? lastEmotion : emotion;

setContext(sessionId, { lastEmotion: effectiveEmotion, pendingIntent: null });

// 7️⃣ RESPUESTA EMPÁTICA BASE (del JSON)
let reply = getResponse(effectiveEmotion);

// 8️⃣ OFRECER TÉCNICA (solo a veces)
if (["ansiedad", "estrés", "tristeza"].includes(effectiveEmotion)) {
if (Math.random() < 0.5) {
reply += " 💜 Si quieres, puedo compartirte una técnica breve para calmarte.";
setContext(sessionId, { lastEmotion: effectiveEmotion, pendingIntent: "offer_technique" });
}
}

// 9️⃣ GUARDAR CONVERSACIÓN EN BD
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

// 🔟 ACTUALIZAR APRENDIZAJE
updateEmotionalMemory().catch(() => {});

// 🔥 APLICAR TONO AQUÍ
return {
reply: toneTransform[ctx.tone](reply),
emotion: effectiveEmotion
};
}

// 🟣 ENDPOINTS
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