"use client";

import React, { useState } from "react";
import {
  Plus,
  BookOpen,
  Calendar,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";

import NuevaEntradaModal from "./NuevaEntradaModal";
import BuscadorEntradas from "./BuscadorEntradas";
import FiltroEstado from "./FiltroEstado";

export default function DiarioEmocional() {
  const [mostrarModal, setMostrarModal] = useState(false);

  const [entradas] = useState([
    {
      id: 1,
      titulo: "Un día de reflexión",
      fecha: "14 de enero de 2024",
      hora: "19:00",
      estado: "Normal",
      color: "bg-yellow-100 text-yellow-600",
      descripcion:
        "Hoy me sentí un poco abrumado con las tareas del SENA, pero logré organizarme mejor. Me di cuenta de que cuando divido las tareas en partes más pequeñas, todo se vuelve más manejable.",
      tags: ["SENA", "organización", "estrés"],
    },
    {
      id: 2,
      titulo: "Momento de gratitud",
      fecha: "13 de enero de 2024",
      hora: "19:00",
      estado: "Feliz",
      color: "bg-green-100 text-green-600",
      descripcion:
        "Tuve una excelente sesión de estudio con mis compañeros. Me siento muy agradecido por el apoyo que recibo de mi grupo. Realmente marca la diferencia tener personas que te entienden.",
      tags: ["gratitud", "compañeros", "estudio"],
    },
    {
      id: 3,
      titulo: "Preocupaciones nocturnas",
      fecha: "12 de enero de 2024",
      hora: "19:00",
      estado: "Ansioso",
      color: "bg-purple-100 text-purple-600",
      descripcion:
        "Últimamente he tenido pensamientos que me dificultan dormir. Estoy intentando escribir mis preocupaciones para entenderlas mejor.",
      tags: ["ansiedad", "descanso", "pensamientos"],
    },
  ]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen className="text-purple-600" size={28} />
            Diario Emocional
          </h1>
          <p className="text-gray-500 text-sm">
            Reflexiona sobre tus pensamientos y emociones cada día
          </p>
        </div>

        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all shadow"
        >
          <Plus size={18} />
          Nueva entrada
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex gap-4 mb-6">
        <BuscadorEntradas />
        <FiltroEstado />
      </div>

      {/* LISTA DE ENTRADAS */}
      <div className="space-y-4">
        {entradas.map((entrada) => (
          <div
            key={entrada.id}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
          >
            {/* TÍTULO + ICONOS */}
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {entrada.titulo}
                </h2>

                {/* FECHA + HORA + ESTADO */}
                <div className="flex items-center gap-4 text-gray-500 text-sm mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={16} />
                    {entrada.fecha}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {entrada.hora}
                  </span>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${entrada.color}`}
                  >
                    {entrada.estado}
                  </span>
                </div>
              </div>

              {/* ACCIONES */}
              <div className="flex gap-3">
                <Pencil
                  size={20}
                  className="text-gray-600 hover:text-purple-600 cursor-pointer"
                />
                <Trash2
                  size={20}
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                />
              </div>
            </div>

            {/* DESCRIPCIÓN */}
            <p className="text-gray-700 mt-4">{entrada.descripcion}</p>

            {/* TAGS */}
            <div className="flex gap-2 mt-4 flex-wrap">
              {entrada.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {mostrarModal && (
        <NuevaEntradaModal onClose={() => setMostrarModal(false)} />
      )}
    </div>
  );
}
