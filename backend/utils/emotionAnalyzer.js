// utils/emotionAnalyzer.js
/**
 * 🔍 Analizador emocional del chatbot MENTALIA
 * -----------------------------------------------------
 * Este módulo implementa un modelo ligero de PLN que:
 *  - Analiza texto en español.
 *  - Detecta emociones básicas (tristeza, estrés, ansiedad, miedo, enojo, neutral).
 *  - Calcula un nivel de confianza entre 0 y 100.
 *  - Es extensible a futuro para incluir embeddings o IA avanzada.
 * -----------------------------------------------------
 * Cumple con RF8: reconocimiento emocional básico en español
 */

const emotionKeywords = {
  tristeza: [
    "triste", "solo", "sola", "llorar", "llanto", "vacío",
    "pena", "deprimido", "deprimida", "sin ganas", "melancolía",
    "dolor", "nostalgia", "extraño", "perdí", "falleció", "muerte"
  ],
  ansiedad: [
    "ansioso", "ansiosa", "nervioso", "nerviosa", "inquieto", "preocupado",
    "preocupada", "temblando", "acelerado", "tensión", "intranquilo",
    "estresado", "estresada", "presión", "saturado"
  ],
  miedo: [
    "miedo", "temor", "pánico", "asustado", "asustada", "inseguro",
    "inseguridad", "terror", "preocupación", "aterrorizado", "nervios"
  ],
  enojo: [
    "enojado", "enojada", "furioso", "molesto", "rabia", "ira",
    "odio", "enojo", "fastidio", "colera", "me irrita", "me cae mal"
  ],
  estrés: [
    "estresado", "estresada", "cansado", "cansada", "agotado",
    "saturado", "presión", "rendirme", "bloqueado", "agobiado"
  ],
};

/**
 * 🔢 Simula la confianza del modelo (85–100% si hay coincidencia clara)
 *  y (40–70%) si la emoción no está claramente definida.
 */
function computeConfidence(matches) {
  if (matches >= 3) return 95 + Math.random() * 5;
  if (matches === 2) return 85 + Math.random() * 10;
  if (matches === 1) return 70 + Math.random() * 10;
  return 40 + Math.random() * 15;
}

/**
 * 🧠 Analiza el mensaje del usuario
 * @param {string} text - Texto ingresado por el usuario
 * @returns {{ emotion: string, confidence: number }}
 */
function analyzeEmotion(text) {
  const lower = text.toLowerCase();
  let detectedEmotion = "neutral";
  let maxMatches = 0;

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const matches = keywords.filter(word => lower.includes(word)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      detectedEmotion = emotion;
    }
  }

  // Calcular confianza
  const confidence = computeConfidence(maxMatches);

  return { emotion: detectedEmotion, confidence: Math.round(confidence) };
}

module.exports = { analyzeEmotion };
