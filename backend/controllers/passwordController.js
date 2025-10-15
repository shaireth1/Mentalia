const User = require("../models/User");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    // Crear token único
    const token = crypto.randomBytes(32).toString("hex");
    user.resetToken = token;
    user.resetTokenExp = Date.now() + 3600000; // 1 hora
    await user.save();

    // Crear link de recuperación
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // Contenido del correo
    const html = `
      <h2>Recuperación de contraseña - MENTALIA 💜</h2>
      <p>Hola ${user.nombre},</p>
      <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
      <a href="${resetLink}" target="_blank">Restablecer Contraseña</a>
      <p>Este enlace expirará en 1 hora.</p>
    `;

    await sendEmail(user.email, "Recupera tu contraseña - MENTALIA", html);

    res.json({ msg: "Correo de recuperación enviado con éxito ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error en el servidor", error: err.message });
  }
};
