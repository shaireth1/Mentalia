// 📁 backend/controllers/chatbotController.js
const empatheticResponses = [
  "Entiendo cómo te sientes.",
  "Estoy aquí para escucharte.",
  "Lo que estás viviendo es importante.",
  "Gracias por compartir cómo te estás sintiendo.",
  "Sé que esto es difícil y tu reacción es válida, pero no estás sol@."
];

exports.getResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ msg: "Mensaje inválido" });
    }

    // Simulamos un pequeño procesamiento (tiempo de respuesta < 2s)
    const randomResponse =
      empatheticResponses[Math.floor(Math.random() * empatheticResponses.length)];

    res.status(200).json({
      userMessage: message,
      botResponse: randomResponse,
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({ msg: "Error en el chatbot", error: error.message });
  }
};
