const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const chatbotRoutes = require("./routes/chatbot");

dotenv.config();
const app = express();

// 🔧 Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// 🔹 Rutas
app.use("/api/chatbot", chatbotRoutes);

// 🔹 Ruta raíz de prueba
app.get("/", (req, res) => {
  res.send("🚀 Mentalia Backend activo y corriendo en puerto 4000");
});

// 🔹 Servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en http://localhost:${PORT}`));
