// backend/utils/emotionalMemory.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { analyzeConversations } from "./chatbotLearning.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MEMORY_FILE = path.join(__dirname, "../data/emotionalMemory.json");

// 📦 Cargar memoria emocional (si existe)
export function loadMemory() {
  try {
    if (fs.existsSync(MEMORY_FILE)) {
      return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
    }
  } catch (err) {
    console.error("❌ Error cargando emotionalMemory.json:", err);
  }
  return {};
}

// 💾 Guardar memoria emocional actualizada
function saveMemory(memory) {
  try {
    fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
  } catch (err) {
    console.error("❌ Error guardando emotionalMemory.json:", err);
  }
}

// 🧠 Actualizar la memoria con nuevos patrones
export async function updateEmotionalMemory() {
  try {
    const stats = await analyzeConversations();
    const memory = loadMemory();

    for (const [emotion, data] of Object.entries(stats)) {
      const ratio = data.total ? data.positive / data.total : 0;
      if (!memory[emotion]) memory[emotion] = { score: 0 };

      // Ajuste gradual — refuerza emociones positivas
      memory[emotion].score = Math.min(1, memory[emotion].score + (ratio - 0.5) * 0.2);
    }

    saveMemory(memory);
    return memory;
  } catch (error) {
    console.error("❌ Error actualizando memoria emocional:", error);
    return {};
  }
}
