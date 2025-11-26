// backend/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";   // ⭐ IMPORTANTE

import chatbotRoutes from "./routes/chatbot.js";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/session.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import chatSessionRoutes from "./routes/chatSession.js";
import alertRoutes from "./routes/alerts.js";

import { cleanInactiveSessions } from "./utils/sessionCleaner.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true          // ⭐ PERMITE ENVIAR COOKIES
}));

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());      // ⭐ AGREGA LAS COOKIES A req.cookies

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
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat-sessions", chatSessionRoutes);
app.use("/api/alerts", alertRoutes);

// Cleaner
setInterval(cleanInactiveSessions, 60 * 1000);

// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor corriendo en http://0.0.0.0:${PORT}`);
});
