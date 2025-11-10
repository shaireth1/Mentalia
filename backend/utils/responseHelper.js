// backend/utils/responseHelper.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const RESPONSES_PATH = path.join(__dirname, "../data/emotional_responses.json");
const EMPATHETIC_PATH = path.join(__dirname, "../data/empatheticPhrases.json");

// 🧠 Función para leer un archivo JSON de forma segura
function loadJSON(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn(`⚠️ No se pudo leer ${filePath}:`, err.message);
  }
  return {};
}

// 🧩 Obtener respuesta según emoción, saludo o crisis
export function getResponse(emotion, isGreeting = false, isCrisis = false) {
  try {
    const responses = loadJSON(RESPONSES_PATH);
    const empathic = loadJSON(EMPATHETIC_PATH);

    let baseResponse = "";

    if (isCrisis) {
      const crisis = responses.crisis || [];
      baseResponse =
        crisis[Math.floor(Math.random() * crisis.length)] ||
        "⚠️ No estás sol@. Busca ayuda inmediata si te sientes en peligro.";
    } else if (isGreeting) {
      const greetings = responses.greetings || [];
      baseResponse =
        greetings[Math.floor(Math.random() * greetings.length)] ||
        "💜 Hola, estoy aquí para acompañarte.";
    } else {
      const emotionSet = responses[emotion] || responses.neutral || [];
      baseResponse =
        emotionSet[Math.floor(Math.random() * emotionSet.length)] ||
        "💬 Cuéntame más sobre cómo te sientes.";
    }

    // 💬 Combinar con frase empática (si existe)
    const empathicSet = empathic.general || [];
    const extra =
      empathicSet.length > 0
        ? " " +
          empathicSet[Math.floor(Math.random() * empathicSet.length)]
        : "";

    return baseResponse + extra;
  } catch (err) {
    console.error("❌ Error al generar respuesta:", err);
    return "💜 Estoy aquí para escucharte, aunque algo falló con mis respuestas.";
  }
}
