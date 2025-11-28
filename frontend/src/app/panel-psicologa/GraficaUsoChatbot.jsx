"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function GraficaUsoChatbot() {
  const data = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        label: "Sesiones",
        data: [45, 55, 38, 80, 50, 30, 25],
        backgroundColor: "#14b8a6",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#e5e7eb", borderDash: [5, 5] } },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80">
      <h3 className="text-gray-700 font-semibold mb-4">Uso Semanal del Chatbot</h3>

      <div className="h-[250px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}


