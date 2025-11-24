// backend/utils/emotionAnalyzer.js
// 🔥 Analizador emocional PRO con emociones compuestas
// Devuelve { primary, secondary, confidence, scores }

const emotionLexicon = {
  tristeza: {
    phrases: [
      "estoy triste","me siento triste","ando triste","siento mucha tristeza",
      "no tengo ganas de nada","no quiero hacer nada","no encuentro sentido",
      "estoy bajoneada","estoy bajoneado","me siento muy mal","ando mal",
      "tengo el ánimo por el piso"
    ],
    words: [
      "triste","tristeza","depre","deprimido","deprimida","llorar","llorando",
      "nostalgia","melancolia","solo","sola","apagado","apagada"
    ]
  },

  ansiedad: {
    phrases: [
      "tengo ansiedad","me dio ansiedad","me siento ansioso","no puedo parar de pensar",
      "me cuesta respirar","siento que me ahogo","siento que me falta el aire",
      "estoy muy nervioso","estoy muy nerviosa","me siento inquieto",
      "siento que algo malo va a pasar"
    ],
    words: [
      "ansiedad","ansioso","ansiosa","nervioso","nerviosa","taquicardia",
      "angustia","inquieto","inquieta"
    ]
  },

  estrés: {
    phrases: [
      "estoy muy estresado","estoy muy estresada","ando estresado",
      "tengo demasiado trabajo","siento mucha presión","estoy saturado",
      "no doy más","me siento colapsado"
    ],
    words: [
      "estrés","estres","estresado","estresada","presión","agobiado",
      "agobiada","agotado","agotada","quemado","colapsado"
    ]
  },

  miedo: {
    phrases: [
      "tengo miedo","tengo mucho miedo","me da miedo","me aterra","me asusta",
      "me siento inseguro","me siento insegura","me preocupa demasiado"
    ],
    words: [
      "miedo","temor","asustado","asustada","pánico","panico",
      "inseguro","insegura","terror"
    ]
  },

  enojo: {
    phrases: [
      "estoy muy enojado","estoy muy enojada","estoy lleno de rabia",
      "estoy que exploto","me da mucha rabia","me tiene harto",
      "no soporto esto","estoy muy molesto"
    ],
    words: [
      "enojo","enojado","enojada","rabia","ira","furia","frustración",
      "frustrado","frustrada","molesto","molesta"
    ]
  }
};


// 🔢 Ponderador mejorado
function computeConfidence(score) {
  if (score >= 10) return 98;
  if (score >= 7) return 93;
  if (score >= 5) return 85;
  if (score >= 3) return 72;
  if (score >= 1) return 60;
  return 45; // baja confianza
}


/**
 * Nuevo analizador con emociones compuestas (RF8 PRO)
 * Retorna:
 * {
 *   primary: "ansiedad",
 *   secondary: "tristeza",
 *   confidence: 92,
 *   scores: { ansiedad: 7, tristeza: 4, estrés: 1, miedo: 0, enojo: 0 }
 * }
 */
export function analyzeEmotion(text = "") {
  const lower = text.toLowerCase();
  const scores = {
    tristeza: 0,
    ansiedad: 0,
    estrés: 0,
    miedo: 0,
    enojo: 0,
  };

  // 🔍 Calcular score por emoción
  for (const [emotion, data] of Object.entries(emotionLexicon)) {
    // Frases largas → peso 3
    for (const phrase of data.phrases) {
      if (lower.includes(phrase)) scores[emotion] += 3;
    }

    // Palabras → peso 1
    for (const word of data.words) {
      if (lower.includes(word)) scores[emotion] += 1;
    }
  }

  // Ordenar emociones por puntuación
  const ordered = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map((e) => ({ emotion: e[0], score: e[1] }));

  const primary = ordered[0];
  const secondary = ordered[1];

  // Si ninguna emoción tiene score → neutral
  if (primary.score === 0) {
    return {
      primary: "neutral",
      secondary: null,
      confidence: 40,
      scores
    };
  }

  return {
    primary: primary.emotion,
    secondary: secondary.score >= 2 ? secondary.emotion : null,
    confidence: computeConfidence(primary.score),
    scores
  };
}
