// controllers/passwordController.js
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail"); // asegúrate que este archivo existe y exporta correctamente la función

// 📩 Paso 1: Generar token y enviar correo de recuperación
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Verificar si el correo existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // 2️⃣ Generar token único
    const token = crypto.randomBytes(32).toString("hex");

    // 3️⃣ Guardar token y expiración en el usuario
    user.resetToken = token;
    user.resetTokenExp = Date.now() + 3600000; // 1 hora
    await user.save();

    // 4️⃣ Crear link de recuperación (ajusta la URL del frontend si es necesario)
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // 5️⃣ Enviar correo
    await sendEmail(
      user.email,
      "Recuperación de contraseña - Mentalia 💚",
      `
      <h2>Hola ${user.nombre},</h2>
      <p>Recibimos una solicitud para restablecer tu contraseña.</p>
      <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
      <a href="${resetLink}" target="_blank" style="color:#4CAF50;">Restablecer contraseña</a>
      <p>Si tú no solicitaste esto, puedes ignorar este mensaje.</p>
      <p>Este enlace expirará en 1 hora.</p>
      `
    );

    res.json({ msg: "Correo de recuperación enviado con éxito ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor", error: error.message });
  }
};

// 🔐 Paso 2: Restablecer la contraseña con el token
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // 1️⃣ Buscar usuario con ese token y que no haya expirado
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ msg: "Token inválido o expirado ❌" });
    }

    // 2️⃣ Encriptar la nueva contraseña
    const hashed = await bcrypt.hash(password, 10);

    // 3️⃣ Actualizar usuario
    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    res.json({ msg: "Contraseña restablecida correctamente ✅" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el servidor", error: error.message });
  }
};
