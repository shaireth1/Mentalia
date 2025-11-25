"use client";

import TarjetaAlerta from "./TarjetaAlerta";
import FiltroAlertas from "./FiltroAlertas";

export default function AlertasView() {
  const alertas = [
    {
      id: 1,
      tipo: "CRÍTICA",
      fecha: "15/1/2024, 10:30:00",
      descripcion: "Usuario expresó pensamientos de autolesión",
      sesion: "user123",
      estado: "pendiente",
    },
    {
      id: 2,
      tipo: "ALTA PRIORIDAD",
      fecha: "15/1/2024, 9:15:00",
      descripcion: "Múltiples expresiones de desesperanza detectadas",
      sesion: "user456",
      estado: "atendida",
    },
  ];

  return (
    <div className="w-full mt-2">

      {/* Título + Filtro alineados */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Alertas Críticas
        </h2>
        <FiltroAlertas />
      </div>

      {/* Lista de alertas */}
      <div className="flex flex-col gap-6">
        {alertas.map((alerta) => (
          <TarjetaAlerta key={alerta.id} alerta={alerta} />
        ))}
      </div>
    </div>
  );
}


