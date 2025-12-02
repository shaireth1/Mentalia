"use client";

import { useEffect, useState } from "react";
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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function GraficaAlertasCriticas() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/api/psychologist/stats/dashboard`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Error cargando stats dashboard");

        const data = await res.json();
        setChartData({
          labels: data.months,
          moderate: data.alerts?.moderate || [],
          critical: data.alerts?.critical || []
        });
      } catch (err) {
        console.error("Error cargando gráfico alertas:", err);
      }
    };

    cargar();
  }, []);

  if (!chartData) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-72">
        <p className="text-gray-500 text-sm">Cargando evolución de alertas…</p>
      </div>
    );
  }

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: "Alertas Moderadas",
        data: chartData.moderate,
        borderColor: "#fbbf24",
        backgroundColor: "#fbbf24",
        tension: 0.4,
        pointRadius: 4
      },
      {
        label: "Alertas Críticas",
        data: chartData.critical,
        borderColor: "#ef4444",
        backgroundColor: "#ef4444",
        tension: 0.4,
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: "#e5e7eb", borderDash: [5, 5] } }
    }
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
