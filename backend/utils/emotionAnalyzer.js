// backend/utils/emotionAnalyzer.js
// 🔥 Analizador emocional PRO para MENTALIA
// - Muchos sinónimos y expresiones coloquiales
// - Frases completas y palabras sueltas
// - Devuelve { emotion, confidence } con valores 0–100

const emotionLexicon = {
  tristeza: {
    phrases: [
      "estoy triste",
      "me siento triste",
      "ando triste",
      "siento mucha tristeza",
      "me siento vacío",
      "me siento vacio",
      "me siento sola",
      "me siento solo",
      "me siento muy sola",
      "me siento muy solo",
      "no tengo ganas de nada",
      "no tengo ganas de hacer nada",
      "no quiero hacer nada",
      "no encuentro sentido",
      "no le encuentro sentido a nada",
      "estoy bajoneada",
      "estoy bajoneado",
      "ando bajoneada",
      "ando bajoneado",
      "me siento mal emocionalmente",
      "me siento muy mal",
      "estoy muy mal",
      "ando mal",
      "ando maluca",
      "me siento vacío por dentro",
      "me siento vacio por dentro",
      "tengo el ánimo por el piso",
      "tengo el animo por el piso"
    ],
    words: [
      "triste",
      "tristeza",
      "depre",
      "deprimido",
      "deprimida",
      "llorar",
      "llorando",
      "llanto",
      "nostalgia",
      "melancolía",
      "melancolia",
      "vacío",
      "vacio",
      "solo",
      "sola",
      "desanimado",
      "desanimada",
      "apagado",
      "apagada",
      "bajon",
      "bajón",
      "derrotado",
      "derrotada",
      "cansado de todo",
      "cansada de todo"
    ]
  },

  ansiedad: {
    phrases: [
      "tengo ansiedad",
      "me dio ansiedad",
      "me siento ansioso",
      "me siento ansiosa",
      "no puedo parar de pensar",
      "no dejo de pensar",
      "tengo muchos pensamientos",
      "no logro calmarme",
      "me cuesta respirar",
      "siento que me ahogo",
      "siento que me falta el aire",
      "todo me pone nervios@",
      "estoy muy nervioso",
      "estoy muy nerviosa",
      "me siento inquieto",
      "me siento inquieta",
      "siento que algo malo va a pasar",
      "tengo miedo a que algo pase",
      "tengo un nudo en el estómago",
      "tengo un nudo en el estomago",
      "siento el pecho apretado",
      "no puedo dormir de la ansiedad"
    ],
    words: [
      "ansiedad",
      "ansioso",
      "ansiosa",
      "nervioso",
      "nerviosa",
      "inquieto",
      "inquieta",
      "preocupado",
      "preocupada",
      "taquicardia",
      "acelerado",
      "acelerada",
      "angustia",
      "angustiado",
      "angustiada",
      "estresado",
      "estresada",
      "tenso",
      "tensa",
      "saturado",
      "saturada"
    ]
  },

  "estrés": {
    phrases: [
      "estoy muy estresado",
      "estoy muy estresada",
      "ando estresado",
      "ando estresada",
      "tengo demasiado trabajo",
      "tengo muchas cosas encima",
      "siento mucha presión",
      "me siento agobiado",
      "me siento agobiada",
      "estoy saturado",
      "estoy saturada",
      "siento que no llego a todo",
      "me siento colapsado",
      "me siento colapsada",
      "estoy colapsando",
      "tengo la cabeza llena",
      "no doy más",
      "no doy mas"
    ],
    words: [
      "estrés",
      "estres",
      "estresado",
      "estresada",
      "presión",
      "presion",
      "presionado",
      "presionada",
      "agobiado",
      "agobiada",
      "agotado",
      "agotada",
      "quemado",
      "burnout",
      "colapsado",
      "colapsada"
    ]
  },

  miedo: {
    phrases: [
      "tengo miedo",
      "tengo mucho miedo",
      "me da miedo",
      "me da mucho miedo",
      "me aterra",
      "me asusta",
      "me siento inseguro",
      "me siento insegura",
      "siento que algo malo va a pasar",
      "me preocupa demasiado",
      "me preocupa mucho",
      "tengo pánico",
      "siento pánico",
      "me da terror",
      "tengo terror"
    ],
    words: [
      "miedo",
      "temor",
      "temores",
      "asustado",
      "asustada",
      "pánico",
      "panico",
      "terror",
      "angustia",
      "inseguro",
      "insegura",
      "preocupación",
      "preocupacion",
      "nervios",
      "nerviosismo"
    ]
  },

  enojo: {
    phrases: [
      "estoy muy enojado",
      "estoy muy enojada",
      "estoy lleno de rabia",
      "estoy llena de rabia",
      "estoy que exploto",
      "estoy que reviento",
      "me da mucha rabia",
      "me tiene harto",
      "me tiene harta",
      "no soporto esto",
      "no aguanto más esto",
      "estoy muy molesto",
      "estoy muy molesta",
      "me siento frustrado",
      "me siento frustrada"
    ],
    words: [
      "enojo",
      "enojado",
      "enojada",
      "rabia",
      "ira",
      "furia",
      "frustración",
      "frustracion",
      "frustrado",
      "frustrada",
      "molesto",
      "molesta",
      "fastidio",
      "me irrita",
      "me molesta"
    ]
  }
};

// 🔢 Convierte coincidencias en nivel de confianza
function computeConfidence(score) {
  if (score >= 6) return 96 + Math.random() * 4;      // 96–100
  if (score >= 4) return 88 + Math.random() * 7;      // 88–95
  if (score >= 2) return 78 + Math.random() * 7;      // 78–85
  if (score === 1) return 65 + Math.random() * 10;    // 65–75
  return 40 + Math.random() * 15;                     // 40–55 (muy baja)
}

/**
 * Analiza el texto y devuelve la emoción principal + confianza.
 * @param {string} text
 * @returns {{emotion: string, confidence: number}}
 */
export function analyzeEmotion(text = "") {
  const lower = text.toLowerCase();
  let bestEmotion = "neutral";
  let bestScore = 0;

  for (const [emotion, data] of Object.entries(emotionLexicon)) {
    let score = 0;

    // Coincidencias por frases (más peso)
    for (const phrase of data.phrases) {
      if (lower.includes(phrase)) score += 2;
    }

    // Coincidencias por palabras sueltas
    for (const word of data.words) {
      if (lower.includes(word)) score += 1;
    }

    if (score > bestScore) {
      bestScore = score;
      bestEmotion = emotion;
    }
  }

  const confidence = computeConfidence(bestScore);
  return {
    emotion: bestEmotion,
    confidence: Math.round(confidence)
  };
}
