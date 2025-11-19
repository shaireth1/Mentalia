// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/Session.js";

// 🟢 Registro de usuario (RF1, RF4, RNF1)
export async function registerUser(req, res) {
  try {
    console.log("🔍 BODY REGISTRO:", req.body);

    const {
      nombre,
      identificacion,
      edad,
      genero,
      programa,
      ficha,
      telefono,
      email,     // 👈 MUY IMPORTANTE
      password,
    } = req.body;

    // Validación básica de campos obligatorios
    if (!nombre || !identificacion || !edad || !genero || !programa || !ficha || !telefono || !email || !password) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios." });
    }

    // RNF1: longitud mínima de contraseña
    if (password.length < 8) {
      return res.status(400).json({ msg: "La contraseña debe tener al menos 8 caracteres." });
    }

    // RF4 - correo único
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "El correo ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      identificacion,
      edad,
      genero,
      programa,
      ficha,
      telefono,
      email,              // 👈 AQUÍ usamos el mismo email
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({ msg: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("Error en registerUser:", error);
    return res.status(500).json({
      msg: "Error en el registro.",
      error: error.message,
    });
  }
}

// 🟣 Login (RF3, RNF2)
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado." });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ msg: "Contraseña incorrecta." });

    // RNF2: token con duración de 30 minutos
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "30m" }
    );

    // Crear sesión (RF3)
    await Session.create({
      userId: user._id,
      token,
      userAgent: req.headers["user-agent"],
      ip: req.ip,
      lastActivity: new Date(),
    });

    return res.json({
      msg: "Inicio de sesión exitoso.",
      token,
      user: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error en loginUser:", error);
    return res.status(500).json({ msg: "Error al procesar el inicio de sesión." });
  }
}
