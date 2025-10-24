// routes/chatbot.js
const express = require("express");
const router = express.Router();

router.post("/message", (req, res) => {
  console.log("📩 Datos recibidos del chatbot:", req.body);

  // Detectar el texto del mensaje en diferentes formatos posibles
  const message =
    req.body.message ||
    req.body.text ||
    req.body.user_input ||
    req.body.data?.message ||
    req.body.data?.text;

  if (!message) {
    return res.status(400).json({ msg: "Mensaje inválido" });
  }

  // Frases empáticas base (RF7)
  const respuestas = [
    "Entiendo cómo te sientes 💜",
    "Estoy aquí para escucharte 💬",
    "Lo que estás viviendo es importante 💭",
    "Gracias por compartir cómo te sientes 💫",
    "Sé que esto es difícil, pero no estás sol@ 🌱",
  ];

  const respuesta =
    respuestas[Math.floor(Math.random() * respuestas.length)];

  res.json({ reply: respuesta });
});

module.exports = router;
