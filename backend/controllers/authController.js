// backend/controllers/authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Session from "../models/Session.js";
import sendEmail from "../utils/sendEmail.js";

// 🟢 Registro de usuario (RF1, RF4, RF5, RNF1)
export async function registerUser(req, res) {
  try {
    console.log("🔍 BODY REGISTRO:", req.body);

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
    } = req.body;

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

    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: "La contraseña debe tener al menos 8 caracteres." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "El correo ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombre,
      identificacion,
      edad,
      genero,
      programa,
      ficha,
      telefono,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // HTML Anti-SPAM + profesional
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #6a1b9a;">Bienvenido/a a MENTALIA, ${nombre}</h2>

        <p>
          ¡Gracias por registrarte en nuestra plataforma de apoyo emocional!
          Tu cuenta ha sido creada exitosamente y ya puedes acceder a herramientas,
          recursos y acompañamiento cuando lo necesites.
        </p>

        <p>
          Puedes iniciar sesión desde el siguiente enlace:<br>
          <a href="https://mentalialogin.com" 
             style="color:#6a1b9a; font-weight:bold;">
             Acceder a MENTALIA
          </a>
        </p>

        <p>
          MENTALIA es un proyecto académico diseñado para ayudarte a gestionar tus emociones,
          registrar tu estado de ánimo y recibir orientación confiable.
        </p>

        <hr style="margin: 30px 0;">

        <p style="font-size: 12px; color: #777;">
          Estás recibiendo este mensaje porque te registraste con el correo 
          <strong>${email}</strong>.<br>
          Si no realizaste esta acción, puedes ignorar este mensaje.
          Este correo fue generado automáticamente por MENTALIA — Plataforma de Apoyo Emocional.
        </p>
      </div>
    `;

    await sendEmail({
      to: email,
      subject: "Bienvenido a MENTALIA — Registro exitoso",
      html,
    });

    return res.status(201).json({ msg: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("Error en registerUser:", error);
    return res.status(500).json({
      msg: "Error en el registro.",
      error: error.message,
    });
  }
}

// 🔐 Login de usuario (RF6)
export async function loginUser(req, res) {
  try {
    console.log("🔍 BODY LOGIN:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ msg: "Correo y contraseña son obligatorios." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        msg: "El usuario no existe o las credenciales son incorrectas.",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ msg: "Credenciales incorrectas." });
    }

    // Crear token JWT (🔥 aquí añadimos rol)
    const token = jwt.sign(
      { id: user._id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Guardar sesión
    const newSession = new Session({
      userId: user._id,
      createdAt: new Date(),
    });
    await newSession.save();

    return res.status(200).json({
      msg: "Inicio de sesión exitoso.",
      token,
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        programa: user.programa,
        rol: user.rol, // 🔥 añadido para redirecciones
      },
    });
  } catch (error) {
    console.error("Error en loginUser:", error);
    return res.status(500).json({
      msg: "Error al iniciar sesión.",
      error: error.message,
    });
  }
}
