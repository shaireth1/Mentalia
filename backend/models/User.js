const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  identificacion: { type: String, required: true, unique: true },
  edad: Number,
  genero: String,
  programa: String,
  ficha: String,
  telefono: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);