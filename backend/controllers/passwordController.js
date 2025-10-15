const User = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// 📩 Solicitar recuperación de contraseña
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ msg: "El correo es obligatorio" });

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Generar token único
    const token = crypto.randomBytes(32).toString("hex");

    // Guardar token y expiración (1 hora)
    user.resetToken = token;
    user.resetTokenExp = Date.now() + 3600000; // 1 hora
    await user.save();

    // Configurar transporte de correo
    const transporter = nodemailer.createTransport({
      service: "gmail", // puedes cambiar a outlook o smtp personalizado
      auth: {
        user: "tu_correo@gmail.com", // ⚠️ cámbialo por uno real
        pass: "tu_contraseña_o_app_password", // ⚠️ app password si usas Gmail
      },
    });

    // Contenido del correo
    const mailOptions = {
      from: "MENTALIA 💜 <tu_correo@gmail.com>",
      to: user.email,
      subject: "Recuperación de contraseña",
      html: `
        <h2>Hola ${user.nombre}</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña en <b>MENTALIA</b>.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <a href="http://localhost:3000/reset-password/${token}">Restablecer contraseña</a>
        <p>Este enlace expira en 1 hora.</p>
      `,
    };

    // Enviar correo
    await transporter.sendMail(mailOptions);

    res.json({ msg: "Correo de recuperación enviado ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al enviar el correo", error: err.message });
  }
};
