"use client";

import { useState } from "react";
import { ChevronDown, X, Check } from "lucide-react";

export default function ModalAgregarFrase({ close, agregar }) {
  const [frase, setFrase] = useState("");
  const [open, setOpen] = useState(false);
  const [severidad, setSeveridad] = useState("Alta Prioridad");

  const opciones = ["Alta Prioridad", "Crítica"];

  const handleSubmit = () => {
    if (!frase.trim()) return;

    agregar({
      id: Date.now(),
      frase,
      severidad: severidad === "Crítica" ? "CRÍTICA" : "ALTA",
      creador: "Dra. María González",
      fecha: new Date().toLocaleDateString()
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-40">
      <div className="bg-white w-[500px] rounded-xl p-6 shadow-lg relative">

        {/* Cerrar */}
        <button className="absolute top-4 right-4" onClick={close}>
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Agregar Nueva Frase de Riesgo
        </h2>

        {/* FRASE */}
        <label className="text-gray-700 text-sm font-medium">Frase de Riesgo</label>
        <input
          type="text"
          className="w-full mt-2 px-4 py-2 border border-purple-300 rounded-lg outline-purple-500"
          placeholder="Ingresa la frase que debe detectarse…"
          value={frase}
          onChange={(e) => setFrase(e.target.value)}
        />

        {/* SEVERIDAD */}
        <label className="text-gray-700 text-sm font-medium mt-4 block">
          Nivel de Severidad
        </label>

        <div className="relative mt-2">
          <button
            onClick={() => setOpen(!open)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 flex justify-between items-center bg-gray-50 hover:bg-gray-100"
          >
            {severidad}
            <ChevronDown size={16} />
          </button>

          {open && (
            <div className="absolute w-full mt-2 bg-white rounded-lg border shadow-lg z-50">
              {opciones.map((op) => (
                <button
                  key={op}
                  onClick={() => {
                    setSeveridad(op);
                    setOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left flex justify-between items-center hover:bg-purple-100
                    ${severidad === op ? "bg-purple-200 text-purple-700" : ""}`}
                >
                  {op}
                  {severidad === op && <Check size={16} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* SUBMIT */}
        <button
          onClick={handleSubmit}
          className="mt-5 w-full bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition"
        >
          Agregar Frase
        </button>

      </div>
    </div>
  );
}
