"use client";

import { ArrowRight } from "lucide-react";

export default function TarjetaRecurso({ titulo, categoria, descripcion, imagen, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer overflow-hidden transition-all hover:shadow-md hover:-translate-y-1"
    >
      {/* Imagen */}
      {imagen && (
        <div className="w-full h-40 overflow-hidden">
          <img
            src={imagen}
            alt={titulo}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="p-4 space-y-2">
        {/* Categoría */}
        <span className="text-xs font-medium text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
          {categoria}
        </span>

        {/* Título */}
        <h3 className="text-lg font-semibold text-gray-800">
          {titulo}
        </h3>

        {/* Descripción */}
        <p className="text-sm text-gray-500 line-clamp-2">
          {descripcion}
        </p>

        {/* Botón ver más */}
        <div className="flex justify-end pt-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-all">
            <ArrowRight size={18} className="text-gray-700" />
          </div>
        </div>
      </div>
    </div>
  );
}




