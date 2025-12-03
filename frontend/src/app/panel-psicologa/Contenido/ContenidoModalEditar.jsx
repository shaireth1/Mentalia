import { X } from "lucide-react";
import { useState } from "react";

export default function ContenidoModalEditar({ cerrarModal, contenido }) {
  const [titulo, setTitulo] = useState(contenido?.titulo || "");
  const [descripcion, setDescripcion] = useState(contenido?.descripcion || "");

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      
      <div className="bg-white w-full max-w-xl rounded-2xl p-6 shadow-xl animate-fadeIn">
        
        {/* Header modal */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold text-gray-900">
            {contenido ? "Editar contenido" : "Crear contenido"}
          </h2>
          <button
            onClick={cerrarModal}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Formulario */}
        <div className="flex flex-col gap-4">

          {/* Título */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Título
            </label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="Escribe el título..."
            />
          </div>

          {/* Descripción */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2.5 h-28 resize-none outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              placeholder="Escribe la descripción..."
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end mt-6 gap-3">

          <button
            onClick={cerrarModal}
            className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button className="px-5 py-2.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700 shadow-md transition">
            Guardar
          </button>

        </div>
      </div>
    </div>
  );
}

