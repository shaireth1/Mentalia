"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, CheckCircle2 } from "lucide-react";

export default function FiltroCategorias({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const categorias = [
    "todas",
    "Ansiedad",
    "Depresión",
    "Estrés",
    "Mindfulness",
    "Relaciones",
    "Estudio",
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="border rounded-lg px-4 py-2 flex items-center gap-2 text-gray-700 bg-white hover:bg-gray-50 transition"
      >
        {value === "todas" ? "Todas las categorías" : value}
        <ChevronDown size={18} className="text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white shadow-md rounded-lg border py-2 z-20">
          {categorias.map((c) => (
            <button
              key={c}
              onClick={() => {
                onChange(c);
                setOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-700 flex items-center gap-2 hover:bg-gray-100"
            >
              {value === c && <CheckCircle2 size={16} className="text-purple-600" />}
              {c === "todas" ? "Todas las categorías" : c}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

