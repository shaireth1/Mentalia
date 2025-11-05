// utils/emotionalMemory.js
const fs = require("fs");
const path = require("path");
const { analyzeConversations } = require("./chatbotLearning");

const MEMORY_FILE = path.join(__dirname, "../data/emotionalMemory.json");

// 📦 Cargar memoria emocional (si existe)
function loadMemory() {
  if (fs.existsSync(MEMORY_FILE)) {
    return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
  }
  return {};
}

// 💾 Guardar memoria emocional actualizada
function saveMemory(memory) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

// 🧠 Actualizar la memoria con nuevos patrones
async function updateEmotionalMemory() {
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
}

module.exports = { updateEmotionalMemory, loadMemory };
