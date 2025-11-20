import sgMail from "@sendgrid/mail";

// 💜 Remitente profesional
const FROM_NAME = "MENTALIA — Plataforma de Apoyo Emocional";
const FROM_EMAIL = "mentaliachatbot@gmail.com";

export default async function sendEmail({ to, subject, html }) {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to,
      from: {
        name: FROM_NAME,
        email: FROM_EMAIL,
      },
      replyTo: FROM_EMAIL,

      subject,

      // Contenido
      html,

      // Headers para reducir SPAM
      headers: {
        "X-Priority": "1",
        "X-MSMail-Priority": "High",
        Importance: "high",
        Priority: "urgent",

        // Gmail lo ama
        "List-Unsubscribe": `<mailto:${FROM_EMAIL}>`,
      },
    };

    await sgMail.send(msg);
    console.log("📨 Correo enviado correctamente a:", to);
  } catch (error) {
    console.error("❌ Error enviando correo:", error.response?.body || error);
    throw error;
  }
}
