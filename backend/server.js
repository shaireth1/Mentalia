import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import chatbotRoutes from "./routes/chatbot.js";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/session.js";
import adminRoutes from "./routes/admin.js";
import userRoutes from "./routes/user.js";
import chatSessionRoutes from "./routes/chatSession.js";
import alertRoutes from "./routes/alerts.js";
import journalRoutes from "./routes/journal.js";

import { cleanInactiveSessions } from "./utils/sessionCleaner.js";
import { checkDailyCriticalAlerts } from "./controllers/alertController.js";

dotenv.config();

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// BD
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mentalia";
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error MongoDB:", err));

// Rutas
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat-sessions", chatSessionRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/journal", journalRoutes);

// Limpieza de sesiones
setInterval(cleanInactiveSessions, 60 * 1000);

// Revisar alertas críticas cada minuto (RF19 + RF24)
setInterval(() => {
  checkDailyCriticalAlerts();
}, 60 * 1000);

// Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Servidor en http://0.0.0.0:${PORT}`);
});
