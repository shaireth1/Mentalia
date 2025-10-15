const express = require("express");
const router = express.Router();

// Controladores
const { registerUser, loginUser } = require("../controllers/authController");
const passwordController = require("../controllers/passwordController");

// Rutas principales de autenticación
router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔹 Recuperar contraseña (nuevo)
router.post("/forgot-password", passwordController.forgotPassword);

module.exports = router;
