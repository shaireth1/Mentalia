// utils/anonymize.js
// 🟣 Limpieza de datos sensibles para usuarios anónimos

export function anonymizeText(text = "") {
if (!text) return text;

let clean = text;

// 🧹 1. Correos
clean = clean.replace(
/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
"[correo]"
);

// 🧹 2. Números largos (teléfonos / documentos)
clean = clean.replace(/\b\d{7,15}\b/g, "[numero]");

// 🧹 3. Nombres comunes (lista base)
const names = [
"juan", "pedro", "maria", "jose", "ana", "luisa",
"carlos", "laura", "valentina", "andres",
"camila", "luis", "john", "mateo", "daniel"
];

names.forEach(name => {
const regex = new RegExp("\\b" + name + "\\b", "gi");
clean = clean.replace(regex, "[nombre]");
});

// 🧹 4. Direcciones (calle, cra, carrera)
clean = clean.replace(
/(calle|cra|carrera|avenida|av|cll|crr|#)\s*[0-9a-zA-Z\-]+/gi,
"[direccion]"
);

// 🧹 5. Frases identificables tipo "mi nombre es ..."
clean = clean.replace(/mi nombre es [a-zA-Záéíóúñ ]+/gi, "mi nombre es [oculto]");

return clean;
}