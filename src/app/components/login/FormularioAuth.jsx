// components/FormularioAuth.jsx
"use client";
import Link from "next/link";

export default function FormularioAuth({ tipo }) {
  const esLogin = tipo === "login";

  return (
    <div className="bg-white rounded-2xl shadow-md p-10 w-full md:w-1/2">
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-xl font-bold text-purple-700 leading-none">MENTALIA</h1>
        <p className="text-xs text-gray-500 ml-2">SENA</p>
      </div>

      <h2 className="text-xl font-semibold text-center text-purple-800 mb-2">
        {esLogin ? "Iniciar Sesión" : "Crear cuenta"}
      </h2>
      <p className="text-sm text-center text-purple-500 mb-6">
        {esLogin
          ? "Accede a tu espacio personal de bienestar"
          : "Regístrate para acceder a tu espacio de bienestar"}
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
          <input
            type="password"
            placeholder="Mínimo 8 caracteres"
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          {esLogin ? "Iniciar Sesión" : "Registrarse"}
        </button>
      </form>

      <p className="text-sm text-center text-gray-600 mt-6">
        {esLogin ? (
          <>
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="text-purple-600 font-medium hover:underline">
              Regístrate aquí
            </Link>
          </>
        ) : (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-purple-600 font-medium hover:underline">
              Inicia Sesión
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
