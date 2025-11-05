// server.js
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");

const authRoutes = require("./routes/auth");
const chatbotRoutes = require("./routes/chatbot");

const app = express();
app.use(express.json());
app.use(cors());

// 🧠 Sesiones para usuarios anónimos
app.use(
  session({
    secret: "mentalia_sesion_temporal_2025",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 30 * 60 * 1000 }, // 30 minutos
  })
);

// 🧩 Conectar a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/mentalia", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error conectando a MongoDB:", err));

// 🚪 Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/chatbot", chatbotRoutes);

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});
