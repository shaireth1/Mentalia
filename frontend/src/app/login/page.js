"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.msg || "Credenciales incorrectas");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.rol === "admin") {
        router.push("/panel-psicologa");
        return;
      }

      router.push("/panel-usuario-autenticado");

    } catch (err) {
      console.error(err);
      setError("No se pudo conectar con el servidor");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2e1ff] px-4 sm:px-8 py-6 sm:py-10 flex flex-col">

      {/* HEADER RESPONSIVO */}
      <div className="w-full max-w-7xl mx-auto mb-6 sm:mb-8 flex items-center justify-between">

        {/* VOLVER */}
        <Link
          href="/"
          className="flex items-center text-purple-700 font-medium hover:text-purple-900 transition text-sm sm:text-base"
        >
          <ArrowLeft size={18} className="mr-2" />
          Volver
        </Link>

        {/* LOGO + TEXTO */}
        <div className="flex items-center">
          <img 
            src="/logomentalia.png.png"
            alt="Logo Mentalia"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
          />
          <div className="flex flex-col items-start ml-2 sm:ml-3 leading-tight">
            <span className="text-lg sm:text-2xl font-medium tracking-wide text-purple-700">
              MENTALIA
            </span>
            <span className="text-xs text-purple-500 -mt-1 hidden sm:block">
              SENA
            </span>
          </div>
        </div>
      </div>

      {/* CONTENEDOR RESPONSIVO */}
      <div className="flex flex-1 items-center justify-center">

        <div className="bg-white/90 rounded-2xl shadow-2xl w-full max-w-7xl overflow-hidden
                        grid grid-cols-1 md:grid-cols-2">

          {/* IMAGEN — MOBILE ARRIBA, PC IZQUIERDA */}
          <div className="min-h-[260px] md:min-h-[540px] bg-white">
            <img
              src="/icono-registrarse.jpg"
              className="w-full h-full object-cover"
              alt="Login visual"
            />
          </div>

          {/* FORMULARIO */}
          <div className="p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
            <h2 className="text-xl sm:text-2xl font-medium text-center text-purple-800 mb-6">
              Iniciar Sesión
            </h2>

            {error && (
              <p className="text-center text-sm text-red-500 mb-4">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* CORREO */}
              <div>
                <label className="block text-sm font-medium text-purple-800">
                  Correo Electrónico *
                </label>
                <input
                  name="email"
                  type="email"
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-3 border border-purple-300 rounded-lg text-sm"
                />
              </div>

              {/* CONTRASEÑA */}
              <div className="relative">
                <label className="block text-sm font-medium text-purple-800">
                  Contraseña *
                </label>

                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-3 border border-purple-300 rounded-lg text-sm"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-purple-600"
                >
                  <Eye size={20} />
                </button>
              </div>

              {/* OLVIDAR CONTRASEÑA */}
              <div className="text-right text-xs sm:text-sm">
                <Link
                  href="/forgot-password"
                  className="text-purple-700 hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-purple-700 text-white py-3 rounded-lg font-semibold hover:bg-purple-800 text-sm sm:text-base"
              >
                Iniciar Sesión
              </button>
            </form>

            <div className="text-center mt-6 text-sm">
              <p className="text-purple-600">
                ¿No tienes cuenta?{" "}
                <Link
                  href="/register"
                  className="text-purple-800 hover:underline"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}