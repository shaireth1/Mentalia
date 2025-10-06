"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2e1ff] p-6">
      {/* Botón volver */}
      <div className="w-full max-w-6xl mb-6 flex items-center">
        <Link href="/" className="flex items-center text-purple-700 font-medium">
          <ArrowLeft size={18} className="mr-2" />
          Volver
        </Link>
      </div>

      {/* Contenedor principal */}
      <div className="bg-white/80 rounded-2xl shadow-lg grid md:grid-cols-2 w-full max-w-6xl overflow-hidden">
        {/* Lado izquierdo con imagen */}
        <div className="bg-white flex flex-col justify-between">
          <Image
            src="/icono-iniciarsesion.jpg"
            alt="Bienestar emocional"
            width={600}
            height={400}
            className="w-full h-80 object-cover"
          />
          <div className="p-6">
            <h2 className="text-xl font-semibold text-purple-800 mb-2">
              Tecnología al servicio de tu bienestar
            </h2>
            <p className="text-sm text-purple-600 leading-relaxed">
              Únete a nuestra comunidad y accede a herramientas personalizadas para tu crecimiento emocional.
            </p>
          </div>
        </div>

        {/* Lado derecho: formulario */}
        <div className="p-10 flex flex-col justify-center bg-white">
          <div className="flex items-center justify-end mb-6">
            <h1 className="text-2xl font-semibold text-purple-800 mr-2">MENTALIA</h1>
            <p className="text-sm text-purple-600">SENA</p>
          </div>

          <h2 className="text-2xl font-semibold text-center text-purple-800 mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-center text-purple-600 mb-8">
            Accede a tu espacio personal de bienestar
          </p>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-800">
                Correo Electrónico *
              </label>
              <input
                type="email"
                placeholder="tu.email@sena.edu.co"
                className="w-full mt-1 p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-purple-800">
                Contraseña *
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Mínimo 8 caracteres"
                className="w-full mt-1 p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-purple-600"
              >
                <Eye size={20} />
              </button>
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
              <Link href="/register" className="text-purple-800 font-semibold hover:underline">
                Regístrate aquí
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
