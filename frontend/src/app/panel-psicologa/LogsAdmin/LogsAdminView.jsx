"use client";

import { useState, useEffect } from "react";
import TarjetaLog from "./TarjetaLog";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LogsAdminView() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const cargarLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/admin/logs`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error("Error cargando logs:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    cargarLogs();
  }, []);

  return (
    <div className="w-full mt-4">
      <h2 className="text-xl font-semibold text-gray-800">
        Registro de Actividad Administrativa
      </h2>
      <p className="text-gray-500 text-sm mb-4">
        Auditoría de cambios realizados en el sistema
      </p>

      {loading && <p>Cargando...</p>}

      <div className="flex flex-col gap-4">
        {!loading &&
          logs.map((log) => <TarjetaLog key={log._id} log={log} />)}
      </div>
    </div>
  );
}
