// utils/sendEmail.js
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail({ to, subject, html }) {
  const msg = {
    to,
    from: "mentaliachatbot@gmail.com", // 👈 tu correo verificado en SendGrid
    subject,
    html,
  };

  await sgMail.send(msg);
  console.log("📨 Correo enviado a:", to);
}

module.exports = { sendEmail };
