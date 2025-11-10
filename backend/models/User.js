// backend/models/User.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, enum: ["usuario", "admin"], default: "usuario" },
  creadoEn: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("contraseña")) return next();
  const salt = await bcrypt.genSalt(10);
  this.contraseña = await bcrypt.hash(this.contraseña, salt);
  next();
});

const User = mongoose.model("User", userSchema);
export default User;
