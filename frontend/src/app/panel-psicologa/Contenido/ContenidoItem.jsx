"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

export default function ContenidoItem({ data }) {
  // wrapper relative para que los botones floten dentro del card sin romper el flujo
  return (
    <div className="relative w-full bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      {/* Acción: grupo de botones en la esquina superior derecha */}
      <div className="absolute right-6 top-6 flex items-center gap-3">
        <button
          aria-label="ver"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-100 hover:bg-gray-50 shadow-sm transition"
        >
          <Eye size={18} className="text-gray-600" />
        </button>

        <button
          aria-label="editar"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-100 hover:bg-gray-50 shadow-sm transition"
        >
          <Pencil size={18} className="text-gray-600" />
        </button>

        <button
          aria-label="eliminar"
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-red-50 hover:bg-red-50 shadow-sm transition"
        >
          <Trash2 size={18} className="text-red-600" />
        </button>
      </div>

      {/* Contenido del card (evita que las acciones tapen texto) */}
      <div className="flex flex-col gap-3">
        {/* Tags */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-600 rounded-full">
            {data.tipo ?? "TÉCNICA"}
          </span>

          <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-600 rounded-full">
            {data.categoria ?? "ansiedad"}
          </span>
        </div>

        {/* Título */}
        <h2 className="text-lg font-semibold text-gray-800">
          {data.titulo ?? "Título del contenido"}
        </h2>

        {/* Descripción */}
        <p className="text-sm text-gray-600">
          {data.descripcion ?? "Breve descripción del contenido..."}
        </p>

        {/* Autor y fecha */}
        <p className="text-sm text-gray-500 mt-1">
          Creado por {data.creador ?? "Autor"} el {data.fecha ?? "DD/MM/YYYY"}
        </p>
      </div>
    </div>
  );
}




