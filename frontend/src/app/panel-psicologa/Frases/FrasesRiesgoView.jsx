"use client";

import { useState } from "react";
import ModalAgregarFrase from "./ModalAgregarFrase";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function FrasesRiesgoView() {
  const [openModal, setOpenModal] = useState(false);

  const frases = [
    {
      id: 1,
      tipo: "CRÍTICA",
      frase: "me quiero morir",
      autor: "Dra. María González",
      fecha: "31/12/2023",
    },
    {
      id: 2,
      tipo: "ALTA",
      frase: "no aguanto más",
      autor: "Dra. María González",
      fecha: "31/12/2023",
    },
  ];

  return (
    <div className="w-full mt-2">

      {/* TÍTULO + BOTÓN */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Gestión de Frases de Riesgo
        </h2>

        <button
          onClick={() => setOpenModal(true)}
          className="px-4 py-2 bg-[#009C74] hover:bg-[#00845F] text-white rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={18} />
          Agregar Frase
        </button>
      </div>

      {/* LISTA DE FRASES */}
      <div className="flex flex-col gap-4">
        {frases.map((frase) => (
          <div
            key={frase.id}
            className="
              bg-white rounded-lg shadow-sm 
              border border-gray-200 
              p-4 flex justify-between items-start
            "
          >
            {/* IZQUIERDA */}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span
                  className={`
                    px-3 py-1 text-xs font-semibold rounded-full 
                    ${
                      frase.tipo === "CRÍTICA"
                        ? "bg-red-100 text-red-600"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  {frase.tipo}
                </span>

                <span className="text-xs text-gray-500">
                  Creada por {frase.autor} el {frase.fecha}
                </span>
              </div>

              <p className="text-gray-900 font-medium text-sm">
                "{frase.frase}"
              </p>
            </div>

            {/* BOTONES ICÓNICOS */}
            <div className="flex gap-3">

              {/* Editar */}
              <button className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-700">
                <Pencil size={18} />
              </button>

              {/* Eliminar */}
              <button className="p-2 bg-red-100 hover:bg-red-200 rounded-lg transition text-red-600">
                <Trash2 size={18} />
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {openModal && <ModalAgregarFrase close={() => setOpenModal(false)} />}
    </div>
  );
}


