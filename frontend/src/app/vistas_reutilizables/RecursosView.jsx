"use client";

import { useEffect, useState } from "react";
import { Play, FileText, Link2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function RecursosView() {
  const [recursos, setRecursos] = useState([]);
  const [categoria, setCategoria] = useState("todos");
  const [tipo, setTipo] = useState("todos");
  const [buscar, setBuscar] = useState("");

  const cargar = async () => {
    const params = new URLSearchParams();

    if (categoria !== "todos") params.set("categoria", categoria);
    if (tipo !== "todos") params.set("tipo", tipo);
    if (buscar.trim()) params.set("buscar", buscar.trim());

    const res = await fetch(`${API_URL}/api/content?${params}`);
    const data = await res.json();

    const normalizados = data.map((item) => ({
      ...item,
      archivoUrl:
        item.archivoUrl && !item.archivoUrl.startsWith("http")
          ? `${API_URL}${item.archivoUrl}`
          : item.archivoUrl,
      enlace:
        item.enlace && !item.enlace.startsWith("http")
          ? `${API_URL}${item.enlace}`
          : item.enlace,
      imagenUrl:
        item.imagenUrl && !item.imagenUrl.startsWith("http")
          ? `${API_URL}${item.imagenUrl}`
          : item.imagenUrl,
    }));

    setRecursos(normalizados);
  };

  useEffect(() => {
    cargar();
  }, [categoria, tipo, buscar]); // 🔥 Se agrega "buscar" para que funcione el buscador

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold">Recursos de Bienestar</h2>
      <p className="text-gray-500 mb-6">
        Herramientas y contenido para tu crecimiento emocional
      </p>

      {/* FILTROS */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          className="flex-1 px-4 py-2 rounded-xl border"
          placeholder="Buscar recursos…"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-xl border"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
        >
          <option value="todos">Todos los tipos</option>
          <option value="articulo">Artículo</option>
          <option value="video">Video</option>
          <option value="tecnica">Técnica</option>
          <option value="recurso">Recurso externo</option>
        </select>

        <select
          className="px-4 py-2 rounded-xl border"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        >
          <option value="todos">Todas las categorías</option>
          <option value="ansiedad">Ansiedad</option>
          <option value="estres">Estrés</option>
          <option value="mindfulness">Mindfulness</option>
          <option value="general">General</option>
        </select>

        <button
          onClick={cargar}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white"
        >
          Buscar
        </button>
      </div>

      {/* LISTADO */}
      {recursos.length === 0 ? (
        <p className="text-gray-500">No hay contenido disponible.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {recursos.map((item) => (
            <RecursoCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
📌 TARJETA — Preview y miniaturas correctas + fix clicks
========================================================= */
function RecursoCard({ item }) {
  const esVideo = item.tipo === "video";
  const esArticulo = item.tipo === "articulo";
  const esLinkExterno = item.enlace && !item.archivoUrl;
  const tieneArchivo = !!item.archivoUrl;

  // 📌 Miniaturas corregidas
  const getThumbnail = (item) => {
    if (item.imagenUrl) return item.imagenUrl;

    if (item.tipo === "articulo") return "/recursos/article.png";
    if (item.tipo === "video") return "/recursos/video.png";
    if (item.tipo === "tecnica") return "/recursos/technique.png";

    if (item.tipo === "recurso") {
      if (item.archivoUrl && /\.pdf($|\?)/i.test(item.archivoUrl))
        return "/recursos/pdf.png";

      if (item.archivoUrl && /(\.mp3|\.wav|\.mpeg)/i.test(item.archivoUrl))
        return "/recursos/podcast.png";

      if (item.enlace) return "/recursos/enlace.png";
    }

    return "/recursos/default.png";
  };

  const abrirRecurso = () => {
    if (item.archivoUrl) return window.open(item.archivoUrl, "_blank");
    if (esLinkExterno) return window.open(item.enlace, "_blank");
  };

  const descargarRecurso = (e) => {
    e.stopPropagation();
    if (!item.archivoUrl) return;

    const link = document.createElement("a");
    link.href = item.archivoUrl;
    link.download = item.titulo || "recurso-mentalia";
    link.click();
  };

  return (
    <div
      className="bg-white shadow-md rounded-2xl overflow-hidden w-full cursor-pointer hover:shadow-xl transition border"
      onClick={abrirRecurso}
    >
      {/* Imagen */}
      <div className="relative h-[180px] w-full">
        <img
          src={getThumbnail(item)}
          alt={item.titulo}
          className="object-cover w-full h-full"
        />

        <span className="absolute top-3 left-3 bg-indigo-100 text-indigo-700 px-3 py-[3px] rounded-full text-sm capitalize">
          {item.tipo}
        </span>

        <span className="absolute top-3 right-3 bg-green-100 text-green-700 px-3 py-[3px] rounded-full text-sm">
          Gratis
        </span>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-semibold leading-tight">{item.titulo}</h3>

        <p className="text-gray-600 mt-2 line-clamp-3">{item.descripcion}</p>

        <div className="mt-3">
          <span className="bg-purple-100 text-purple-700 px-3 py-[3px] rounded-full text-sm capitalize">
            {item.categoria}
          </span>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {/* FIX: evitar doble click */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              abrirRecurso();
            }}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            {esVideo && <Play size={18} />}
            {esArticulo && <FileText size={18} />}
            {esLinkExterno && <Link2 size={18} />}
            Ver recurso
          </button>

          {tieneArchivo && (
            <button
              onClick={descargarRecurso}
              className="w-full border border-purple-600 text-purple-600 hover:bg-purple-50 font-medium py-2 rounded-lg transition text-sm"
            >
              Descargar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}