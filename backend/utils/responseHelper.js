// backend/utils/responseHelper.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESPONSES_PATH = path.join(__dirname, "../data/emotional_responses.json");

/**
 * Devuelve una respuesta empática basada en la emoción detectada
 * @param {string} emotion - emoción detectada
 * @param {boolean} isGreeting - si el mensaje es un saludo
 * @param {boolean} isCrisis - si se detecta crisis
 * @param {string} tone - formal | informal
 */
export function getResponse(emotion, isGreeting = false, isCrisis = false, tone = "informal") {
  try {
    const raw = fs.readFileSync(RESPONSES_PATH, "utf-8");
    const responses = JSON.parse(raw);

    // ⚠️ Crisis emocional detectada
    if (isCrisis) {
      const crisisSet = responses.crisis;
      return crisisSet[Math.floor(Math.random() * crisisSet.length)];
    }

    // 👋 Saludo inicial
    if (isGreeting) {
      const greetSet = responses.greetings;
      return greetSet[Math.floor(Math.random() * greetSet.length)];
    }

    // 🎭 Seleccionar emoción correspondiente
    const emotionSet = responses[emotion] || responses.neutral;
    let reply = emotionSet[Math.floor(Math.random() * emotionSet.length)];

    // 🎙️ Ajustar tono de respuesta
    if (tone === "formal") {
      reply = reply
        .replace("💜", "🤍")
        .replace("🌷", "🌼")
        .replace("😊", "")
        .replace("🌧️", "💭")
        .replace("Estoy aquí", "Me encuentro disponible para escucharle");
    } else if (tone === "informal") {
      reply += " 😊";
    }

    return reply;
  } catch (err) {
    console.error("Error al cargar respuestas:", err);
    return "💜 Estoy aquí para escucharte, aunque algo falló con mis respuestas.";
  }
}
