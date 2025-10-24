"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, ArrowLeft, Heart } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Simulación sin base de datos
  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;

    // Credenciales simuladas
    const fakeUser = {
      email: "usuario@mentalia.com",
      password: "123456",
      nombre: "Usuario Mentalia",
    };

    // Validación local
    if (email === fakeUser.email && password === fakeUser.password) {
      // Simula datos guardados
      localStorage.setItem("token", "fake_token_123");
      localStorage.setItem("user", JSON.stringify(fakeUser));

      alert("✅ Sesión iniciada con éxito (simulada)");
      console.log("Usuario:", fakeUser);

      // Redirige a la vista del usuario autenticado
      window.location.href = "/panel-usuario-autenticado";
    } else {
      alert("❌ Correo o contraseña incorrectos (simulado)");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#f2e1ff] p-8">
      <div className="w-full max-w-7xl mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center text-purple-700 font-medium hover:text-purple-900 transition"
        >
          <ArrowLeft size={18} className="mr-2" />
          Volver
        </Link>

        <div className="flex items-center">
          <Heart className="w-7 h-7 text-purple-700" />
          <div className="flex flex-col items-start ml-3">
            <span className="text-2xl font-medium tracking-wide text-purple-700">
              MENTALIA
            </span>
            <span className="text-xs text-purple-500 -mt-1">SENA</span>
          </div>
        </div>
      </div>

      <div className="bg-white/90 rounded-2xl shadow-2xl grid md:grid-cols-2 w-full max-w-7xl overflow-hidden">
        <div className="min-h-[540px] flex flex-col justify-between bg-white">
          <div className="w-full h-full overflow-hidden">
            <Image
              src="/icono-registrarse.jpg"
              alt="Bienestar emocional"
              width={1400}
              height={900}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">
              Tecnología al servicio de tu bienestar
            </h2>
            <p className="text-sm text-purple-600 leading-relaxed">
              Únete a nuestra comunidad y accede a herramientas personalizadas
              para tu crecimiento emocional.
            </p>
          </div>
        </div>

        <div className="p-12 flex flex-col justify-center bg-white min-h-[540px]">
          <h2 className="text-2xl font-medium text-center text-purple-800 mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-center text-purple-600 mb-6">
            Accede a tu espacio personal de bienestar
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-800">
                Correo Electrónico *
              </label>
              <input
                name="email"
                type="email"
                placeholder="usuario@mentalia.com"
                className="w-full mt-1 p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={handleChange}
                required
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-purple-800">
                Contraseña *
              </label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="123456"
                className="w-full mt-1 p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Mostrar contraseña"
                className="absolute right-3 top-9 text-purple-600 hover:text-purple-800"
              >
                <Eye size={20} />
              </button>
            </div>
            <div className="text-right text-sm mt-1">
              <Link
                href="/forgot-password"
                className="text-purple-700 hover:text-purple-900 font-medium hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 transition-all"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            <p className="text-purple-600">
              ¿No tienes cuenta?{" "}
              <Link
                href="/register"
                className="text-purple-800 font-semibold hover:underline"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

