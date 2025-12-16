"use client";

import { useState } from "react";
import { LogOut, Settings, BarChart3, Search, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LayoutAdmin({
  user,
  children,
  onChangeView,
  activeView,
}) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const menuItems = [
    {
      key: "Dashboard",
      label: "Panel Administrativo",
      icon: BarChart3,
    },
    {
      key: "Ajustes",
      label: "Configuración",
      icon: Settings,
    },
    {
      key: "Busqueda",
      label: "Búsqueda de conversaciones",
      icon: Search,
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#f6f4fb]">
      {/* ================= HEADER ================= */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 md:px-8 py-4 shadow-md flex justify-between items-center">
        {/* ☰ Hamburguesa móvil */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-white/20"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* LOGO */}
        <div className="flex items-center gap-3">
          <img
            src="/mentalialogo.png.png"
            alt="Logo Mentalia"
            className="w-8 h-8 object-contain"
          />
          <div className="leading-tight hidden sm:block">
            <h1 className="font-semibold text-sm tracking-wide">MENTALIA</h1>
            <p className="text-xs opacity-80">
              Plataforma de Apoyo Emocional – SENA
            </p>
          </div>
        </div>

        {/* USUARIO */}
        <div className="flex items-center gap-3 text-sm">
          <div className="hidden md:block text-right leading-tight">
            <p className="font-semibold">{user?.nombre}</p>
            <p className="text-xs opacity-80">{user?.email}</p>
            <p className="text-xs opacity-80">Psicóloga Institucional</p>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded hover:bg-white/20 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* ================= BODY ================= */}
      <div className="flex flex-1 overflow-hidden">
        {/* ===== SIDEBAR DESKTOP ===== */}
        <aside className="hidden md:flex w-60 bg-white shadow-md border-r p-6 flex-col shrink-0">
          <nav className="space-y-3">
            {menuItems.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => onChangeView(key)}
                className={`flex items-center gap-3 px-3 py-2 w-full rounded-md transition
                  ${
                    activeView === key
                      ? "bg-purple-100 text-purple-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                  }`}
              >
                <Icon
                  size={18}
                  className={
                    activeView === key ? "text-purple-600" : "text-gray-500"
                  }
                />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* ===== MENÚ MÓVIL (OVERLAY) ===== */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
            <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl p-5 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <span className="font-semibold text-purple-700">Menú</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-3">
                {menuItems.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => {
                      onChangeView(key);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2 w-full rounded-md transition
                      ${
                        activeView === key
                          ? "bg-purple-100 text-purple-600 font-medium"
                          : "text-gray-700 hover:bg-gray-100 hover:text-purple-600"
                      }`}
                  >
                    <Icon
                      size={18}
                      className={
                        activeView === key
                          ? "text-purple-600"
                          : "text-gray-500"
                      }
                    />
                    <span className="text-sm">{label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* ===== CONTENIDO ===== */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}