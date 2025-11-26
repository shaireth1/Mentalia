"use client";

import { useState } from "react";
import {
  FileText,
  Play,
  Podcast,
  Brain,
  BookOpen,
  ChevronDown,
  Check,
} from "lucide-react";

export default function FiltroTipos({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const opciones = [
    { label: "Todos los tipos", value: "todos", icon: Check },
    { label: "Artículo", value: "articulo", icon: FileText },
    { label: "Video", value: "video", icon: Play },
    { label: "Podcast", value: "podcast", icon: Podcast },
    { label: "Técnica", value: "tecnica", icon: Brain },
    { label: "Libro", value: "libro", icon: BookOpen },
  ];

  const seleccionada = opciones.find((o) => o.value === value) || opciones[0];

  return (
    <div className="relative select-none">
      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-4 py-2 bg-[#f3ecff] border border-[#d7c9ff] text-[#7b61ff] rounded-xl w-48"
      >
        {seleccionada.label}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute mt-2 w-52 bg-white shadow-xl rounded-xl border border-[#e5d9ff] py-2 z-20">
          {opciones.map((op) => {
            const Icon = op.icon;
            return (
              <div
                key={op.value}
                onClick={() => {
                  onChange(op.value);
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#f3ecff] text-gray-700"
              >
                <Icon className="w-5 h-5 text-[#7b61ff]" />
                <span>{op.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}




