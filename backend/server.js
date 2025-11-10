// server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";

// Rutas
import chatbotRoutes from "./routes/chatbot.js";
import authRoutes from "./routes/auth.js";

dotenv.config();

const app = express();

// 🧠 Middlewares globales
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 📦 Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mentalia";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar con MongoDB:", err));

// 🔹 Rutas principales
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/auth", authRoutes);

// 🔹 Puerto de ejecución
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
