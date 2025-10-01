"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0f1c] to-[#1a1a2e] font-sans p-6">
      <div className="bg-white/10 shadow-xl rounded-2xl flex overflow-hidden max-w-4xl w-full">
        {/* Panel izquierdo con info */}
        <div className="hidden md:flex flex-col justify-center items-center bg-purple-50/10 p-8 w-1/2">
          <img
            src="/foto-panel-principal.jpg"
            alt="Bienestar"
            className="rounded-lg shadow-sm w-full object-cover"
          />
          <h2 className="mt-6 text-purple-300 text-xl font-semibold">
            Bienvenido a MENTALIA
          </h2>
          <p className="text-purple-200 text-center mt-2">
            Un espacio seguro y confidencial para tu bienestar emocional.
          </p>
        </div>

        {/* Panel derecho: Login */}
        <div className="flex-1 p-10">
          <h1 className="text-2xl font-bold text-white mb-6">Inicia Sesión</h1>

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Correo Electrónico</label>
              <input
                type="email"
                required
                className="mt-1 w-full border border-white/30 bg-transparent text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white">Contraseña</label>
              <input
                type="password"
                required
                className="mt-1 w-full border border-white/30 bg-transparent text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Ingresar
            </button>
          </form>

          {/* Enlace al registro */}
          <p className="text-sm text-center text-gray-300 mt-6">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-purple-400 font-medium hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

