"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import LayoutAdmin from "./LayoutAdmin";
import AlertaCritica from "./AlertaCritica";
import DashboardTabs from "./DashboardTabs";
import EstadisticasCards from "./EstadisticasCards";
import GraficaUsoChatbot from "./GraficaUsoChatbot";
import GraficaEmociones from "./GraficaEmociones";

import SettingsView from "../vistas-reutilizables/SettingsView";

export default function PanelPsicologa() {
  const router = useRouter();
  const [storedUser, setStoredUser] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    if (!rawUser) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(rawUser);

      if (user?.rol !== "admin") {
        router.replace("/dashboard");
        return;
      }

      setStoredUser(user);
    } catch {
      router.replace("/login");
    }
  }, []);

  if (!storedUser) return null;

  return (
    <LayoutAdmin 
      user={storedUser}
      onChangeView={(view) => setActiveTab(view)} 
      activeView={activeTab} // Aquí pasamos la pestaña activa para el sidebar
    >
      {/* SI ESTAMOS EN AJUSTES → mostrar SOLO SettingsView */}
      {activeTab === "Ajustes" ? (
        <div className="px-6 mt-6">
          <SettingsView />
        </div>
      ) : (
        <>
          {/* ALERTA */}
          <div className="p-4">
            <AlertaCritica cantidad={1} />
          </div>

          {/* TÍTULO */}
          <div className="px-6 mt-3">
            <h1 className="text-2xl font-semibold text-gray-900">
              Panel de Psicóloga Institucional
            </h1>
            <p className="text-gray-500">
              Monitoreo y gestión de la plataforma MENTALIA
            </p>
          </div>

          {/* TABS */}
          <div className="mt-6 px-6">
            <DashboardTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              includeSettings={true}
            />
          </div>

          {/* CONTENIDO SEGÚN TAB */}
          <main className="px-6 mt-4 pb-10">
            {activeTab === "Dashboard" && (
              <>
                <EstadisticasCards />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <GraficaUsoChatbot />
                  <GraficaEmociones />
                </div>
              </>
            )}

            {activeTab === "Alertas" && (
              <div className="p-6 text-gray-700">Aquí irán las alertas…</div>
            )}

            {activeTab === "Frases de Riesgo" && (
              <div className="p-6 text-gray-700">Vista de frases de riesgo…</div>
            )}

            {activeTab === "Contenido" && (
              <div className="p-6 text-gray-700">Gestión de contenido…</div>
            )}

            {activeTab === "Exportaciones" && (
              <div className="p-6 text-gray-700">Exportaciones e informes…</div>
            )}
          </main>
        </>
      )}
    </LayoutAdmin>
  );
}

