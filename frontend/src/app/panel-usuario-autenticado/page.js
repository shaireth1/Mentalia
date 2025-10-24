"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Heart, LogOut } from "lucide-react";

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState("");
  const router = useRouter();

  const moods = [
    { name: "Feliz", color: "bg-green-100 border-green-400 text-green-700" },
    { name: "Normal", color: "bg-yellow-100 border-yellow-400 text-yellow-700" },
    { name: "Triste", color: "bg-blue-100 border-blue-400 text-blue-700" },
    { name: "Ansioso", color: "bg-purple-100 border-purple-400 text-purple-700" },
  ];

  const handleLogout = () => {
    // Aquí podrías limpiar tokens o estado si lo tuvieras
    router.push("/"); // Redirige a app/page.js
  };

  return (
    <div className="flex h-screen bg-[#f6f4fb] text-gray-800 flex-col">
      {/* 🔹 Barra superior global */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center px-8 py-4 shadow-md">
        {/* Izquierda */}
        <div className="flex items-center space-x-3">
          <Heart className="w-6 h-6 text-white" />
          <div>
            <h1 className="font-semibold text-base tracking-wide">MENTALIA</h1>
            <p className="text-xs opacity-80">
              Plataforma de Apoyo Emocional - SENA
            </p>
          </div>
        </div>

        {/* Derecha */}
        <div className="flex items-center space-x-3 text-sm">
          <div className="text-right">
            <p className="font-semibold leading-tight">Usuario</p>
            <p className="text-xs opacity-80">shairethbenavidez@gmail.com</p>
          </div>
          <button
            title="Cerrar sesión"
            className="p-2 rounded hover:bg-white/20 transition-colors"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5 text-white" />
          </button>
        </div>
      </header>

      {/* 🔹 Contenedor principal (sidebar + contenido) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-white shadow-md flex flex-col p-4">
          <nav className="space-y-3">
            {[
              "Inicio",
              "Chatbot",
              "Mi Bienestar",
              "Diario Emocional",
              "Recursos",
              "Ajustes",
            ].map((item, i) => (
              <button
                key={i}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  item === "Inicio"
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "hover:bg-purple-50"
                } transition`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Welcome Card */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-2">¡Hola, Usuario! 👋</h1>
              <p>
                ¿Cómo te sientes hoy? Tu bienestar emocional es importante para
                nosotros.
              </p>
            </div>
            <Image
              src="/foto-inicio.jpg"
              alt="foto"
              width={280}
              height={160}
              className="rounded-xl object-cover"
            />
          </div>

          {/* Mood Selection */}
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-purple-600">📅</span> ¿Cómo te sientes hoy?
            </h3>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {moods.map((mood) => (
                <button
                  key={mood.name}
                  onClick={() => setSelectedMood(mood.name)}
                  className={`border rounded-xl py-3 text-center font-medium transition-all ${
                    selectedMood === mood.name
                      ? `${mood.color} border-2`
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {mood.name}
                </button>
              ))}
            </div>
            {selectedMood && (
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-purple-700 text-sm flex items-center gap-2">
                <span className="text-lg">✨</span>
                Gracias por compartir cómo te sientes. Tu estado emocional ha
                sido registrado.
              </div>
            )}
          </div>

          {/* Emotional Week and Reminders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Semana emocional */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">
                📈 Tu semana emocional
              </h3>
              <ul className="space-y-2">
                {[
                  { day: "Lun", val: 4 },
                  { day: "Mar", val: 3 },
                  { day: "Mié", val: 5 },
                  { day: "Jue", val: 2 },
                  { day: "Vie", val: 4 },
                  { day: "Sáb", val: 5 },
                  { day: "Dom", val: 3 },
                ].map(({ day, val }) => (
                  <li
                    key={day}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{day}</span>
                    <div className="flex-1 mx-2 bg-purple-100 h-2 rounded-full">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(val / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600">{val}/5</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-gray-500">
                💡 Tip: Registra tu estado emocional diariamente para un mejor
                seguimiento.
              </p>
            </div>

            {/* Recordatorios */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4">
                🔔 Recordatorios
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                  <span className="font-medium text-yellow-700">
                    🌅 Rutina matutina:
                  </span>{" "}
                  Tómate 5 minutos para respirar profundamente
                </li>
                <li className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <span className="font-medium text-blue-700">
                    📘 Diario emocional:
                  </span>{" "}
                  Escribe sobre tu día antes de dormir
                </li>
                <li className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <span className="font-medium text-green-700">
                    💧 Autocuidado:
                  </span>{" "}
                  Recuerda hidratarte y tomar descansos
                </li>
              </ul>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-4">
              Acciones rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500 hover:bg-purple-50 transition">
                <p className="font-medium text-purple-700 flex items-center gap-2">
                  💬 Hablar con MENTALIA Bot
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Conversa con nuestro asistente de apoyo emocional 24/7
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 hover:bg-green-50 transition">
                <p className="font-medium text-green-700 flex items-center gap-2">
                  📊 Ver mi progreso
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Revisa tu evolución emocional de esta semana
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 hover:bg-blue-50 transition">
                <p className="font-medium text-blue-700 flex items-center gap-2">
                  📝 Escribir en mi diario
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Reflexiona sobre tus pensamientos y emociones
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}








