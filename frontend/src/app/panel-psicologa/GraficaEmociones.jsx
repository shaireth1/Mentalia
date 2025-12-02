"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function GraficaEmociones() {
  const [emociones, setEmociones] = useState(null);

  const cargarStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/psychologist/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setEmociones(data.emotions || []);
    } catch (err) {
      console.error("Error cargando emociones:", err);
    }
  };

  useEffect(() => {
    cargarStats();
  }, []);

  if (!emociones) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <p className="text-gray-500">Cargando emociones…</p>
      </div>
    );
  }

  const labels = emociones.map((e) => e._id);
  const values = emociones.map((e) => e.total);

  const backgroundColors = [
    "#8A5BFF",
    "#FF4D4D",
    "#4D8DFF",
    "#FFCC66",
    "#66CC66",
    "#FF88AA",
    "#00C2FF",
  ];

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: backgroundColors.slice(0, labels.length),
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

      <div className="flex justify-center items-center gap-14">
        <div className="w-52 h-52 flex justify-center items-center">
          <Pie data={data} options={options} />
        </div>

        <ul className="space-y-3 text-sm flex flex-col justify-center">
          {labels.map((label, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full block"
                style={{ backgroundColor: backgroundColors[i] }}
              ></span>
              <span className="font-semibold text-gray-700">
                {label}:
              </span>{" "}
              {values[i]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
