"use client";

import { Upload } from "lucide-react";
import ContenidoItem from "./ContenidoItem";

export default function ContenidoView() {
  const contenidoEstatico = [
    {
      id: 1,
      tipo: "TÉCNICA",
      categoria: "Ansiedad",
      titulo: "Técnicas de Respiración para Ansiedad",
      descripcion: "Guía paso a paso para ejercicios de respiración...",
      creador: "Dr. María González",
      fecha: "9/1/2024",
    },
  ];

  return (
    <div className="w-full mt-10 px-20">

      {/* Header + botón */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-semibold">Gestión de Contenido</h2>

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition">
          <Upload className="w-4 h-4" />
          Subir Contenido
        </button>
      </div>

      {/* Lista de tarjetas */}
      <div className="flex flex-col gap-6">
        {contenidoEstatico.map(item => (
          <ContenidoItem key={item.id} data={item} />
        ))}
      </div>

    </div>
  );
}

