// utils/sendEmail.js
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(to, subject, html) {
  const msg = {
    to,
    from: "mentaliachatbot@gmail.com", // 💌 usa tu correo verificado en SendGrid
    subject,
    html,
  };

  try {
    await sgMail.send(msg);
    console.log(`📨 Correo enviado con éxito a: ${to}`);
  } catch (error) {
    console.error("❌ Error al enviar correo:", error.response?.body || error);
    throw new Error("Fallo en el envío del correo");
  }
}

// 👇 ESTA LÍNEA ES LA IMPORTANTE
module.exports = sendEmail;
