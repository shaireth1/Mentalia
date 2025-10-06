const express = require("express");
const router = express.Router();
const User = require("../models/User");

// Registro
router.post("/register", async (req, res) => {
  try {
    const { nombre, identificacion, edad, genero, programa, ficha, telefono, email, password } = req.body;

    if (!nombre || !identificacion || !email || !password) {
      return res.status(400).json({ msg: "Faltan datos obligatorios" });
    }

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ msg: "El correo ya está registrado" });

    const nuevoUsuario = new User({ nombre, identificacion, edad, genero, programa, ficha, telefono, email, password });
    await nuevoUsuario.save();

    res.status(201).json({ msg: "Usuario creado ✅" });
  } catch (err) {
    res.status(500).json({ msg: "Error en el servidor", error: err.message });
  }
});
// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos obligatorios
    if (!email || !password) {
      return res.status(400).json({ msg: "Faltan datos de inicio de sesión" });
    }

    // Buscar usuario por email
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Validar contraseña
    if (usuario.password !== password) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    // Si todo está correcto
    res.status(200).json({
      msg: "Inicio de sesión exitoso ✅",
      user: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        programa: usuario.programa,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor", error: err.message });
  }
});


module.exports = router;