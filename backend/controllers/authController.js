// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

// 🟢 Registro de usuario
export async function registerUser(req, res) {
  try {
    const { nombre, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("Error en registerUser:", error);
    res.status(500).json({ message: "Error en el registro de usuario." });
  }
}

// 🟣 Login de usuario
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Contraseña incorrecta." });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Inicio de sesión exitoso.",
      token,
      user: { id: user._id, nombre: user.nombre, email: user.email },
    });
  } catch (error) {
    console.error("Error en loginUser:", error);
    res.status(500).json({ message: "Error al iniciar sesión." });
  }
}
