"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  BookOpen,
  PlayCircle,
  Headphones,
  FileText,
} from "lucide-react";

import ListadoRecursos from "./componentes/ListadoRecursos";

export default function RecursosView() {
  // -------------------------
  // DATOS DE PRUEBA (usa los tuyos o reemplaza por fetch)
  // -------------------------
  const recursosBase = [
    {
      id: 1,
      titulo: "Guía para manejar la ansiedad",
      categoria: "Ansiedad",
      tipo: "PDF",
      duracion: "15 min",
      estado: "Nuevo",
      descripcion: "Aprende técnicas para manejar la ansiedad.",
    },
    {
      id: 2,
      titulo: "Meditación guiada de relajación",
      categoria: "Mindfulness",
      tipo: "Podcast",
      duracion: "12 min",
      estado: "Popular",
      descripcion: "Meditación guiada para estudiantes.",
    },
    {
      id: 3,
      titulo: "Cómo estudiar sin estrés",
      categoria: "Estrés",
      tipo: "Video",
      duracion: "8 min",
      estado: "Recomendado",
      descripcion: "Estrategias efectivas para manejar el estrés académico.",
    },
    {
      id: 4,
      titulo: "Hábitos que mejoran tu bienestar",
      categoria: "Bienestar General",
      tipo: "Artículo",
      duracion: "5 min lectura",
      estado: "Nuevo",
      descripcion: "Pequeñas acciones que mejoran tu salud mental.",
    },
  ];

  const tipos = ["Todos", "PDF", "Video", "Podcast", "Artículo"];
  const categorias = [
    "Todas",
    "Ansiedad",
    "Mindfulness",
    "Estrés",
    "Bienestar General",
  ];

  // --------------------------------
  // ESTADOS
  // --------------------------------
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todas");
  const [openTipo, setOpenTipo] = useState(false);
  const [openCategoria, setOpenCategoria] = useState(false);

  // --------------------------------
  // FILTRADO PRINCIPAL
  // --------------------------------
  const recursosFiltrados = recursosBase.filter((r) => {
    const coincideBusqueda = r.titulo
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideTipo =
      tipoFiltro === "Todos" ? true : r.tipo === tipoFiltro;

    const coincideCategoria =
      categoriaFiltro === "Todas" ? true : r.categoria === categoriaFiltro;

    return coincideBusqueda && coincideTipo && coincideCategoria;
  });

  // --------------------------------
  // ICONOS PARA LOS FILTROS
  // --------------------------------
  const iconoTipo = {
    PDF: FileText,
    Video: PlayCircle,
    Podcast: Headphones,
    Artículo: BookOpen,
  };

  return (
    <div className="min-h-screen bg-[#f9f5ff] p-8 text-gray-900">
      {/* TITULO PRINCIPAL */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#3b1e72]">
          💜 Recursos de Bienestar
        </h1>
        <p className="text-gray-500 text-sm">
          Explora contenido creado para mejorar tu bienestar emocional
        </p>
      </div>

      {/* ------------------------- */}
      {/* BUSCADOR Y FILTROS */}
      {/* ------------------------- */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded-2xl shadow-sm mb-10">
        {/* Buscador */}
        <div className="flex items-center gap-2 flex-1 border border-gray-200 rounded-xl px-3 py-2">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar recursos..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="flex-1 outline-none bg-transparent text-gray-700 text-sm"
          />
        </div>

        {/* FILTRO TIPO */}
        <div className="relative">
          <button
            onClick={() => setOpenTipo(!openTipo)}
            className="border border-gray-200 bg-white rounded-xl px-4 py-2 text-sm flex items-center gap-2 hover:border-purple-400 transition"
          >
            <Filter size={16} />
            {tipoFiltro}
          </button>

          {openTipo && (
            <div className="absolute top-12 right-0 bg-white border border-gray-200 shadow-lg rounded-xl w-48 z-20">
              {tipos.map((tipo) => {
                const Icono = iconoTipo[tipo];

                return (
                  <button
                    key={tipo}
                    onClick={() => {
                      setTipoFiltro(tipo);
                      setOpenTipo(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left"
                  >
                    {Icono && <Icono size={16} />}
                    {tipo}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* FILTRO CATEGORÍA */}
        <div className="relative">
          <button
            onClick={() => setOpenCategoria(!openCategoria)}
            className="border border-gray-200 bg-white rounded-xl px-4 py-2 text-sm flex items-center gap-2 hover:border-purple-400 transition"
          >
            Categoría: {categoriaFiltro}
          </button>

          {openCategoria && (
            <div className="absolute top-12 right-0 bg-white border border-gray-200 shadow-lg rounded-xl w-52 z-20">
              {categorias.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoriaFiltro(cat);
                    setOpenCategoria(false);
                  }}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 w-full text-left"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* LISTADO FINAL */}
      <ListadoRecursos recursos={recursosFiltrados} />
    </div>
  );
}



