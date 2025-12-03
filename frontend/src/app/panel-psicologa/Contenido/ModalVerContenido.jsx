"use client";

import { X } from "lucide-react";

export default function ModalVerContenido({ data, close }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-xl relative">

        <button
          onClick={close}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        <h2 className="text-lg font-semibold mb-4">Ver Contenido</h2>

        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#DFF0FF] text-[#0075C9]">
            {data.tipo}
          </span>

          <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
            {data.categoria}
          </span>
        </div>

        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
          {data.titulo}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed">
          {data.descripcion}
        </p>
      </div>
    </div>
  );
}

