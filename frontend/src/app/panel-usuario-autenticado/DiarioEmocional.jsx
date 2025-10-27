import React, { useState } from "react";
import { Plus } from "lucide-react";
import NuevaEntradaModal from "./NuevaEntradaModal";
import EntradaDiario from "./EntradaDiario";
import BuscadorEntradas from "./BuscadorEntradas";
import FiltroEstado from "./FiltroEstado";

export default function DiarioEmocional() {
  const [entradas, setEntradas] = useState([
    {
      id: 1,
      titulo: "Un día de reflexión",
      fecha: "14 de enero de 2024",
      hora: "19:00",
      estado: "Normal 😐",
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
      estado: "Feliz 😄",
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
      estado: "Ansioso 😰",
      color: "bg-purple-100 text-purple-600",
      descripcion:
        "Últimamente he tenido pensamientos que me dificultan dormir. Estoy intentando escribir mis preocupaciones para entenderlas mejor.",
      tags: ["ansiedad", "descanso", "pensamientos"],
    },
    {
      id: 4,
      titulo: "Día complicado",
      fecha: "11 de enero de 2024",
      hora: "18:30",
      estado: "Enojado 😡",
      color: "bg-red-100 text-red-600",
      descripcion:
        "Hoy tuve varios inconvenientes en clase. Me sentí frustrado, pero sé que mañana será mejor.",
      tags: ["frustración", "emociones", "paciencia"],
    },
    {
      id: 5,
      titulo: "Tarde tranquila",
      fecha: "10 de enero de 2024",
      hora: "17:45",
      estado: "Triste 😢",
      color: "bg-blue-100 text-blue-600",
      descripcion:
        "Me sentí un poco solo hoy, pero decidí salir a caminar y despejar mi mente. Me ayudó bastante.",
      tags: ["reflexión", "autoayuda", "emociones"],
    },
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            📖 Diario Emocional
          </h1>
          <p className="text-gray-500">
            Reflexiona sobre tus pensamientos y emociones cada día ✨
          </p>
        </div>

        <button
          onClick={() => setMostrarModal(true)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all"
        >
          <Plus size={18} />
          Nueva entrada
        </button>
      </div>

      {/* Filtros */}
      <div className="flex gap-4 mb-6">
        <BuscadorEntradas />
        <FiltroEstado />
      </div>

      {/* Entradas */}
      <div className="space-y-4">
        {entradas.map((entrada) => (
          <EntradaDiario key={entrada.id} entrada={entrada} />
        ))}
      </div>

      {/* Modal Nueva Entrada */}
      {mostrarModal && <NuevaEntradaModal onClose={() => setMostrarModal(false)} />}
    </div>
  );
}





