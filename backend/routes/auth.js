import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { forgotPassword, resetPassword } from "../controllers/passwordController.js";

const router = express.Router();

// Registro
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Recuperar contraseña (envía correo)
router.post("/forgot-password", forgotPassword);

// Restablecer contraseña (cambia password)
router.post("/reset-password/:token", resetPassword);

export default router;
