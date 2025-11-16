// utils/tones.js
// 🎚️ Conversión de tono formal / informal para respuestas del chatbot

export const toneTransform = {
// 🤝 Informal → tal cual lo escribiste en emotional_responses.json
informal: (text) => text,

// 🧑‍⚕️ Formal → neutral, sin emojis y sin diminutivos
formal: (text) => {
if (!text) return text;

let out = text;

// Quitar emojis
out = out.replace(
/[\u{1F300}-\u{1FAFF}]/gu,
""
);

// Frases suavizadas
out = out
.replace(/estoy aquí contigo/gi, "estoy aquí para apoyarte")
.replace(/estoy contigo/gi, "estoy para acompañarte")
.replace(/si quieres/gi, "si lo deseas");

// Quitar dobles espacios
out = out.replace(/\s{2,}/g, " ");

return out.trim();
}
};