"use client";

import Link from "next/link";
import { MessageCircle, BookOpen, LogOut, Lock, Clock } from "lucide-react";
import ChatbotView from "@/vistas-reutilizables/ChatbotView"; // ✅ Importar componente nuevo

export default function ChatPage() {
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
          <Link
            href="/"
            className="flex items-center text-sm text-white hover:text-gray-200 bg-[#9f67ff] hover:bg-[#8b5cf6] px-3 py-2 rounded-md transition"
          >
            <LogOut size={16} className="mr-1" />
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-60 bg-white border-r border-gray-200 py-4 px-4 flex flex-col justify-between">
          <nav className="space-y-3">
            <button className="flex items-center w-full px-3 py-2 text-left text-sm text-[#6b21a8] bg-purple-100 rounded-md">
              <MessageCircle size={18} className="mr-2" /> Chat de Apoyo
            </button>
            <button className="flex items-center w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <BookOpen size={18} className="mr-2" /> Recursos y Técnicas
            </button>
          </nav>
        </aside>

        {/* CHAT PRINCIPAL */}
        <main className="flex-1 flex flex-col p-4">
          <ChatbotView mode="anonimo" /> {/* ✅ Aquí usamos el componente unificado */}
        </main>
      </div>
    </div>
  );
}