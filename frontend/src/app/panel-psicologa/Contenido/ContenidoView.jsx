"use client";

import { useState } from "react";
import { Upload } from "lucide-react";
import ContenidoCard from "./ContenidoCard";
import ModalContenidoCreate from "./ModalContenidoCreate";

export default function ContenidoView() {
  const [openModal, setOpenModal] = useState(false);

  const contenido = [
    {
      _id: "1",
      tipo: "TÉCNICA",
      categoria: "ansiedad",
      titulo: "Técnicas de Respiración para Ansiedad",
      descripcion: "Guía paso a paso para ejercicios de respiración...",
      creador: "Dra. María González",
      fecha: "9/1/2024",
    },
  ];

  return (
    <div className="w-full mt-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">
          Gestión de Contenido
        </h2>

        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-[#009C74] hover:bg-[#00845F] text-white rounded-lg flex items-center gap-2 shadow-md transition"
        >
          <Upload size={18} />
          Subir Contenido
        </button>
      </div>

      {/* TARJETA FULL WIDTH COMO EL DISEÑO */}
      <div className="w-full">
        {contenido.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay contenido todavía.</p>
        ) : (
          contenido.map((item) => (
            <ContenidoCard key={item._id} data={item} />
          ))
        )}
      </div>

      {openModal && (
        <ModalContenidoCreate close={() => setOpenModal(false)} />
      )}
    </div>
  );
}
