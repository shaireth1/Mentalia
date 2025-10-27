"use client";

import { useRouter } from "next/navigation";

export default function AlertasPage() {
  const router = useRouter();

  const alertas = [
    { id: 1, paciente: "Ana Torres", tipo: "Frase de riesgo", fecha: "26/10/2025" },
    { id: 2, paciente: "Carlos Ruiz", tipo: "Emoción negativa", fecha: "25/10/2025" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col">
      <header className="bg-white/70 backdrop-blur-md shadow-md p-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">Alertas</h1>
        <button onClick={() => router.push("/psicologa")} className="text-indigo-700 hover:text-indigo-500 font-medium">
          ⬅ Volver
        </button>
      </header>

      <section className="flex flex-col items-center py-10 px-6 flex-1">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6">Frases o señales detectadas</h2>

        <table className="bg-white shadow-md rounded-xl w-full max-w-4xl">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 text-left">Paciente</th>
              <th className="p-3 text-left">Tipo</th>
              <th className="p-3 text-left">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {alertas.map((a) => (
              <tr key={a.id} className="border-b hover:bg-indigo-50">
                <td className="p-3">{a.paciente}</td>
                <td className="p-3">{a.tipo}</td>
                <td className="p-3">{a.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
