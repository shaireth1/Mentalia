"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

const emotionOptions = ["Feliz", "Normal", "Triste", "Ansioso", "Enojado"];

export default function NuevaEntradaModal({ onClose, onSaved, initialData }) {
  const [titulo, setTitulo] = useState("");
  const [estado, setEstado] = useState("Normal");
  const [reflexion, setReflexion] = useState("");
  const [tags, setTags] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Prefill data if editing
  useEffect(() => {
    if (initialData) {
      setTitulo(initialData.title || "");
      setEstado(initialData.emotion || "Normal");
      setReflexion(initialData.note || "");
      setTags((initialData.tags || []).join(", "));
    }
  }, [initialData]);

  const handleSave = async () => {
    if (!titulo.trim() || !reflexion.trim()) {
      setError("Título y reflexión son obligatorios.");
      return;
    }

    setSaving(true);
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setError("No tienes una sesión activa. Inicia sesión nuevamente.");
      return;
    }

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const body = {
      title: titulo.trim(),
      emotion: estado,
      note: reflexion.trim(),
      tags: tagsArray,
      date: initialData?.date || new Date().toISOString(),
      intensity:
        estado === "Feliz"
          ? 5
          : estado === "Normal"
          ? 3
          : estado === "Triste"
          ? 2
          : estado === "Ansioso"
          ? 2
          : 1,
    };

    try {
      const url = initialData
        ? `${baseUrl}/api/journal/${initialData._id}`
        : `${baseUrl}/api/journal`;

      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (res.status === 401) {
        setError("Tu sesión expiró. Inicia sesión nuevamente.");
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const saved = await res.json();
      onSaved(saved);
      onClose();
    } catch (err) {
      console.error("Error guardando entrada:", err);
      setError("No se pudo guardar la entrada.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-3">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          {initialData
            ? "Editar entrada del diario"
            : "Nueva entrada del diario"}
        </h2>

        {error && <p className="text-sm text-red-500 mb-2">{error}</p>}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm mb-1">
              Título *
            </label>
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
              {emotionOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
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

        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 w-full sm:w-auto"
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg disabled:opacity-60 w-full sm:w-auto"
          >
            {saving ? "Guardando..." : "Guardar entrada"}
          </button>
        </div>
      </div>
    </div>
  );
}
