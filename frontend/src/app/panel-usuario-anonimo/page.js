"use client";

import Link from "next/link";
import { useState } from "react";
import { MessageCircle, BookOpen, LogOut } from "lucide-react";

import ChatbotView from "../vistas-reutilizables/ChatbotView";
import RecursosView from "../vistas-reutilizables/RecursosView"; 


export default function ChatPage() {
  const [activeView, setActiveView] = useState("chat"); // ← controla la vista

  return (
    <div className="flex flex-col h-screen bg-[#f6f4fb]">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-3 px-6 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-lg font-semibold">MENTALIA</h1>
          <p className="text-sm opacity-80">Plataforma de Apoyo Emocional - SENA</p>
        </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="text-right">
            <p className="font-semibold">Usuario Anónimo</p>
            <p className="text-xs opacity-80">anonimo@mentalia.com</p>
            <p className="text-xs">Sesión Temporal</p>
          </div>

          <button
            onClick={() => {
              sessionStorage.removeItem("chatHistory");
              sessionStorage.removeItem("anonSessionId");
              window.location.href = "/";
            }}
            className="flex items-center text-sm text-white hover:text-gray-200 bg-[#9f67ff] hover:bg-[#8b5cf6] px-3 py-2 rounded-md transition"
          >
            <LogOut size={16} className="mr-1" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-60 bg-white border-r border-gray-200 py-4 px-4 flex flex-col justify-between">
          <nav className="space-y-3">
            {/* Botón del chat */}
            <button
              onClick={() => setActiveView("chat")}
              className={`flex items-center w-full px-3 py-2 text-left text-sm rounded-md
                ${
                  activeView === "chat"
                    ? "text-[#6b21a8] bg-purple-100"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <MessageCircle size={18} className="mr-2" /> Chat de Apoyo
            </button>

            {/* Botón de recursos */}
            <button
              onClick={() => setActiveView("recursos")}
              className={`flex items-center w-full px-3 py-2 text-left text-sm rounded-md
                ${
                  activeView === "recursos"
                    ? "text-[#6b21a8] bg-purple-100"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
            >
              <BookOpen size={18} className="mr-2" /> Recursos y Técnicas
            </button>
          </nav>
        </aside>

        {/* ÁREA PRINCIPAL */}
        <main className="flex-1 flex flex-col p-4 overflow-y-auto">
          {activeView === "chat" && <ChatbotView mode="anonimo" />}
          {activeView === "recursos" && <RecursosView />}
        </main>
      </div>
    </div>
  );
}
