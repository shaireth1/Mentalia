import sgMail from "@sendgrid/mail";

export default async function sendEmail({ to, subject, html }) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to,
      from: process.env.FROM_EMAIL, 
      subject,
      html,
    };

    await sgMail.send(msg);
    console.log("📨 Correo enviado correctamente a:", to);
  } catch (error) {
    console.error("❌ Error enviando correo:", error);
    throw error;
  }
}
