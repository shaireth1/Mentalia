import React from "react";
import { Calendar, Clock, Edit2, Trash2 } from "lucide-react";

export default function EntradaDiario({ entrada }) {
  return (
    <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
        <h2 className="text-base sm:text-lg font-semibold text-gray-800">
          {entrada.titulo}
        </h2>
        <div className="flex items-center gap-3 sm:gap-2">
          <Edit2
            size={16}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          />
          <Trash2
            size={16}
            className="text-red-500 hover:text-red-600 cursor-pointer"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-500 mb-3">
        <span className="flex items-center gap-1">
          <Calendar size={14} />
          {entrada.fecha}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} />
          {entrada.hora}
        </span>
        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${entrada.color}`}
        >
          {entrada.estado}
        </span>
      </div>

      <p className="text-gray-700 mb-3 text-sm sm:text-base">
        {entrada.descripcion}
      </p>

      <div className="flex flex-wrap gap-2">
        {entrada.tags.map((tag, i) => (
          <span
            key={i}
            className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}