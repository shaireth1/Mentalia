// utils/empathyLearner.js
const Conversation = require("../models/Conversation");
const fs = require("fs");
const path = require("path");

// Ruta del archivo JSON que contiene las respuestas base
const responsesPath = path.join(__dirname, "../data/emotional_responses.json");

async function analyzeAndAdapt() {
  try {
    const convos = await Conversation.find();
    if (convos.length === 0) return;

    const emotionStats = {};
    for (const convo of convos) {
      for (let i = 0; i < convo.messages.length; i++) {
        const msg = convo.messages[i];

        // Buscamos si el usuario respondió positivamente al mensaje anterior del bot
        if (msg.sender === "user" && i > 0 && convo.messages[i - 1].sender === "bot") {
          const prevBot = convo.messages[i - 1];
          const lower = msg.text.toLowerCase();
          const positive =
            ["gracias", "mejor", "bien", "tranquilo", "aliviado", "me ayudó", "sirvió"].some(p =>
              lower.includes(p)
            );

          if (!emotionStats[prevBot.emotion]) {
            emotionStats[prevBot.emotion] = { total: 0, positive: 0, examples: {} };
          }

          emotionStats[prevBot.emotion].total++;
          if (positive) {
            emotionStats[prevBot.emotion].positive++;
            if (!emotionStats[prevBot.emotion].examples[prevBot.text]) {
              emotionStats[prevBot.emotion].examples[prevBot.text] = 1;
            } else {
              emotionStats[prevBot.emotion].examples[prevBot.text]++;
            }
          }
        }
      }
    }

    // Cargar respuestas base
    const responses = JSON.parse(fs.readFileSync(responsesPath, "utf8"));

    // Ajustar frases según las que recibieron más respuestas positivas
    for (const emotion of Object.keys(emotionStats)) {
      const stats = emotionStats[emotion];
      const successRate = (stats.positive / stats.total) * 100;

      if (successRate > 70) {
        // Ordenar por frecuencia de agradecimientos
        const bestPhrases = Object.entries(stats.examples)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 2)
          .map((e) => e[0]);

        if (!responses[emotion]) responses[emotion] = [];
        responses[emotion].push(...bestPhrases);
      }
    }

    // Guardar respuestas mejoradas
    fs.writeFileSync(responsesPath, JSON.stringify(responses, null, 2), "utf8");

    console.log("✅ El chatbot ha aprendido nuevas respuestas empáticas 🧠💜");
  } catch (error) {
    console.error("❌ Error en aprendizaje empático:", error);
  }
}

module.exports = { analyzeAndAdapt };
