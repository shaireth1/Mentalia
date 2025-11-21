"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
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
          "#8a5bff",
          "#ff4d4d",
          "#4d8dff",
          "#ffcc66",
          "#66cc66",
        ],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="font-semibold text-gray-700 mb-4">Emociones Más Detectadas</h3>

      <div className="flex gap-8 items-center">
        <Pie data={data} />
        
        <ul className="text-sm space-y-1">
          <li><span className="font-semibold text-purple-700">Ansiedad:</span> 35%</li>
          <li><span className="font-semibold text-red-600">Estrés:</span> 28%</li>
          <li><span className="font-semibold text-blue-600">Tristeza:</span> 20%</li>
          <li><span className="font-semibold text-yellow-600">Preocupación:</span> 12%</li>
          <li><span className="font-semibold text-green-600">Enojo:</span> 5%</li>
        </ul>
      </div>
    </div>
  );
}
