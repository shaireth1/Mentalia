"use client";

import { useRouter } from "next/navigation";

export default function PsicologaPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-white text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md shadow-md p-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">Mentalia — Psicóloga</h1>
        <nav className="space-x-6 text-indigo-700 font-medium">
          <button onClick={() => router.push("/psicologa/ajustes")} className="hover:text-indigo-500 transition">Ajustes</button>
          <button onClick={() => router.push("/")} className="hover:text-indigo-500 transition">Cerrar sesión</button>
        </nav>
      </header>

      {/* Contenido principal */}
      <section className="flex flex-col items-center justify-center flex-1 px-6 py-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-4">
          Bienvenida, Psicóloga 👩‍⚕️
        </h2>
        <p className="text-gray-700 text-center max-w-2xl mb-10">
          Desde este panel puedes acceder a todas las herramientas de seguimiento, 
          gestión y análisis para apoyar tu labor clínica.  
          Selecciona una sección para comenzar.
        </p>

        {/* Tarjetas / botones de navegación */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div
            onClick={() => router.push("/psicologa/dashboard")}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer text-center"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">📊 Dashboard</h3>
            <p className="text-gray-600 text-sm">Visualiza estadísticas y progreso general.</p>
          </div>

          <div
            onClick={() => router.push("/psicologa/alertas")}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer text-center"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">🚨 Alertas</h3>
            <p className="text-gray-600 text-sm">Revisa señales o frases de riesgo detectadas.</p>
          </div>

          <div
            onClick={() => router.push("/psicologa/frases")}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer text-center"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">💬 Frases de riesgo</h3>
            <p className="text-gray-600 text-sm">Accede a frases sensibles o de riesgo.</p>
          </div>

          <div
            onClick={() => router.push("/psicologa/contenido")}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer text-center"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">📚 Contenido</h3>
            <p className="text-gray-600 text-sm">Administra material de apoyo y recursos.</p>
          </div>

          <div
            onClick={() => router.push("/psicologa/exportaciones")}
            className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition cursor-pointer text-center"
          >
            <h3 className="text-xl font-semibold text-indigo-700 mb-2">📤 Exportaciones</h3>
            <p className="text-gray-600 text-sm">Genera reportes o descargas de datos.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-50 text-center py-4 text-sm text-gray-500">
        © 2025 Mentalia | Plataforma para profesionales de la salud mental
      </footer>
    </main>
  );
}
