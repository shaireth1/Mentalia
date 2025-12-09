// backend/middleware/uploadContent.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Crear carpeta /uploads si no existe
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración del storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueName + ext);
  },
});

// Filtro actualizado — AHORA SÍ ACEPTA MP3 / AUDIO 🎧🔥
const fileFilter = (req, file, cb) => {
  const allowed = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "video/mp4",
  "application/pdf",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav"
];


  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log("❌ Archivo rechazado:", file.originalname, file.mimetype);
    cb(new Error("Tipo de archivo no permitido"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 120 * 1024 * 1024 }, // 120MB
});

// ⬅️ EXPORTAMOS LA INSTANCIA
export const uploadContent = upload;
