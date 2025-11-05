// server.js
require("dotenv").config();
console.log("✅ SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const chatbotRoutes = require("./routes/chatbot");

const app = express();

// 🧠 Middlewares globales
app.use(express.json());
app.use(cors());

// 🕒 Configurar sesiones temporales (para usuarios anónimos)
app.use(session({
  secret: "mentalia_sesion_temporal_2025",
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 60 * 1000 } // 30 minutos
}));

// 🌐 Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/mentalia")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error al conectar con MongoDB:", err));

// 🧭 Rutas del backend
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);

const { analyzeAndAdapt } = require("./utils/empathyLearner");

// 🕒 Ejecutar cada 6 horas (aprendizaje periódico)
setInterval(() => {
  console.log("🤖 Analizando conversaciones para aprendizaje empático...");
  analyzeAndAdapt();
}, 6 * 60 * 60 * 1000);

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
