"use client";

import { useRouter } from "next/navigation";

export default function FrasesPage() {
  const router = useRouter();

  const frases = [
    "No le encuentro sentido a seguir.",
    "Siento que nada mejorará.",
    "Estoy cansado de todo.",
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col">
      <header className="bg-white/70 backdrop-blur-md shadow-md p-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">Frases de Riesgo</h1>
        <button onClick={() => router.push("/psicologa")} className="text-indigo-700 hover:text-indigo-500 font-medium">
          ⬅ Volver
        </button>
      </header>

      <section className="flex flex-col items-center py-10 px-6 flex-1">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6">Frases detectadas</h2>

        <ul className="bg-white rounded-xl shadow-md w-full max-w-lg divide-y divide-gray-200">
          {frases.map((f, i) => (
            <li key={i} className="p-4 hover:bg-indigo-50 transition">
              {f}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
