"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Heart,
  LogOut,
  Calendar,
  BarChart,
  BookOpen,
  Coffee,
  Bot,
  Notebook,
  TrendingUp,
} from "lucide-react";

import SettingsView from "./SettingsView";
import DiarioEmocional from "./DiarioEmocional";
import ChatbotView from "../vistas-reutilizables/ChatbotView";
import RecursosView from "../vistas-reutilizables/RecursosView";

export default function Dashboard() {
  const [selectedMood, setSelectedMood] = useState("");
  const [activeView, setActiveView] = useState("Inicio");
  const [storedUser, setStoredUser] = useState(null);

  const router = useRouter();

  // 🔹 Cargar usuario desde localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userData = JSON.parse(localStorage.getItem("user"));
      setStoredUser(userData);
    }
  }, []);

  // ------------------------------------------------------------
  // 🔥 RNF2: DETECTAR EXPIRACIÓN AUTOMÁTICA DE SESIÓN
  // ------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // 🔁 Ping pasivo cada 20 segundos
    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:4000/api/sessions/ping", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        // Código 440 = Sesión expirada por inactividad
        if (res.status === 440 || res.status === 401) {
          alert("Tu sesión expiró por inactividad.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/login");
        }
      } catch (err) {
        console.log("Error verificando sesión:", err);
      }
    }, 180000); // 20 segundos

    return () => clearInterval(interval);
  }, [router]);

  // ------------------------------------------------------------

  const moods = [
    { name: "Feliz", color: "bg-green-100 border-green-400 text-green-700" },
    { name: "Normal", color: "bg-yellow-100 border-yellow-400 text-yellow-700" },
    { name: "Triste", color: "bg-blue-100 border-blue-400 text-blue-700" },
    { name: "Ansioso", color: "bg-purple-100 border-purple-400 text-purple-700" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const sidebarItems = [
    "Inicio",
    "Chatbot",
    "Mi Bienestar",
    "Diario Emocional",
    "Recursos",
    "Ajustes",
  ];

  return (
    <div className="flex h-screen bg-[#f6f4fb] text-gray-800 flex-col">
      {/* 🔹 HEADER */}
      <header className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white flex justify-between items-center px-8 py-4 shadow-md">
        <div className="flex items-center space-x-3">
          <Heart className="w-6 h-6 text-white" />
          <div>
            <h1 className="font-semibold text-base tracking-wide">MENTALIA</h1>
            <p className="text-xs opacity-80">
              Plataforma de Apoyo Emocional - SENA
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-sm">
          <div className="text-right">
            <p className="font-semibold leading-tight">
              {storedUser?.nombre || "Usuario"}
            </p>
            <p className="text-xs opacity-80">
              {storedUser?.email || "correo@ejemplo.com"}
            </p>
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

      <div className="flex flex-1 overflow-hidden">
        {/* 🔹 SIDEBAR */}
        <aside className="w-60 bg-white shadow-md flex flex-col p-4">
          <nav className="space-y-3">
            {sidebarItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveView(item)}
                className={`w-full text-left px-4 py-2 rounded-lg transition ${
                  activeView === item
                    ? "bg-purple-100 text-purple-700 font-medium"
                    : "hover:bg-purple-50"
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </aside>

        {/* 🔹 CONTENIDO PRINCIPAL */}
        <main className="flex-1 p-6 overflow-y-auto">
          {activeView === "Ajustes" && <SettingsView />}
          {activeView === "Diario Emocional" && <DiarioEmocional />}
          {activeView === "Recursos" && <RecursosView />}
          {activeView === "Chatbot" && <ChatbotView mode="autenticado" />}

          {/* 🔹 VISTA DE INICIO */}
          {activeView === "Inicio" && (
            <>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">
                    ¡Hola, {storedUser?.nombre?.split(" ")[0] || "Usuario"}! 👋
                  </h1>
                  <p>
                    ¿Cómo te sientes hoy? Tu bienestar emocional es importante para nosotros.
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

              {/* Selector de estado */}
              <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  ¿Cómo te sientes hoy?
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
                    Gracias por compartir cómo te sientes. Tu estado emocional ha sido registrado.
                  </div>
                )}
              </div>

              {/* Semana emocional + recordatorios */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Semana emocional */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-green-600" />
                    Tu semana emocional
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
                      <li key={day} className="flex items-center justify-between text-sm">
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
                </div>

                {/* Recordatorios */}
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-yellow-500" />
                    Recordatorios
                  </h3>
                  <ul className="space-y-3 text-sm">
                    <li className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-center gap-2">
                      <Coffee className="h-4 w-4 text-yellow-600" />
                      <span>
                        <span className="font-medium text-yellow-700">Rutina matutina:</span>{" "}
                        Tómate 5 minutos para respirar profundamente.
                      </span>
                    </li>
                    <li className="bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center gap-2">
                      <Notebook className="h-4 w-4 text-blue-600" />
                      <span>
                        <span className="font-medium text-blue-700">Diario emocional:</span>{" "}
                        Escribe sobre tu día antes de dormir.
                      </span>
                    </li>
                    <li className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center gap-2">
                      <Heart className="h-4 w-4 text-green-600" />
                      <span>
                        <span className="font-medium text-green-700">Autocuidado:</span>{" "}
                        Recuerda hidratarte y tomar descansos.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Acciones rápidas */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-700 mb-4">Acciones rápidas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveView("Chatbot")}
                    className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-purple-500 hover:bg-purple-50 transition text-left"
                  >
                    <p className="font-medium text-purple-700 flex items-center gap-2">
                      <Bot className="h-4 w-4 text-purple-600" /> Hablar con MENTALIA Bot
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Conversa con nuestro asistente de apoyo emocional 24/7.
                    </p>
                  </button>

                  <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-green-500 hover:bg-green-50 transition">
                    <p className="font-medium text-green-700 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" /> Ver mi progreso
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Revisa tu evolución emocional de esta semana.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveView("Diario Emocional")}
                    className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-blue-500 hover:bg-blue-50 transition text-left"
                  >
                    <p className="font-medium text-blue-700 flex items-center gap-2">
                      <Notebook className="h-4 w-4 text-blue-600" /> Escribir en mi diario
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Reflexiona sobre tus pensamientos y emociones.
                    </p>
                  </button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
