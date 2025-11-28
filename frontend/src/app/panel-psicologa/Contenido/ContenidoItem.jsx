"use client";

import { Eye, Edit3, Trash2 } from "lucide-react";

export default function ContenidoItem({ item, setItems, setModalEditar }) {
  const eliminar = () =>
    setItems((prev) => prev.filter((i) => i.id !== item.id));

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex gap-3 mb-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
              {item.tipo.toUpperCase()}
            </span>

            <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
              {item.categoria}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            {item.titulo}
          </h3>

          <p className="text-sm text-gray-600 mt-1">{item.descripcion}</p>

          <p className="text-xs text-gray-500 mt-2">
            Creado por {item.autor} el {item.fecha}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition">
            <Eye className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={() => setModalEditar(item)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Edit3 className="w-5 h-5 text-gray-700" />
          </button>

          <button
            onClick={eliminar}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Trash2 className="w-5 h-5 text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
