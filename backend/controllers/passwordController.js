// controllers/passwordController.js
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { sendEmail } = require("../utils/sendEmail"); // 👈 OJO: usa destructuring si exportas así

// 📩 Paso 1: Generar token y enviar correo de recuperación
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // 1️⃣ Verificar si el correo existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Usuario no encontrado ❌" });
    }

    // 2️⃣ Generar token único
    const token = crypto.randomBytes(32).toString("hex");

    // 3️⃣ Guardar token y expiración (1 hora)
    user.resetToken = token;
    user.resetTokenExp = Date.now() + 3600000;
    await user.save();

    // 4️⃣ Crear link (ajusta dominio si el frontend se despliega)
    const resetLink = `http://localhost:3000/reset-password/${token}`;

    // 5️⃣ Enviar correo
    await sendEmail({
      to: user.email,
      subject: "Recuperación de contraseña - Mentalia 💚",
      html: `
        <h2>Hola ${user.nombre},</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="${resetLink}" target="_blank" style="color:#6B21A8;">Restablecer contraseña</a>
        <p>Si tú no solicitaste esto, puedes ignorar este mensaje.</p>
        <p>Este enlace expirará en 1 hora.</p>
      `,
    });

    return res.json({ msg: "Correo de recuperación enviado con éxito ✅" });
  } catch (error) {
    console.error("❌ Error en forgotPassword:", error);
    return res.status(500).json({ msg: "Error en el servidor", error: error.message });
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

    // 2️⃣ Encriptar y guardar nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    return res.json({ msg: "Contraseña restablecida correctamente ✅" });
  } catch (error) {
    console.error("❌ Error en resetPassword:", error);
    return res.status(500).json({ msg: "Error al restablecer contraseña", error: error.message });
  }
};
