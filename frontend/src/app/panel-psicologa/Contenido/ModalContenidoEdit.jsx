"use client";

import { X, Upload } from "lucide-react";

export default function ModalContenidoEdit({ data, close }) {
  const inputStyle =
    "w-full px-4 py-2.5 bg-[#FAF9FF] border border-[#D6C8F5] rounded-xl text-sm focus:ring-2 focus:ring-[#B388F6] outline-none placeholder:text-gray-400";

  const selectStyle =
    "w-full px-4 py-2.5 bg-white border border-[#D6C8F5] rounded-xl text-sm focus:ring-2 focus:ring-[#B388F6] outline-none cursor-pointer";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-xl relative">

        {/* Cerrar */}
        <button
          onClick={close}
          className="absolute right-5 top-5 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-2xl font-semibold mb-5">Editar Contenido</h2>

        <div className="flex flex-col gap-4">

          {/* TÍTULO */}
          <div>
            <label className="text-sm text-gray-600">Título</label>
            <input
              className={inputStyle}
              defaultValue={data.titulo}
            />
          </div>

          {/* TIPO + CATEGORÍA */}
          <div className="flex gap-4">

            <div className="w-1/2">
              <label className="text-sm text-gray-600">Tipo de Contenido</label>
              <select className={selectStyle} defaultValue={data.tipo}>
                <option value="">Artículo</option>
                <option value="video">Video</option>
                <option value="tecnica">Técnica</option>
              </select>
            </div>

            <div className="w-1/2">
              <label className="text-sm text-gray-600">Categoría</label>
              <select className={selectStyle} defaultValue={data.categoria}>
                <option value="">Todas las categorías</option>
                <option value="ansiedad">Ansiedad</option>
                <option value="depresion">Depresión</option>
                <option value="estres">Estrés</option>
                <option value="mindfulness">Mindfulness</option>
                <option value="relaciones">Relaciones</option>
                <option value="estudio">Estudio</option>
              </select>
            </div>

          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="text-sm text-gray-600">Contenido/Descripción</label>
            <textarea
              className={`${inputStyle} h-28`}
              defaultValue={data.descripcion}
            />
          </div>

          {/* IMAGEN */}
          <div>
            <label className="text-sm text-gray-600">Imagen (opcional)</label>

            <div className="flex gap-3">
              <input
                type="file"
                className="
                  w-1/2 px-4 py-[10px] bg-white border border-[#D6C8F5]
                  rounded-xl text-sm cursor-pointer file:hidden
                "
              />

              <input
                className={`${inputStyle} w-1/2`}
                defaultValue={data.imagenUrl}
                placeholder="URL de la imagen..."
              />
            </div>
          </div>

          {/* BOTÓN */}
          <button className="
            mt-2 bg-[#009C74] hover:bg-[#00845F] 
            text-white py-2.5 rounded-xl w-full font-semibold 
            flex items-center justify-center gap-2 transition
          ">
            <Upload size={18} />
            Actualizar Contenido
          </button>

        </div>
      </div>
    </div>
  );
}
