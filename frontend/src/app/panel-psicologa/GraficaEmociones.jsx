"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GraficaEmociones() {
  const data = {
    labels: ["Ansiedad", "Estrés", "Tristeza", "Preocupación", "Enojo"],
    datasets: [
      {
        data: [35, 28, 20, 12, 5],
        backgroundColor: [
          "#8A5BFF",
          "#FF4D4D",
          "#4D8DFF",
          "#FFCC66",
          "#66CC66",
        ],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-4 text-center">
        Emociones Más Detectadas
      </h3>

      {/* Contenedor centrado total */}
      <div className="flex justify-center items-center gap-14">

        {/* Gráfica centrada */}
        <div className="w-52 h-52 flex justify-center items-center">
          <Pie data={data} options={options} />
        </div>

        {/* Lista centrada verticalmente */}
        <ul className="space-y-3 text-sm flex flex-col justify-center">
          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: "#8A5BFF" }}></span>
            <span className="font-semibold text-purple-700">Ansiedad:</span> 35%
          </li>

          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: "#FF4D4D" }}></span>
            <span className="font-semibold text-red-600">Estrés:</span> 28%
          </li>

          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: "#4D8DFF" }}></span>
            <span className="font-semibold text-blue-600">Tristeza:</span> 20%
          </li>

          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: "#FFCC66" }}></span>
            <span className="font-semibold text-yellow-600">Preocupación:</span> 12%
          </li>

          <li className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full block" style={{ backgroundColor: "#66CC66" }}></span>
            <span className="font-semibold text-green-600">Enojo:</span> 5%
          </li>
        </ul>

      </div>
    </div>
  );
}


