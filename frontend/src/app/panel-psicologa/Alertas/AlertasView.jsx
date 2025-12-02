"use client";

import { useEffect, useState } from "react";
import TarjetaAlerta from "./TarjetaAlerta";
import FiltroAlertas from "./FiltroAlertas";
import ModalConversacion from "./ModalConversacion";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AlertasView() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("Todas las alertas");

  // ⭐ CONVERSACIÓN (Modal)
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cargarAlertas = async () => {
    setLoading(true);
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;

      const res = await fetch(`${API_URL}/api/psychologist/alerts`, {
        method: "GET",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) {
        console.error("Error cargando alertas:", res.status, res.statusText);
        setAlertas([]);
        return;
      }

      const data = await res.json();

      const adaptadas = data.map((a) => ({
        id: a._id,
        tipo: a.isCritical ? "CRÍTICA" : "ALTA PRIORIDAD",
        fecha: new Date(a.createdAt).toLocaleString(),
        descripcion: a.message,
      sesion: a.conversationId || a.sessionId || "N/A",
        estado:
          a.resolved || a.status === "atendida" ? "atendida" : "pendiente",
      }));

      setAlertas(adaptadas);
    } catch (err) {
      console.error("Error cargando alertas:", err);
      setAlertas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarAlertas();
  }, []);

  const alertasFiltradas = alertas.filter((a) => {
    if (filtro === "Todas las alertas") return true;
    if (filtro === "Críticas") return a.tipo === "CRÍTICA";
    if (filtro === "Alta prioridad") return a.tipo === "ALTA PRIORIDAD";
    return true;
  });

  // ⭐ FUNCIÓN PARA VER CONVERSACIÓN
  const verConversacion = async (alertId) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_URL}/api/psychologist/alerts/${alertId}/conversation`,
        {
          headers: {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      if (!res.ok) {
        console.error("Error obteniendo conversación");
        return;
      }

      const data = await res.json();
      setSelectedConversation(data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Error cargando conversación:", err);
    }
  };

  return (
    <div className="w-full mt-2">
      {/* Título + Filtro */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Alertas Críticas
        </h2>

        <FiltroAlertas seleccion={filtro} setSeleccion={setFiltro} />
      </div>

      {loading && (
        <p className="text-gray-500 text-sm">Cargando alertas...</p>
      )}

      {/* Lista */}
      <div className="flex flex-col gap-6">
        {!loading &&
          alertasFiltradas.map((alerta) => (
            <TarjetaAlerta
              key={alerta.id}
              alerta={alerta}
              onAtender={() => verConversacion(alerta.id)}
            />
          ))}
      </div>

      {!loading && alertasFiltradas.length === 0 && (
        <p className="text-gray-500 text-sm mt-4">
          No hay alertas que coincidan con el filtro seleccionado.
        </p>
      )}

      {/* ⭐ MODAL DE CONVERSACIÓN */}
      <ModalConversacion
        open={isModalOpen}
        conversation={selectedConversation}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
