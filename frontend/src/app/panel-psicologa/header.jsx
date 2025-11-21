"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [psicologa, setPsicologa] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const data = localStorage.getItem("user");

    if (!token || !data) {
      return router.push("/login");
    }

    setPsicologa(JSON.parse(data));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <header className="bg-gradient-to-r from-[#7b2cff] to-[#8a3bff] text-white p-4 shadow">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Panel de Psicóloga Institucional</h2>
          <p className="text-sm opacity-80">Monitoreo y gestión del sistema MENTALIA</p>
        </div>

        <div className="flex items-center gap-4">
          {!psicologa ? (
            <div>Cargando...</div>
          ) : (
            <div className="text-right">
              <div className="font-semibold">{psicologa.nombre}</div>
              <div className="text-sm opacity-80">{psicologa.email}</div>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="p-2 rounded-md bg-white/20 hover:bg-white/30 transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
