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
      descripcion:
        "Guía paso a paso para ejercicios de respiración profundos que puedes usar en cualquier momento para reducir la ansiedad.",
      creador: "Dr. María González",
      fecha: "9/1/2024",
    },
    {
      id: 2,
      tipo: "PODCAST",
      categoria: "Estudio",
      titulo: "Podcast: Salud Mental en Estudiantes",
      descripcion:
        "Conversaciones con psicólogos especializados en el bienestar de estudiantes universitarios y técnicos.",
      creador: "Equipo Mentalia",
      fecha: "12/02/2024",
    },
  ];

  return (
    <div className="w-full px-20 mt-10">

      {/* Título de sección */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Gestión de Contenido</h2>

        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition">
          <Upload className="w-4 h-4" />
          Subir Contenido
        </button>
      </div>

      {/* Lista de tarjetas */}
      <div className="flex flex-col gap-5 max-w-4xl">
        {contenidoEstatico.map((item) => (
          <ContenidoItem key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
}





