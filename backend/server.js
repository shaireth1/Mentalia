// backend/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";

import chatbotRoutes from "./routes/chatbot.js";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/session.js";
import { cleanInactiveSessions } from "./utils/sessionCleaner.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// BD
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mentalia";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar con MongoDB:", err));

// Rutas
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);

// 🕒 LIMPIADOR AUTOMÁTICO DE SESIONES
setInterval(cleanInactiveSessions, 60 * 1000);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
