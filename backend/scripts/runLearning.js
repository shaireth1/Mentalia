// scripts/runLearning.js
require("dotenv").config();
const mongoose = require("mongoose");
const { analyzeAndAdapt } = require("../utils/empathyLearner");

async function run() {
  try {
    // 🔗 Conexión manual a MongoDB
    await mongoose.connect("mongodb://127.0.0.1:27017/mentalia");
    console.log("✅ Conectado a MongoDB");

    // Ejecutar aprendizaje empático
    await analyzeAndAdapt();

    console.log("✅ Proceso de aprendizaje completado con éxito");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al ejecutar el aprendizaje:", error);
    process.exit(1);
  }
}

run();
