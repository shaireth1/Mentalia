"use client";

import { useRouter } from "next/navigation";

export default function ExportacionesPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col">
      <header className="bg-white/70 backdrop-blur-md shadow-md p-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">Exportaciones</h1>
        <button onClick={() => router.push("/psicologa")} className="text-indigo-700 hover:text-indigo-500 font-medium">
          ⬅ Volver
        </button>
      </header>

      <section className="flex flex-col items-center py-10 px-6 flex-1">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6">Generar reportes</h2>
        <p className="text-gray-700 text-center max-w-lg mb-8">
          Desde aquí puedes exportar la información registrada en formato PDF o CSV
          para respaldar tu trabajo o compartir informes con tu equipo.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
            Exportar como PDF
          </button>
          <button className="bg-white border border-indigo-400 text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition">
            Exportar como CSV
          </button>
        </div>
      </section>
    </main>
  );
}
