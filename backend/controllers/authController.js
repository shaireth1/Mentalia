const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.registerUser = async (req, res) => {
  try {
    const { nombre, identificacion, edad, genero, programa, ficha, telefono, email, password } = req.body;

    if (!nombre || !identificacion || !email || !password)
      return res.status(400).json({ msg: "Faltan datos obligatorios" });

    const existe = await User.findOne({ email });
    if (existe) return res.status(400).json({ msg: "El correo ya está registrado" });

    const hashed = await bcrypt.hash(password, 10);

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
    res.status(500).json({ msg: "Error en el servidor", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ msg: "Contraseña incorrecta" });

    res.json({
      msg: "Inicio de sesión exitoso ✅",
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        programa: user.programa
      }
    });
  } catch (err) {
    res.status(500).json({ msg: "Error en el servidor", error: err.message });
  }
};
