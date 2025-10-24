const User = require("../models/User");
const bcrypt = require("bcrypt");
const { generarToken } = require("../utils/token"); // ⚙️ función JWT

// ✅ REGISTRO DE USUARIO
exports.registerUser = async (req, res) => {
  try {
    const {
      nombre,
      identificacion,
      edad,
      genero,
      programa,
      ficha,
      telefono,
      email,
      password,
    } = req.body;

    // Validar campos obligatorios
    if (!nombre || !identificacion || !email || !password)
      return res.status(400).json({ msg: "Faltan datos obligatorios" });

    // Verificar si el correo ya está registrado
    const existe = await User.findOne({ email });
    if (existe)
      return res.status(400).json({ msg: "El correo ya está registrado" });

    // Encriptar contraseña
    const hashed = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = new User({
      nombre,
      identificacion,
      edad,
      genero,
      programa,
      ficha,
      telefono,
      email,
      password: hashed,
    });

    await nuevoUsuario.save();
    res.status(201).json({ msg: "Usuario creado ✅" });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Error en el servidor", error: err.message });
  }
};

// ✅ LOGIN DE USUARIO (Genera token JWT)
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ msg: "Usuario no encontrado" });

    // Validar contraseña
    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ msg: "Contraseña incorrecta" });

    // Generar token con expiración de 30 minutos
    const token = generarToken(user._id);

    res.json({
      msg: "Inicio de sesión exitoso ✅",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        programa: user.programa,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ msg: "Error en el servidor", error: err.message });
  }
};

// ✅ LOGOUT DE USUARIO
exports.logoutUser = async (req, res) => {
  try {
    // En JWT el logout es manejado desde el frontend (se borra el token)
    // Aquí simplemente confirmamos la acción
    res.json({ msg: "Sesión cerrada correctamente ✅" });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Error al cerrar sesión", error: error.message });
  }
};

// ✅ VERIFICAR TOKEN (opcional para rutas protegidas)
exports.verifyToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <token>"
    if (!token)
      return res.status(401).json({ msg: "Token no proporcionado" });

    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ msg: "Token válido ✅", decoded });
  } catch (error) {
    res.status(401).json({ msg: "Token inválido o expirado" });
  }
};
const { verificarToken } = require("../utils/token");

exports.verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(400).json({ msg: "No se envió token en el header" });
    }

    // El formato correcto es "Bearer TOKEN"
    const token = authHeader.split(" ")[1];
    const decoded = verificarToken(token);

    if (!decoded) {
      return res.status(401).json({ msg: "Token inválido o expirado ❌" });
    }

    res.json({ msg: "Token válido ✅", user: decoded });
  } catch (error) {
    res.status(500).json({ msg: "Error al verificar token", error: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.json({ msg: "Sesión cerrada correctamente ✅" });
  } catch (error) {
    res.status(500).json({ msg: "Error al cerrar sesión", error: error.message });
  }
};

