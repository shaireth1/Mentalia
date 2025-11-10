import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RESPONSES_PATH = path.join(__dirname, "../data/emotional_responses.json");

export function getResponse(emotion, isGreeting = false, isCrisis = false) {
  try {
    const raw = fs.readFileSync(RESPONSES_PATH, "utf-8");
    const responses = JSON.parse(raw);

    if (isCrisis) {
      const crisis = responses.crisis;
      return crisis[Math.floor(Math.random() * crisis.length)];
    }

    if (isGreeting) {
      const greetings = responses.greetings;
      return greetings[Math.floor(Math.random() * greetings.length)];
    }

    const emotionSet = responses[emotion] || responses.neutral;
    return emotionSet[Math.floor(Math.random() * emotionSet.length)];
  } catch (err) {
    console.error("Error al cargar respuestas:", err);
    return "💜 Estoy aquí para escucharte, aunque algo falló con mis respuestas.";
  }
}
