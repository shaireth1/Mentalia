import fs from "fs";
import path from "path";
import { analyzeConversations } from "./chatbotLearning.js";

const MEMORY_FILE = path.join(process.cwd(), "backend/data/emotionalMemory.json");

export function loadMemory() {
  if (fs.existsSync(MEMORY_FILE)) {
    return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
  }
  return {};
}

export function saveMemory(memory) {
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

export async function updateEmotionalMemory() {
  const stats = await analyzeConversations();
  const memory = loadMemory();

  for (const [emotion, data] of Object.entries(stats)) {
    const ratio = data.total ? data.positive / data.total : 0;
    if (!memory[emotion]) memory[emotion] = { score: 0 };
    memory[emotion].score = Math.min(1, Math.max(0, memory[emotion].score + (ratio - 0.5) * 0.2));
  }

  saveMemory(memory);
  return memory;
}
