"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  ExternalLink,
  BookOpen,
  PlayCircle,
  Headphones,
  FileText,
  Brain,
} from "lucide-react";

export default function RecursosView() {
  const [tipoFiltro, setTipoFiltro] = useState("Todos los tipos");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas las categorías");
  const [openTipo, setOpenTipo] = useState(false);

  const recursosDestacados = [
    {
      id: 1,
      titulo: "Técnicas de Respiración para la Ansiedad",
      tipo: "Técnica",
      tiempo: "10 min",
      rating: 4.8,
      categoria: "Ansiedad",
      imagen: "/images/templo.jpg",
      gratis: true,
      etiqueta: "Técnica",
    },
    {
      id: 2,
      titulo: "Cómo Manejar el Estrés Académico",
      tipo: "Artículo",
      tiempo: "8 min lectura",
      rating: 4.6,
      categoria: "Estrés",
      imagen: "/images/therapy.jpg",
      gratis: true,
      etiqueta: "Artículo",
    },
    {
      id: 3,
      titulo: "Mindfulness para Principiantes",
      tipo: "Video",
      tiempo: "25 min",
      rating: 4.9,
      categoria: "Mindfulness",
      imagen: "/images/hands.jpg",
      gratis: true,
      etiqueta: "Video",
    },
  ];

  const todosLosRecursos = [
    {
      id: 4,
      titulo: "Podcast: Salud Mental en Estudiantes",
      tipo: "Podcast",
      tiempo: "45 min",
      rating: 4.7,
      categoria: "Estudio",
      imagen: "/images/emotion.jpg",
      gratis: true,
    },
  ];

  const iconoTipo = {
    Artículo: <FileText size={16} />,
    Video: <PlayCircle size={16} />,
    Podcast: <Headphones size={16} />,
    Técnica: <Brain size={16} />,
    Libro: <BookOpen size={16} />,
  };

  return (
    <div className="min-h-screen bg-[#f9f5ff] p-8 text-gray-800">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold flex items-center gap-2 text-[#3b1e72]">
          💜 Recursos de Bienestar
        </h1>
        <p className="text-gray-500 text-sm">
          Herramientas y contenido para tu crecimiento emocional
        </p>
      </div>

      {/* SEARCH Y FILTROS */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl shadow-sm mb-10">
        <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-xl px-3 py-2">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar recursos..."
            className="flex-1 outline-none bg-transparent text-gray-700 text-sm"
          />
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenTipo(!openTipo)}
            className="border border-gray-200 bg-white rounded-xl px-4 py-2 text-sm flex items-center gap-2 hover:border-purple-400 transition"
          >
            <Filter size={16} />
            {tipoFiltro}
          </button>

          {openTipo && (
            <div className="absolute top-12 right-0 bg-white border border-gray-200 shadow-lg rounded-xl w-48 z-10">
              {["Todos los tipos", "Artículo", "Video", "Podcast", "Técnica", "Libro"].map(
                (tipo) => (
                  <button
                    key={tipo}
                    onClick={() => {
                      setTipoFiltro(tipo);
                      setOpenTipo(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left"
                  >
                    {iconoTipo[tipo] || <Filter size={14} />}
                    {tipo}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <button className="border border-gray-200 bg-white rounded-xl px-4 py-2 text-sm flex items-center gap-2 hover:border-purple-400 transition">
          Todas las categorías
        </button>
      </div>

      {/* DESTACADOS */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Destacados esta semana
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recursosDestacados.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
            >
              <div className="relative">
                <img
                  src={r.imagen}
                  alt={r.titulo}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 bg-white/80 text-xs px-3 py-1 rounded-full text-gray-700 flex items-center gap-1">
                  {iconoTipo[r.tipo]} {r.tipo}
                </div>
                <div className="absolute top-3 right-3 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  Gratis
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-800">{r.titulo}</h4>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{r.descripcion}</p>
                <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                  <span>{r.tiempo}</span>
                  <span className="text-yellow-500">⭐ {r.rating}</span>
                </div>
                <button className="mt-4 w-full bg-[#7B3EF3] text-white py-2 rounded-xl hover:bg-[#6b32e6] flex items-center justify-center gap-2 text-sm font-medium transition">
                  Ver recurso <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TODOS LOS RECURSOS */}
      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Todos los recursos</h3>
        <div className="flex flex-col gap-4">
          {todosLosRecursos.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 flex items-center gap-4"
            >
              <img
                src={r.imagen}
                alt={r.titulo}
                className="w-40 h-28 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{r.titulo}</h4>
                <p className="text-gray-500 text-sm mt-1">{r.descripcion}</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <span>{r.tiempo}</span>
                  <span className="text-yellow-500">⭐ {r.rating}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="bg-gray-100 text-gray-600 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-gray-200 text-sm">
                  <Download size={14} /> Descargar
                </button>
                <button className="bg-[#7B3EF3] text-white rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-[#6b32e6] text-sm">
                  Ver recurso <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

