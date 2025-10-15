// backend/utils/sendEmail.js
require("dotenv").config();
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendResetEmail(to, token, nombre) {
  const resetUrl = `http://localhost:3000/reset-password/${token}`;

  const msg = {
    to,
    from: process.env.FROM_EMAIL, // remitente desde .env
    subject: "Recuperación de contraseña - MENTALIA 💜",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Hola ${nombre},</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña en <strong>MENTALIA</strong>.</p>
        <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
        <a href="${resetUrl}"
           style="background-color:#6A1B9A;color:white;padding:10px 20px;
           text-decoration:none;border-radius:6px;display:inline-block;">
           Restablecer Contraseña
        </a>
        <p>Si no solicitaste este cambio, puedes ignorar este mensaje.</p>
        <p>💜 Equipo de MENTALIA</p>
      </div>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log("📨 Correo enviado con éxito a:", to);
    return true;
  } catch (err) {
    console.error("❌ Error al enviar correo:", err.response?.body || err);
    throw err;
  }
}

module.exports = { sendResetEmail };
