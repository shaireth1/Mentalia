// backend/utils/anonymize.js
function anonymize(text = "") {
  if (typeof text !== "string") return text;

  // Reemplazar emails
  text = text.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[correo]");

  // Reemplazar números largos (posibles identificaciones / teléfonos)
  text = text.replace(/\b\d{6,}\b/g, "[número]");

  // Reemplazar teléfonos con guiones/espacios
  text = text.replace(/\b(\+?\d{1,3}[-.\s]?){1,4}\d{4,}\b/g, "[teléfono]");

  // Reemplazar nombres propios simples (opcional, heurístico)
  // Nota: no es infalible; para PII serio, usar técnicas más fuertes
  return text;
}

module.exports = anonymize;
