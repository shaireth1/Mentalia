const express = require("express");
const router = express.Router();

// Importar controladores
const { registerUser, loginUser } = require("../controllers/authController");
const passwordController = require("../controllers/passwordController");

// 🔹 Registro
router.post("/register", registerUser);

// 🔹 Login
router.post("/login", loginUser);

// 🔹 Recuperar contraseña (enviar correo con token)
router.post("/forgot-password", passwordController.forgotPassword);

// 🔹 Restablecer contraseña (desde el link con token)
router.post("/reset-password", passwordController.resetPassword);
router.post("/logout", authController.logoutUser);

module.exports = router;
