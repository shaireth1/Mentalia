"use client";

import { X, Upload } from "lucide-react";

export default function ContenidoModalEditar({ open, onClose, data }) {
  if (!open) return null;

  return (
    <div className="
      fixed inset-0 
      bg-black/30 
      backdrop-blur-sm 
      flex items-center justify-center 
      z-50
    ">
      <div className="
        bg-white 
        rounded-2xl 
        shadow-xl 
        w-full 
        max-w-2xl 
        p-8
      ">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Editar Contenido</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs */}
        <div className="flex flex-col gap-5">

          {/* Título */}
          <div>
            <label className="text-sm text-gray-600">Título</label>
            <input
              type="text"
              defaultValue={data.titulo}
              className="
                w-full mt-1 px-4 py-2 
                border border-purple-300 
                rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-purple-400
              "
            />
          </div>

          {/* Grid 2 columnas */}
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-gray-600">Tipo de Contenido</label>
              <select
                defaultValue={data.tipo}
                className="
                  w-full mt-1 px-4 py-2 
                  border border-gray-300 
                  rounded-lg 
                  bg-white
                  focus:outline-none focus:ring-2 focus:ring-purple-400
                "
              >
                <option>Técnica</option>
                <option>Artículo</option>
                <option>Guía</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Categoría</label>
              <input
                type="text"
                defaultValue={data.categoria}
                className="
                  w-full mt-1 px-4 py-2 
                  border border-gray-300 
                  rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-purple-400
                "
              />
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="text-sm text-gray-600">Contenido/Descripción</label>
            <textarea
              defaultValue={data.descripcion}
              className="
                w-full mt-1 px-4 py-3 
                border border-gray-300 
                rounded-lg 
                h-28
                resize-none
                focus:outline-none focus:ring-2 focus:ring-purple-400
              "
            ></textarea>
          </div>

          {/* Imagen */}
          <div>
            <label className="text-sm text-gray-600">Imagen (opcional)</label>

            <div className="flex gap-3 mt-1">
              <input
                type="file"
                className="
                  w-full px-4 py-2 
                  border border-gray-300 
                  rounded-lg 
                  text-sm
                "
              />

              <input
                type="text"
                placeholder="URL de la imagen…"
                className="
                  w-full px-4 py-2 
                  border border-gray-300 
                  rounded-lg 
                  text-sm
                  focus:outline-none focus:ring-2 focus:ring-purple-400
                "
              />
            </div>
          </div>

          {/* Botón */}
          <button
            className="
              mt-3 
              bg-emerald-600 hover:bg-emerald-700 
              text-white 
              px-5 py-2 
              rounded-lg 
              flex items-center justify-center 
              gap-2 
              shadow-sm
            "
          >
            <Upload className="w-4 h-4" />
            Actualizar Contenido
          </button>
        </div>
      </div>
    </div>
  );
}
