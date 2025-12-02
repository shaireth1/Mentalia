"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function GraficaUsoChatbot() {
  const [uso, setUso] = useState(null);

  const cargarStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/psychologist/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setUso(data.chatbotUsage || 0);
    } catch (err) {
      console.error("Error cargando uso del chatbot:", err);
    }
  };

  useEffect(() => {
    cargarStats();
  }, []);

  if (uso === null) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-80">
        <p className="text-gray-500">Cargando gráfica…</p>
      </div>
    );
  }

  const data = {
    labels: ["Total Conversaciones"],
    datasets: [
      {
        label: "Conversaciones",
        data: [uso],
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
      <h3 className="text-gray-700 font-semibold mb-4">
        Uso Total del Chatbot
      </h3>

      <div className="h-[250px]">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
