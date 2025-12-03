"use client";

import { X } from "lucide-react";

export default function ModalContenidoEdit({ data, close }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-lg relative">

        <button
          onClick={close}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-semibold mb-5">Editar Contenido</h2>

        <div className="flex flex-col gap-4">

          {/* TÍTULO */}
          <input
            defaultValue={data.titulo}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
          />

          {/* TIPO + CATEGORÍA */}
          <div className="flex gap-3">
            <select
              defaultValue={data.tipo}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            >
              <option>Artículo</option>
              <option>Video</option>
              <option>Técnica</option>
            </select>

            <select
              defaultValue={data.categoria}
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            >
              <option value="ansiedad">Ansiedad</option>
              <option value="depresion">Depresión</option>
              <option value="estrés">Estrés</option>
              <option value="mindfulness">Mindfulness</option>
              <option value="relaciones">Relaciones</option>
              <option value="estudio">Estudio</option>
            </select>
          </div>

          {/* DESCRIPCIÓN */}
          <textarea
            defaultValue={data.descripcion}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-28 focus:outline-none"
          />

          {/* IMAGEN */}
          <div className="flex gap-2">
            <input
              type="file"
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            />
            <input
              defaultValue={data.imagenUrl}
              placeholder="URL de la imagen..."
              className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none"
            />
          </div>

          {/* BOTÓN */}
          <button className="mt-2 bg-[#009C74] hover:bg-[#00845F] text-white py-2 rounded-lg w-full font-medium">
            Guardar Cambios
          </button>

        </div>
      </div>
    </div>
  );
}


