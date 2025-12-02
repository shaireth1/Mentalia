"use client";

export default function TarjetaAlerta({ alerta, onAtender, onDescartar }) {
  const estilos = {
    CRÍTICA: {
      borde: "border-l-4 border-[#FF4D4D]",
      badgeBg: "bg-[#FFEAEA]",
      badgeText: "text-[#C53030]",
    },
    "ALTA PRIORIDAD": {
      borde: "border-l-4 border-[#FFAA33]",
      badgeBg: "bg-[#FFF3E0]",
      badgeText: "text-[#B46900]",
    },
  };

  const s = estilos[alerta.tipo] || {};

  return (
    <div
      className={`
        w-full bg-white rounded-lg shadow-sm
        border border-gray-200
        ${s.borde || ""}
        px-5 py-4
      `}
    >
      {/* ENCABEZADO */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full ${s.badgeBg} ${s.badgeText}`}
          >
            {alerta.tipo}
          </span>

          <span className="text-gray-600 text-xs md:text-sm">
            {alerta.fecha}
          </span>

          {alerta.estado === "atendida" && (
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#DFF6E3] text-[#2F8F3A]">
              ATENDIDA
            </span>
          )}
        </div>

        {alerta.estado !== "atendida" && (
          <div className="flex gap-3">
            <button
              onClick={onAtender}
              className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
            >
              Atender
            </button>

            <button
              onClick={onDescartar}
              className="px-4 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-100 transition"
            >
              Descartar
            </button>
          </div>
        )}
      </div>

      <p className="mt-2 text-gray-800 text-sm font-medium">
        {alerta.descripcion}
      </p>

      <p className="text-gray-400 text-xs mt-1">
        ID de sesión: {alerta.sesion}
      </p>
    </div>
  );
}
