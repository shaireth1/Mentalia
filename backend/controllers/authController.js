// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/Session.js";
import sendEmail from "../utils/sendEmail.js";

const FRONTEND_URL =
  process.env.FRONTEND_URL || "http://localhost:3000";

// ✅ Validación estricta de dominios de correo permitidos
const emailRegex =
  /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com|yahoo\.com|sena\.edu\.co)$/;

// ✅ Validación fuerte de contraseña (académica)
const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/;

// =======================================================
// 🟢 REGISTRO DE USUARIO (RF1, RF4, RF5, RNF1, RNF10)
// =======================================================
export async function registerUser(req, res) {
  try {
    const {
      nombre,
      identificacion,
      edad,
      genero,
      programa,
      ficha,
      telefono,
      email,
      password,
      consentimientoDatos,
    } = req.body;

    // 🔒 Campos obligatorios
    if (
      !nombre ||
      !identificacion ||
      !edad ||
      !genero ||
      !programa ||
      !ficha ||
      !telefono ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        msg: "Todos los campos son obligatorios.",
      });
    }

    // 🔒 Consentimiento obligatorio (RNF10)
    if (!consentimientoDatos) {
      return res.status(400).json({
        msg: "Debes aceptar el consentimiento informado.",
      });
    }

    // 🔒 Validación de correo (dominio válido)
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        msg: "El correo no tiene un dominio válido.",
      });
    }

    // 🔒 Validación fuerte de contraseña
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        msg:
          "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número.",
      });
    }

    // 🔒 Verificar duplicado REAL (case-insensitive)
    const normalizedEmail = email.toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        msg: "El correo ya está registrado.",
      });
    }

    // 🔐 Hash seguro
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      identificacion,
      edad,
      genero,
      programa,
      ficha,
      telefono,
      email: normalizedEmail,
      password: hashedPassword,

      // Consentimiento (RNF10)
      consentimientoDatos: true,
      consentimientoFecha: new Date(),
      consentimientoVersion: "1.0",
    });

    await newUser.save();

    // 📩 Correo de bienvenida
    const html = `
      <div style="font-family: Arial, sans-serif; background: #f6f4fb; padding: 20px; border-radius: 10px;">
        <h2 style="color: #7c3aed;">💜 Bienvenido/a a MENTALIA, ${nombre}</h2>

        <p>
          Tu cuenta ha sido creada exitosamente. MENTALIA es un espacio seguro,
          confidencial y disponible 24/7 para tu bienestar emocional.
        </p>

        <ul>
          <li>🧠 Chatbot emocional</li>
          <li>📘 Diario emocional</li>
          <li>⚠️ Detección de crisis</li>
          <li>📊 Seguimiento de bienestar</li>
        </ul>

        <div style="text-align:center; margin-top:20px;">
          <a href="${FRONTEND_URL}/login"
            style="background:#7c3aed;color:white;padding:12px 20px;border-radius:8px;text-decoration:none;">
            Iniciar sesión
          </a>
        </div>

        <p style="margin-top:20px;font-size:12px;color:#777;text-align:center;">
          MENTALIA – Plataforma de apoyo emocional SENA
        </p>
      </div>
    `;

    await sendEmail({
      to: normalizedEmail,
      subject: "Bienvenido/a a MENTALIA 💜",
      html,
    });

    return res.status(201).json({
      msg: "Usuario registrado correctamente.",
    });

  } catch (error) {
    console.error("❌ Error en registerUser:", error);
    return res.status(500).json({
      msg: "Error en el registro.",
    });
  }
}

// =======================================================
// 🔐 LOGIN DE USUARIO (RF6)
// =======================================================
export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        msg: "Correo y contraseña son obligatorios.",
      });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        msg: "Credenciales incorrectas.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Credenciales incorrectas.",
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const newSession = new Session({
      userId: user._id,
      token,
      userAgent: req.headers["user-agent"] || "",
      ip: req.ip || "",
      isActive: true,
      lastActivity: new Date(),
      createdAt: new Date(),
    });

    await newSession.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: "Inicio de sesión exitoso.",
      token,
      sessionId: newSession.sessionId,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        programa: user.programa,
        rol: user.rol,
        tone: user.tone,
        consentimientoDatos: user.consentimientoDatos,
      },
    });

  } catch (error) {
    console.error("❌ Error en loginUser:", error);
    return res.status(500).json({
      msg: "Error al iniciar sesión.",
    });
  }
}

// =======================================================
// 🔐 LOGOUT
// =======================================================
export function logoutUser(req, res) {
  res.clearCookie("token");
  return res.json({
    msg: "Sesión cerrada correctamente.",
  });
}
