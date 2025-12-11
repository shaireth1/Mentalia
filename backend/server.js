// backend/server.js
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import path from "path";
import { fileURLToPath } from "url";

import chatbotRoutes from "./routes/chatbot.js";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/session.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import chatSessionRoutes from "./routes/chatSession.js";
import alertRoutes from "./routes/alerts.js";
import journalRoutes from "./routes/journal.js";
import psychologistRoutes from "./routes/psychologist.js";
import contentPublicRoutes from "./routes/contentPublic.js";

import { cleanInactiveSessions } from "./utils/sessionCleaner.js";

// ------------------------------------------------------
// PATH CONFIG
// ------------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ------------------------------------------------------
// EXPRESS
// ------------------------------------------------------
const app = express();

// ======================================================
// 🌐 CORS — CONFIGURACIÓN CORRECTA PARA VERCEL + RAILWAY
// ======================================================
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://mentalia-brown.vercel.app",   // tu frontend principal
      "https://mentalia-beta.vercel.app",    // si usas el beta
      "https://mentalia-production.up.railway.app" // tu backend desplegado
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight
app.options("*", cors());

// ------------------------------------------------------
// BASICS
// ------------------------------------------------------
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// STATIC UPLOADS
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ======================================================
// 🗄️ CONEXIÓN A MONGO ATLAS
// ======================================================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Conectado"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// ======================================================
// 🚏 RUTAS
// ======================================================
app.get("/", (req, res) => {
  res.send("MENTALIA Backend funcionando correctamente 🚀");
});

app.use("/api/chatbot", chatbotRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat-sessions", chatSessionRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/content", contentPublicRoutes);
app.use("/api/psychologist", psychologistRoutes);

// ======================================================
// ♻️ LIMPIEZA PERIÓDICA DE SESIONES
// ======================================================
setInterval(cleanInactiveSessions, 60 * 1000);

// ======================================================
// 🚀 SERVIDOR
// ======================================================
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`)
);
