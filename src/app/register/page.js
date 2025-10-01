"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft, Eye } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3e8ff] font-sans p-6">
      <div className="absolute top-6 left-6 flex items-center gap-2 text-purple-700 hover:underline cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Volver</span>
      </div>

      <div className="flex max-w-6xl w-full gap-6">
        {/* Panel izquierdo con imagen y texto */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-1/2 hidden md:block">
          <Image
            src="/icono-registrarse.jpg"
            alt="Bienestar"
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Tecnología al servicio de tu bienestar
            </h2>
            <p className="text-sm text-purple-500">
              Únete a nuestra comunidad y accede a herramientas personalizadas
              para tu crecimiento emocional.
            </p>
          </div>
        </div>

        {/* Panel derecho: login */}
        <div className="bg-white rounded-2xl shadow-md p-10 w-full md:w-1/2">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Heart className="w-6 h-6 text-purple-600 mr-2" />
            <div>
              <h1 className="text-xl font-bold text-purple-700 leading-none">
                MENTALIA
              </h1>
              <p className="text-xs text-gray-500">SENA</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-center text-purple-800 mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-sm text-center text-purple-500 mb-6">
            Accede a tu espacio personal de bienestar
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Correo Electrónico *
              </label>
              <input
                type="email"
                placeholder="tu.email@sena.edu.co"
                className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none pr-10"
                  required
                />
                <Eye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 w-5 h-5 text-gray-500 cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Iniciar Sesión
            </button>
          </form>

          {/* Registro */}
          <p className="text-sm text-center text-gray-600 mt-6">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-purple-600 font-medium hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>

        </div>
      </div>
    </main>
  );
}
