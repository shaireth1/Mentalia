"use client";

import { useState } from "react";
import {
  Folder,
  Heart,
  Users,
  Sparkles,
  GraduationCap,
  ChevronDown,
  Check,
} from "lucide-react";

export default function FiltroCategorias({ value, onChange }) {
  const [open, setOpen] = useState(false);

  const categorias = [
    { label: "Todas las categorías", value: "todas", icon: Check },
    { label: "Bienestar emocional", value: "bienestar", icon: Heart },
    { label: "Relaciones", value: "relaciones", icon: Users },
    { label: "Productividad", value: "productividad", icon: Folder },
    { label: "Autoestima", value: "autoestima", icon: Sparkles },
    { label: "Aprendizaje", value: "aprendizaje", icon: GraduationCap },
  ];

  const seleccionada =
    categorias.find((c) => c.value === value) || categorias[0];

  return (
    <div className="relative select-none">
      {/* BOTÓN PRINCIPAL */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between px-4 py-2 bg-[#f3ecff] border border-[#d7c9ff] text-[#7b61ff] rounded-xl w-56"
      >
        {seleccionada.label}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>

      {/* DROPDOWN */}
      {open && (
        <div className="absolute mt-2 w-60 bg-white shadow-xl rounded-xl border border-[#e5d9ff] py-2 z-20">
          {categorias.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.value}
                onClick={() => {
                  onChange(cat.value);
                  setOpen(false);
                }}
                className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[#f3ecff] text-gray-700"
              >
                <Icon className="w-5 h-5 text-[#7b61ff]" />
                <span>{cat.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}




