import crypto from "crypto";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ msg: "No existe un usuario con este correo." });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 1000 * 60 * 10; // 10 min

    await user.save();

    const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;

    const html = `
      <h2>Recuperación de contraseña</h2>
      <p>Haz clic en el enlace para restablecer tu contraseña:</p>
      <a href="${resetUrl}" 
        style="background:#7c3aed;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;">
        Restablecer contraseña
      </a>
      <p>Este enlace es válido solo por 10 minutos.</p>
    `;

    await sendEmail({
      to: email,
      subject: "Recuperación de contraseña - MENTALIA",
      html,
    });

    return res.json({ msg: "Correo enviado. Revisa tu bandeja de entrada." });

  } catch (error) {
    console.error("Error en forgotPassword:", error);
    return res.status(500).json({ msg: "Error enviando el correo." });
  }
}


export async function resetPassword(req, res) {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ msg: "Token inválido o expirado." });

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ msg: "La contraseña debe tener al menos 8 caracteres." });
    }

    user.password = newPassword; // tu hash middleware lo cifra
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return res.json({ msg: "Contraseña actualizada correctamente." });

  } catch (error) {
    console.error("Error en resetPassword:", error);
    return res.status(500).json({ msg: "Error al restablecer la contraseña." });
  }
}
