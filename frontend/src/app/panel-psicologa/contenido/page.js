"use client";

import { useRouter } from "next/navigation";

export default function ContenidoPage() {
  const router = useRouter();

  const recursos = [
    { titulo: "Manejo del Estrés", tipo: "PDF", link: "#" },
    { titulo: "Autoestima y Autocuidado", tipo: "Video", link: "#" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col">
      <header className="bg-white/70 backdrop-blur-md shadow-md p-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">Contenido</h1>
        <button onClick={() => router.push("/psicologa")} className="text-indigo-700 hover:text-indigo-500 font-medium">
          ⬅ Volver
        </button>
      </header>

      <section className="flex flex-col items-center py-10 px-6 flex-1">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6">Material de apoyo</h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
          {recursos.map((r, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-bold text-indigo-700 mb-2">{r.titulo}</h3>
              <p className="text-gray-600 mb-3">Tipo: {r.tipo}</p>
              <a href={r.link} className="text-indigo-600 hover:underline font-medium">
                Ver recurso →
              </a>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
