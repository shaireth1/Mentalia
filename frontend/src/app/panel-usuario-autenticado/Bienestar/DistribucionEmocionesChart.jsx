"use client";

import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DistribucionEmocionesChart() {
  const data = {
    labels: ["Feliz 35%", "Triste 15%", "Enojado 5%", "Normal 20%", "Ansioso 25%"],
    datasets: [
      {
        data: [35, 15, 5, 20, 25],
        backgroundColor: ["#10b981", "#3b82f6", "#ef4444", "#f59e0b", "#8b5cf6"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, 
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.label}`,
        },
      },
    },
  };

  return (
    <div className="h-52"> 
      <Pie data={data} options={options} />
    </div>
  );
}
