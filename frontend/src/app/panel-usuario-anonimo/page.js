"use client";

import { useState } from "react";
import { MessageCircle, BookOpen, LogOut, Menu } from "lucide-react";

import ChatbotView from "../vistas_reutilizables/ChatbotView";
import RecursosView from "../vistas_reutilizables/RecursosView";

export default function ChatPage() {
  const [activeView, setActiveView] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#f6f4fb]">

      {/* HEADER RESPONSIVO */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center px-6 py-4 shadow-md">

        {/* MENU MOBILE */}
        <button
          className="md:hidden block"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>

        {/* LOGO + TITULO */}
        <div className="flex items-center gap-2">
          <img
            src="/mentalialogo.png.png"
            alt="Logo Mentalia"
            className="w-7 h-7 object-contain"
          />
          <div className="leading-tight hidden sm:block">
            <h1 className="text-base font-semibold tracking-wide">MENTALIA</h1>
            <p className="text-xs opacity-90">
              Plataforma de Apoyo Emocional - SENA
            </p>
          </div>
        </div>

        {/* USUARIO ANÓNIMO */}
        <div className="flex items-center space-x-4 text-xs">
          <div className="text-right leading-tight hidden sm:block">
            <p className="font-semibold text-sm">Usuario Anónimo</p>
            <p className="opacity-90">anonimo@mentalia.com</p>
            <p>Sesión Temporal</p>
          </div>

          {/* LOGOUT */}
          <button
            onClick={() => {
              sessionStorage.removeItem("chatHistory");
              sessionStorage.removeItem("anonSessionId");
              window.location.href = "/";
            }}
            className="flex items-center text-white bg-[#9f67ff] hover:bg-[#8b5cf6] px-3 py-2 rounded-md transition text-xs"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">

        {/* SIDEBAR RESPONSIVA */}
        <aside
          className={`
            bg-white border-r border-gray-200 py-4 px-4 flex flex-col justify-between
            w-60 z-20 h-full fixed md:static transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <nav className="space-y-3">

            {/* Botón Chat */}
            <button
              onClick={() => {
                setActiveView("chat");
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full px-3 py-2 text-left text-sm rounded-md ${
                activeView === "chat"
                  ? "text-[#6b21a8] bg-purple-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <MessageCircle size={18} className="mr-2" /> Chat de Apoyo
            </button>

            {/* Botón Recursos */}
            <button
              onClick={() => {
                setActiveView("recursos");
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full px-3 py-2 text-left text-sm rounded-md ${
                activeView === "recursos"
                  ? "text-[#6b21a8] bg-purple-100"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BookOpen size={18} className="mr-2" /> Recursos y Técnicas
            </button>

          </nav>
        </aside>

        {/* CAPA PARA CERRAR EL MENÚ EN MÓVIL */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-10 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 flex flex-col p-4 overflow-y-auto">
          {activeView === "chat" && <ChatbotView mode="anonimo" />}
          {activeView === "recursos" && <RecursosView />}
        </main>

      </div>
    </div>
  );
}