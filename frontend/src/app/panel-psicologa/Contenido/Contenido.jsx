"use client";

import ContenidoItem from "./ContenidoItem";
import { Upload } from "lucide-react";
import Link from "next/link";

export default function ContenidoView() {
  // Si tienes datos reales, pásalos al ContenidoItem; aquí dejo un ejemplo estático.
  const ejemplo = {
    tipo: "TÉCNICA",
    categoria: "ansiedad",
    titulo: "Técnicas de Respiración para Ansiedad",
    descripcion: "Guía paso a paso para ejercicios de respiración…",
    creador: "Dr. María González",
    fecha: "9/1/2024",
  };

  return (
    // Fondo neutro (sin azul). Ajusta el padding según tu layout principal.
    <div className="w-full min-h-screen bg-white px-10 py-8">
      {/* Contenedor central con ancho limitado para que quede igual que la captura */}
      <div className="max-w-[1200px] mx-auto">

        {/* Header: título a la izquierda y botón a la derecha */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-gray-800">Gestión de Contenido</h1>

          <Link
            href="#"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg shadow-sm transition"
          >
            <Upload size={16} />
            Subir Contenido
          </Link>
        </div>

        {/* Tarjeta única (igual que tu captura) */}
        <div className="mt-2">
          <ContenidoItem data={ejemplo} />
        </div>
      </div>
    </div>
  );
}

