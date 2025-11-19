"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ArrowLeft, Heart } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Credenciales incorrectas");
        return;
      }

      // ✔ token real
      localStorage.setItem("token", data.token);

      // ✔ user real, con ID real de MongoDB
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✔ Redirección real
      window.location.href = "/panel-usuario-autenticado";

    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#f2e1ff] p-8">

      {/* HEADER */}
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

      {/* LOGIN FORM */}
      <div className="bg-white/90 rounded-2xl shadow-2xl grid md:grid-cols-2 w-full max-w-7xl overflow-hidden">

        {/* Imagen izquierda */}
        <div className="min-h-[540px] flex flex-col justify-between bg-white">
          <img
            src="/icono-registrarse.jpg"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Formulario */}
        <div className="p-12 flex flex-col justify-center bg-white min-h-[540px]">

          <h2 className="text-2xl font-medium text-center text-purple-800 mb-6">
            Iniciar Sesión
          </h2>

          {error && (
            <p className="text-center text-sm text-red-500 mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-purple-800">
                Correo Electrónico *
              </label>
              <input
                name="email"
                type="email"
                className="w-full mt-1 p-3 border border-purple-300 rounded-lg"
                onChange={handleChange}
                required
              />
            </div>

            {/* Contraseña */}
            <div className="relative">
              <label className="block text-sm font-medium text-purple-800">
                Contraseña *
              </label>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 p-3 border border-purple-300 rounded-lg"
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-purple-600"
              >
                <Eye size={20} />
              </button>
            </div>

            {/* Recuperar contraseña */}
            <div className="text-right text-sm">
              <Link
                href="/forgot-password"
                className="text-purple-700 hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {/* Botón */}
            <button
              type="submit"
              className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800"
            >
              Iniciar Sesión
            </button>
          </form>

          <div className="text-center mt-6 text-sm">
            <p className="text-purple-600">
              ¿No tienes cuenta?{" "}
              <Link href="/register" className="text-purple-800 hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
