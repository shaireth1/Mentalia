"use client";

import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col">
      <header className="bg-white/70 backdrop-blur-md shadow-md p-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">Dashboard</h1>
        <button onClick={() => router.push("/psicologa")} className="text-indigo-700 hover:text-indigo-500 font-medium">
          ⬅ Volver
        </button>
      </header>

      <section className="flex flex-col items-center py-10 px-6 flex-1">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6">Resumen de actividad</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl w-full">
          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">👥 Pacientes activos</h3>
            <p className="text-3xl font-bold text-gray-700">12</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">📅 Sesiones esta semana</h3>
            <p className="text-3xl font-bold text-gray-700">8</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md text-center">
            <h3 className="text-xl font-bold text-indigo-700 mb-2">🚨 Alertas activas</h3>
            <p className="text-3xl font-bold text-gray-700">3</p>
          </div>
        </div>
      </section>
    </main>
  );
}
