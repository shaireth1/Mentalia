// utils/responseHelper.js
const fs = require("fs");
const path = require("path");

// Ruta del archivo JSON
const RESPONSES_PATH = path.join(__dirname, "../data/emotional_responses.json");

// Cargar frases empáticas
function loadResponses() {
  const raw = fs.readFileSync(RESPONSES_PATH, "utf-8");
  return JSON.parse(raw);
}

// Obtener respuesta según emoción o tipo de mensaje
function getResponse(emotion, isGreeting = false, isCrisis = false) {
  const responses = loadResponses();

  if (isCrisis) {
    const crisisSet = responses.crisis;
    return crisisSet[Math.floor(Math.random() * crisisSet.length)];
  }

  if (isGreeting) {
    const greetSet = responses.greetings;
    return greetSet[Math.floor(Math.random() * greetSet.length)];
  }

  const emotionSet = responses[emotion] || responses.neutral;
  return emotionSet[Math.floor(Math.random() * emotionSet.length)];
}

module.exports = { getResponse };
