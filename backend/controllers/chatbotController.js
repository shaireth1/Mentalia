// controllers/chatbotController.js

export const handleAnonChat = (req, res) => {
  const { message } = req.body;
  const reply = generateReply(message, "anonimo");
  res.json({ reply });
};

export const handleAuthChat = (req, res) => {
  const { message } = req.body;
  const reply = generateReply(message, "autenticado");
  res.json({ reply });
};

// 🧠 Función para generar respuestas contextuales
function generateReply(message, mode) {
  const msg = message.toLowerCase();

  // Casos críticos
  if (msg.includes("suicidar") || msg.includes("morir") || msg.includes("matarme")) {
    return `⚠️ Lamento mucho que te sientas así. No estás sol@. 
Si estás en peligro o pensando en hacerte daño, por favor contacta de inmediato a la línea 123 opción 5 o acércate al centro de atención más cercano. 
Tu vida es valiosa. 💜`;
  }

  // Casos de tristeza
  if (msg.includes("triste") || msg.includes("mal") || msg.includes("solo")) {
    return "🌧️ Entiendo que estás pasando por un momento difícil. A veces hablar de lo que sientes puede aliviar un poco la carga. Estoy aquí para escucharte.";
  }

  // Casos de estrés o ansiedad
  if (msg.includes("estres") || msg.includes("ansioso") || msg.includes("angustia")) {
    return "💭 El estrés puede sentirse abrumador. Intenta hacer una pausa, respirar profundamente y centrarte en algo que te calme por un momento.";
  }

  // Saludos o inicio de conversación
  if (msg.includes("hola") || msg.includes("buenas") || msg.includes("saludo")) {
    return "💜 ¡Hola! Qué gusto verte por aquí. Este es tu espacio seguro. ¿Cómo te sientes hoy?";
  }

  // Respuesta genérica
  return `💭 Gracias por confiar en mí. Cuéntame más, te estoy escuchando.`;
}
