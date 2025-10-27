import React, { useState } from "react";
import { X } from "lucide-react";

export default function NuevaEntradaModal({ onClose }) {
  const [titulo, setTitulo] = useState("");
  const [estado, setEstado] = useState("Normal");
  const [reflexion, setReflexion] = useState("");
  const [tags, setTags] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Nueva entrada del diario
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">Título *</label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="¿Cómo describirías tu día?"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              ¿Cómo te sientes? *
            </label>
            <select
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            >
              <option>Feliz</option>
              <option>Normal</option>
              <option>Triste</option>
              <option>Ansioso</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Reflexión *
            </label>
            <textarea
              value={reflexion}
              onChange={(e) => setReflexion(e.target.value)}
              rows="4"
              placeholder="Expresa tus pensamientos y emociones..."
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Tags (separados por comas)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ej: SENA, estrés, familia"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-purple-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg">
            Guardar entrada
          </button>
        </div>
      </div>
    </div>
  );
}


