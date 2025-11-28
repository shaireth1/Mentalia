"use client";

import {
  Clock,
  Star,
  ExternalLink,
  FileText,
  Play,
  Mic,
  BookOpen,
  CircleAlert,
} from "lucide-react";

export default function TarjetaRecurso({
  titulo,
  descripcion,
  tipo,
  categoria,
  tiempo,
  rating,
  imagen,
  gratis,
  onClick,
}) {
  const iconosTipo = {
    Técnica: CircleAlert,
    Artículo: FileText,
    Video: Play,
    Podcast: Mic,
    Libro: BookOpen,
  };

  const Icono = iconosTipo[tipo] || FileText;

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 shadow-sm 
      hover:shadow-md transition cursor-pointer overflow-hidden flex"
      onClick={onClick}
    >
      {/* Imagen más pequeña */}
      <div className="relative w-40 h-28 flex-shrink-0">
        <img
          src={imagen}
          alt={titulo}
          className="w-full h-full object-cover"
        />

        {/* Badge tipo */}
        <div
          className="absolute top-2 left-2 flex items-center gap-1 
          bg-white/90 px-2 py-0.5 rounded-full text-[10px] font-medium shadow-sm 
          text-gray-700"
        >
          <Icono size={12} className="text-green-700" />
          {tipo}
        </div>

        {/* Badge gratis */}
        {gratis && (
          <div
            className="absolute top-2 right-2 bg-green-100 text-green-700 
            px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-sm"
          >
            Gratis
          </div>
        )}
      </div>

      {/* Contenido compacto */}
      <div className="p-3 flex flex-col justify-between w-full">

        <div>
          <h3 className="text-base font-semibold text-gray-800 leading-tight">
            {titulo}
          </h3>

          <p className="text-gray-600 text-xs mt-1 line-clamp-2">
            {descripcion}
          </p>
        </div>

        {/* Tiempo + rating */}
        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock size={13} />
            {tiempo}
          </div>

          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={14} fill="#facc15" stroke="none" />
            <span className="text-gray-700">{rating}</span>
          </div>
        </div>

        {/* Categoría */}
        <div className="mt-2">
          <span
            className="text-[10px] bg-purple-100 text-purple-700 
          px-2 py-0.5 rounded-full font-medium"
          >
            {categoria}
          </span>
        </div>

        {/* Botón Ver recurso */}
        <div className="flex justify-end mt-3">
          <button
            className="flex items-center gap-1 bg-[#7b63ff] 
            hover:bg-[#684ce8] transition text-white text-xs 
            px-3 py-1 rounded-lg"
          >
            Ver recurso
            <ExternalLink size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}


