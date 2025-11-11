// backend/utils/responseHelper.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { loadMemory } from "./emotionalMemory.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESPONSES_PATH = path.join(__dirname, "../data/emotional_responses.json");

// 💬 Devuelve una respuesta adaptada según emoción y nivel de confianza
export function getResponse(emotion, isGreeting = false, isCrisis = false) {
  try {
    const raw = fs.readFileSync(RESPONSES_PATH, "utf-8");
    const responses = JSON.parse(raw);
    const memory = loadMemory();

    // 🧠 Cargar “score” emocional (aprendizaje previo)
    const emotionScore = memory[emotion]?.score ?? 0.5; // 0.5 = neutro
    const mood =
      emotionScore > 0.7
        ? "optimista"
        : emotionScore < 0.3
        ? "cauteloso"
        : "equilibrado";

    // 🪵 LOGS de verificación
    console.log("🧩 MENTALIA >> Generando respuesta adaptada");
    console.log("   → emoción detectada:", emotion);
    console.log("   → score aprendido:", emotionScore.toFixed(2));
    console.log("   → tono aplicado:", mood);

    // 💛 Casos especiales
    if (isCrisis) {
      const crisisSet = responses.crisis || [];
      const reply = crisisSet[Math.floor(Math.random() * crisisSet.length)];
      console.log("   ⚠️ Crisis detectada → usando respuesta de seguridad");
      return `${reply}\n💡 Recuerda: tu seguridad es lo más importante.`;
    }

    if (isGreeting) {
      const greetSet = responses.greetings || [];
      const reply = greetSet[Math.floor(Math.random() * greetSet.length)];
      console.log("   👋 Saludo detectado → usando respuesta de bienvenida");
      return `${reply}`;
    }

    // 🎭 Selección adaptativa según emoción + tono aprendido
    const emotionSet = responses[emotion] || responses.neutral || [];
    if (emotionSet.length === 0) {
      console.log("   ⚠️ No hay respuestas disponibles para esta emoción");
      return "💜 Estoy aquí para escucharte.";
    }

    const baseReply =
      emotionSet[Math.floor(Math.random() * emotionSet.length)];

    // ✨ Ajustar el tono según “score” emocional
    let modifier = "";
    switch (mood) {
      case "optimista":
        modifier =
          "🌈 Me alegra que sigas compartiendo. Poco a poco estás avanzando. 💪";
        break;
      case "cauteloso":
        modifier =
          "💭 Tómate tu tiempo, estoy aquí para acompañarte sin presionarte.";
        break;
      default:
        modifier = "💜 Te escucho con atención. Estoy aquí contigo.";
    }

    console.log("   ✅ Respuesta generada con tono:", mood);
    console.log("--------------------------------------------------");

    return `${baseReply} ${modifier}`;
  } catch (err) {
    console.error("❌ Error al generar respuesta adaptada:", err);
    return "💜 Estoy aquí para escucharte, aunque algo falló con mis recuerdos.";
  }
}
