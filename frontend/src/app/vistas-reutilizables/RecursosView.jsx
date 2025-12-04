"use client";

import { useState } from "react";
import { BookOpen } from "lucide-react";
import BuscadorRecursos from "./componentes/BuscadorRecursos";
import FiltroTipos from "./componentes/FiltroTipos";
import FiltroCategorias from "./componentes/FiltroCategorias";
import TarjetaRecurso from "./componentes/TarjetaRecurso";
import ModalVerRecurso from "./componentes/ModalVerRecurso"; // 👈 IMPORTANTE

export default function RecursosView() {
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas");

  // ⭐ ESTADO PARA EL MODAL
  const [openModal, setOpenModal] = useState(false);
  const [recursoSeleccionado, setRecursoSeleccionado] = useState(null);

  const abrirRecurso = (data) => {
    setRecursoSeleccionado(data);
    setOpenModal(true);
  };

  const cerrarModal = () => {
    setOpenModal(false);
    setRecursoSeleccionado(null);
  };

  const destacados = [
    {
      titulo: "Técnicas de Respiración para la Ansiedad",
      tipo: "Técnica",
      categoria: "Ansiedad",
      tiempo: "10 min",
      rating: 4.8,
      gratis: true,
      imagen: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
      enlace: "https://google.com",
      descripcion:
        "Aprende ejercicios que reducen la ansiedad y mejoran el bienestar.\n\n**Técnica 4-7-8**\n1. Inhala 4\n2. Mantén 7\n3. Exhala 8",
    },
    {
      titulo: "Cómo Manejar el Estrés Académico",
      tipo: "Artículo",
      categoria: "Estrés",
      tiempo: "8 min lectura",
      rating: 4.6,
      gratis: true,
      imagen: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b",
      enlace: "https://google.com",
      descripcion:
        "Estrategias para estudiantes del SENA para gestionar presión académica.",
    },
    {
      titulo: "Mindfulness para Principiantes",
      tipo: "Video",
      categoria: "Mindfulness",
      tiempo: "25 min",
      rating: 4.9,
      gratis: true,
      imagen: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      enlace: "https://google.com",
      descripcion:
        "Una introducción completa a la práctica guiada del mindfulness.",
    },
  ];

  const todosLosRecursos = [
    {
      titulo: "Podcast: Salud Mental en Estudiantes",
      tipo: "Podcast",
      categoria: "Estudio",
      tiempo: "45 min",
      rating: 4.7,
      gratis: true,
      imagen: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      enlace: "https://google.com",
      descripcion:
        "Conversaciones con psicólogos especializados en bienestar estudiantil.",
    },
  ];

  function filtrar(lista) {
    return lista.filter((r) => {
      const text = busqueda.toLowerCase();
      const coincideTexto =
        r.titulo.toLowerCase().includes(text) ||
        r.descripcion.toLowerCase().includes(text);

      const coincideTipo =
        tipoFiltro === "todos" ||
        r.tipo.toLowerCase() === tipoFiltro.toLowerCase();

      const coincideCategoria =
        categoriaFiltro === "todas" ||
        r.categoria.toLowerCase() === categoriaFiltro.toLowerCase();

      return coincideTexto && coincideTipo && coincideCategoria;
    });
  }

  const destacadosFiltrados = filtrar(destacados);
  const recursosFiltrados = filtrar(todosLosRecursos);

  return (
    <div className="px-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
          <BookOpen className="text-purple-600" size={28} />
          Recursos de Bienestar
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Herramientas y contenido para tu crecimiento emocional
        </p>
      </div>

      {/* Buscador + filtros */}
      <div className="flex flex-row gap-3 items-center">
        <div className="flex-1">
          <BuscadorRecursos value={busqueda} onChange={setBusqueda} />
        </div>

        <FiltroTipos value={tipoFiltro} onChange={setTipoFiltro} />
        <FiltroCategorias value={categoriaFiltro} onChange={setCategoriaFiltro} />
      </div>

      {/* DESTACADOS */}
      <h2 className="mt-10 mb-2 text-lg font-semibold text-gray-800">
        Destacados esta semana
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {destacadosFiltrados.map((r, i) => (
          <TarjetaRecurso key={i} {...r} onClick={() => abrirRecurso(r)} />
        ))}
      </div>

      {/* TODOS LOS RECURSOS */}
      <h2 className="mt-12 mb-2 text-lg font-semibold text-gray-800">
        Todos los recursos
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
        {recursosFiltrados.map((r, i) => (
          <TarjetaRecurso key={i} {...r} onClick={() => abrirRecurso(r)} />
        ))}
      </div>

      {/* MODAL */}
      <ModalVerRecurso
        open={openModal}
        close={cerrarModal}
        data={recursoSeleccionado}
      />
    </div>
  );
}


