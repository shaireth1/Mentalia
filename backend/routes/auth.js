const express = require("express");
const router = express.Router();

// 🔹 Importar controladores
const authController = require("../controllers/authController");
const passwordController = require("../controllers/passwordController");

// 🔹 Registro
router.post("/register", authController.registerUser);

// 🔹 Login
router.post("/login", authController.loginUser);

// 🔹 Recuperar contraseña (enviar correo con token)
router.post("/forgot-password", passwordController.forgotPassword);

// 🔹 Restablecer contraseña (desde el link con token)
router.post("/reset-password", passwordController.resetPassword);

// 🔹 Logout
router.post("/logout", authController.logoutUser);

module.exports = router;
