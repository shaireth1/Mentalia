"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, ArrowLeft, Heart } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#f2e1ff] p-8">
      {/* Encabezado superior */}
      <div className="w-full max-w-7xl mb-8 flex items-center justify-between">
        {/* Botón volver */}
        <Link
          href="/"
          className="flex items-center text-purple-700 font-medium hover:text-purple-900 transition"
        >
          <ArrowLeft size={18} className="mr-2" />
          Volver
        </Link>

        {/* Logo: corazón outline + MENTALIA (más delgado) + SENA debajo */}
        <div className="flex items-center">
          {/* corazón outline: sin fill */}
          <Heart className="w-7 h-7 text-purple-700" />
          <div className="flex flex-col items-start ml-3">
            {/* MENTALIA menos grueso (font-medium) y con tracking para parecer más "delgado" */}
            <span className="text-2xl font-medium tracking-wide text-purple-700">
              MENTALIA
            </span>
            {/* SENA debajo, más pequeño */}
            <span className="text-xs text-purple-500 -mt-1">SENA</span>
          </div>
        </div>
      </div>

      {/* Contenedor principal: más ancho (max-w-7xl) y paneles más altos */}
      <div className="bg-white/90 rounded-2xl shadow-2xl grid md:grid-cols-2 w-full max-w-7xl overflow-hidden">
        {/* Lado izquierdo con imagen (altura mayor) */}
        <div className="min-h-[540px] flex flex-col justify-between bg-white">
          <div className="w-full h-full overflow-hidden">
            <Image
              src="/icono-iniciarsesion.jpg"
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

        {/* Lado derecho: formulario (misma altura que imagen) */}
        <div className="p-12 flex flex-col justify-center bg-white min-h-[540px]">
          <h2 className="text-2xl font-medium text-center text-purple-800 mb-2">
            Iniciar Sesión
          </h2>
          <p className="text-center text-purple-600 mb-6">
            Accede a tu espacio personal de bienestar
          </p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              // aquí va tu manejador de login
            }}
          >
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
                aria-label="Mostrar contraseña"
                className="absolute right-3 top-9 text-purple-600 hover:text-purple-800"
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

