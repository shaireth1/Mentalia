// utils/emotionAnalyzer.js
/**
 * 🔍 Analizador emocional del chatbot MENTALIA
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

function computeConfidence(matches) {
  if (matches >= 3) return 95 + Math.random() * 5;
  if (matches === 2) return 85 + Math.random() * 10;
  if (matches === 1) return 70 + Math.random() * 10;
  return 40 + Math.random() * 15;
}

export function analyzeEmotion(text) {
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

  const confidence = computeConfidence(maxMatches);
  return { emotion: detectedEmotion, confidence: Math.round(confidence) };
}
