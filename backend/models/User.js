const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  identificacion: { type: String, required: true, unique: true },
  edad: { type: Number, required: true },
  genero: { type: String, required: true },
  programa: { type: String, required: true },
  ficha: { type: String, required: true },
  telefono: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetToken: { type: String }, // 🔹 token para recuperación
  resetTokenExpira: { type: Date } // 🔹 tiempo de expiración
});

module.exports = mongoose.model("User", userSchema);
