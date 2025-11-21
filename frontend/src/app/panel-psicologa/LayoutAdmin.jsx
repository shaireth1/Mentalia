"use client";

import { LogOut, Heart, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LayoutAdmin({ user, children, onShowSettings }) {
  const router = useRouter();

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="h-screen flex flex-col bg-[#f6f4fb]">
      {/* HEADER */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <Heart className="w-6 h-6" />
          <div>
            <h1 className="font-semibold text-sm tracking-wide">MENTALIA</h1>
            <p className="text-xs opacity-80">Plataforma de Apoyo Emocional – SENA</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="font-semibold text-sm">{user.nombre}</p>
            <p className="opacity-90 text-xs">{user.email}</p>
            <p className="opacity-80 text-xs">Psicóloga Institucional</p>
          </div>

          <button onClick={logout} className="p-2 rounded hover:bg-white/20 transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-60 bg-white shadow-md border-r p-6">
          <nav className="space-y-4">
            <p className="font-semibold text-gray-700">Panel Administrativo</p>

            <button
              onClick={onShowSettings}
              className="flex items-center gap-2 w-full text-gray-600 hover:text-purple-600"
            >
              <Settings className="w-4 h-4" /> Configuración
            </button>
          </nav>
        </aside>

        {/* CONTENIDO */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}



