import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sendEmail } from "../utils/sendEmail.js";


export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado ❌" });

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExp = Date.now() + 3600000;
    await user.save();

    const resetLink = `http://localhost:3000/reset-password/${token}`;

    await sendEmail({
      to: user.email,
      subject: "Recuperación de contraseña - Mentalia",
      html: `
        <h3>Hola ${user.nombre}</h3>
        <p>Haz clic aquí para restablecer tu contraseña:</p>
        <a href="${resetLink}" target="_blank">Restablecer contraseña</a>
      `
    });

    return res.json({ msg: "Correo enviado correctamente ✔️" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
}

export async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ msg: "Token inválido o expirado ❌" });

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.resetToken = undefined;
    user.resetTokenExp = undefined;
    await user.save();

    return res.json({ msg: "Contraseña restablecida correctamente ✔️" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error al restablecer contraseña" });
  }
}
