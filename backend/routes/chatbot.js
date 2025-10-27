// routes/chatbot.js
const express = require("express");
const router = express.Router();

router.post("/message", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim() === "") {
      return res.status(400).json({ response: "Mensaje vacío o inválido." });
    }

    const msg = message.toLowerCase();

    // 👋 Detección de saludos o despedidas
    const greetings = ["hola", "buenas", "hey", "qué tal", "ola"];
    const farewells = ["adiós", "chao", "nos vemos", "hasta luego"];

    if (greetings.some((g) => msg.includes(g))) {
      return res.json({
        response:
          "💜 ¡Hola! Me alegra saludarte. ¿Cómo te has sentido últimamente?",
        emotion: "neutral",
      });
    }

    if (farewells.some((f) => msg.includes(f))) {
      return res.json({
        response:
          "💫 Gracias por hablar conmigo. Recuerda que siempre puedes volver cuando lo necesites. 🌸",
        emotion: "neutral",
      });
    }

    // 🎭 Análisis emocional
    const empatheticResponses = {
      tristeza: [
        "Entiendo que te sientas triste 💜. Hablar de lo que pasa puede aliviar un poco el peso.",
        "Gracias por confiar en mí. No estás sol@, a veces solo necesitamos que alguien escuche.",
      ],
      estrés: [
        "Parece que estás estresad@ 😔. ¿Quieres que te comparta una técnica para relajarte?",
        "Respirar y hacer pausas puede ayudarte. Estoy aquí para acompañarte.",
      ],
      ansiedad: [
        "Siento que hay ansiedad en tus palabras 💫. No estás sol@, puedes contarme lo que te preocupa.",
        "Hablar de lo que te causa ansiedad puede ayudarte a soltar un poco. Cuéntame, ¿qué te tiene así?",
      ],
      miedo: [
        "Debe ser difícil sentir miedo 😟. Estoy aquí para escucharte sin juzgarte.",
        "A veces el miedo solo quiere protegernos, pero no tiene que controlarnos 💜.",
      ],
      enojo: [
        "Siento que hay enojo en tus palabras 😠. Está bien sentirse así, es una emoción válida.",
        "Parece que algo te molestó. ¿Quieres contarme qué pasó?",
      ],
      neutral: [
        "Te escucho con atención 💬. Puedes contarme más sobre eso.",
        "Gracias por hablar conmigo 💜. Estoy aquí para ti.",
      ],
    };

    // 💬 Detección de emociones por palabras clave
    let emotion = "neutral";
    if (msg.includes("triste") || msg.includes("mal")) emotion = "tristeza";
    else if (msg.includes("estresad") || msg.includes("agotad")) emotion = "estrés";
    else if (msg.includes("ansios") || msg.includes("preocupad")) emotion = "ansiedad";
    else if (msg.includes("miedo") || msg.includes("asustad")) emotion = "miedo";
    else if (msg.includes("enojad") || msg.includes("rabia")) emotion = "enojo";

    // ⚠️ Detección de crisis
    const crisisPhrases = [
      "me quiero morir",
      "no aguanto más",
      "quiero acabar con todo",
      "no veo salida",
      "no quiero existir",
      "no vale la pena vivir",
      "hacerme daño",
    ];

    if (crisisPhrases.some((p) => msg.includes(p))) {
      return res.json({
        response:
          "💛 Lamento mucho que te sientas así. No estás sol@. Por favor, contacta una línea de ayuda: 📞 Línea 106 (Colombia) o busca apoyo profesional cercano.",
        emotion: "crisis",
      });
    }

    // 💬 Respuesta empática
    const options = empatheticResponses[emotion];
    const randomResponse = options[Math.floor(Math.random() * options.length)];

    res.json({
      response: randomResponse,
      emotion,
    });
  } catch (err) {
    console.error("❌ Error en chatbot:", err);
    res.status(500).json({ msg: "Error interno del chatbot" });
  }
});

module.exports = router;
