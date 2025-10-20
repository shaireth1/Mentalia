// server.js
require("dotenv").config();
console.log("✅ SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();
app.use(express.json());
app.use(cors());

// Conectar a Mongo
mongoose.connect("mongodb://127.0.0.1:27017/mentalia")
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch(err => console.error("❌ Error:", err));

// Rutas
app.use("/api/auth", authRoutes);

app.listen(4000, () => console.log("🚀 Backend corriendo en http://localhost:4000"));