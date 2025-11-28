"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function GraficaAlertasCriticas() {
  const data = {
    labels: ["Ene", "Feb", "Mar", "Abr", "May"],
    datasets: [
      {
        label: "Alertas Moderadas",
        data: [25, 18, 32, 20, 28],
        borderColor: "#fbbf24",
        backgroundColor: "#fbbf24",
        tension: 0.4,
        pointRadius: 5,
      },
      {
        label: "Alertas Críticas",
        data: [12, 8, 15, 7, 10],
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.4,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" },
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#e5e7eb", borderDash: [5, 5] } },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-72">
      <h3 className="text-gray-700 font-semibold mb-4">Evolución de Alertas Críticas</h3>

      <div className="h-52">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
