// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  identificacion: { type: String, required: true },
  edad: { type: Number, required: true },
  genero: { type: String, required: true },
  programa: { type: String, required: true },
  ficha: { type: String, required: true },
  telefono: { type: String, required: true },

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  rol: { type: String, enum: ["usuario", "admin"], default: "usuario" },

  creadoEn: { type: Date, default: Date.now },

  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date }
});

export default mongoose.model("User", userSchema);
