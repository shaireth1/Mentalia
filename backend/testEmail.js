// backend/testEmail.js
require("dotenv").config();
const { sendResetEmail } = require("./utils/sendEmail");

(async () => {
  try {
    await sendResetEmail("lujaeguer19@gmail.com", "token-de-prueba", "Lily");
    console.log("✅ Test OK - correo enviado con éxito");
  } catch (error) {
    console.error("❌ Test falló:", error);
  }
})();
