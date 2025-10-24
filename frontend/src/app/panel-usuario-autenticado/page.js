"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  Eye,
  ArrowLeft,
  Heart,
  Home,
  MessageCircle,
  BarChart2,
  BookOpen,
  Folder,
  Settings,
  Smile,
  Meh,
  Frown,
  Zap,
  Bell,
} from "lucide-react";

export default function Page() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedEmotion, setSelectedEmotion] = useState(null);

  // Simulación: si no hay usuario en localStorage, crear uno
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      const fakeUser = {
        nombre: "Usuario",
        email: "shairethbenavidez@gmail.com",
      };
      localStorage.setItem("user", JSON.stringify(fakeUser));
      setUser(fakeUser);
      localStorage.setItem("token", "fake-token");
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch {
      localStorage.removeItem("user");
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    router.push("/"); // vuelve a home
  };

  const emociones = [
    { id: "feliz", label: "Feliz", icon: <Smile size={20} /> },
    { id: "normal", label: "Normal", icon: <Meh size={20} /> },
    { id: "triste", label: "Triste", icon: <Frown size={20} /> },
    { id: "ansioso", label: "Ansioso", icon: <Heart size={20} /> },
  ];

  // Simulación de semana emocional: valores 0-5 (mostramos barras)
  const semana = [
    { dia: "Lun", valor: 4 },
    { dia: "Mar", valor: 3 },
    { dia: "Mié", valor: 5 },
    { dia: "Jue", valor: 2 },
    { dia: "Vie", valor: 4 },
    { dia: "Sáb", valor: 5 },
    { dia: "Dom", valor: 3 },
  ];

  const recordatorios = [
    { titulo: "Rutina matutina", texto: "Tómate 5 minutos para respirar profundamente", color: "yellow" },
    { titulo: "Diario emocional", texto: "Escribe sobre tu día antes de dormir", color: "blue" },
    { titulo: "Autocuidado", texto: "Recuerda hidratarte y tomar descansos", color: "green" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="flex">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-fuchsia-500 flex items-center justify-center text-white">
              <Heart size={18} />
            </div>
            <div>
              <div className="font-semibold text-purple-700 text-lg">MENTALIA</div>
              <div className="text-xs text-gray-400">Plataforma de Apoyo Emocional - SENA</div>
            </div>
          </div>

          <nav className="space-y-2">
            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 text-purple-700">
              <Home size={18} /> <span>Inicio</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              <MessageCircle size={18} /> <span>Chatbot</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              <BarChart2 size={18} /> <span>Mi Bienestar</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              <BookOpen size={18} /> <span>Diario Emocional</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              <Folder size={18} /> <span>Recursos</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100">
              <Settings size={18} /> <span>Ajustes</span>
            </Link>
          </nav>
        </aside>

        {/* MAIN */}
        <div className="flex-1 p-6">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl p-6 flex justify-between items-center shadow">
            <div>
              <h1 className="text-3xl font-bold">¡Hola, {user.nombre || "Usuario"}! <span className="inline-block ml-2">👋</span></h1>
              <p className="mt-2 opacity-90">¿Cómo te sientes hoy? Tu bienestar emocional es importante para nosotros.</p>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block">
                <Image
                    src="/fotoinicio.jfif"
                    alt="Foto de inicio"
                    width={1400}
                    height={900}
                    className="w-full h-full object-cover"
                    />

              </div>

              <div className="text-right">
                <div className="text-sm opacity-80">Usuario</div>
                <div className="text-xs opacity-80">{user.email}</div>
                <button
                  onClick={handleLogout}
                  className="ml-4 mt-3 bg-white/20 text-white px-3 py-1 rounded-md hover:bg-white/30 transition"
                >
                  Salir
                </button>
              </div>
            </div>
          </div>

          {/* EMOTIONS */}
          <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border">
            <h2 className="font-medium mb-4 flex items-center gap-2"><Zap size={18} /> ¿Cómo te sientes hoy?</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {emociones.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setSelectedEmotion(e.id)}
                  className={`border rounded-xl p-6 text-center hover:shadow ${selectedEmotion === e.id ? "bg-purple-50 border-purple-300" : "bg-white"}`}
                >
                  <div className="flex justify-center text-purple-600 mb-2">{e.icon}</div>
                  <div className="font-medium">{e.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* WEEK + REMINDERS */}
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            {/* WEEK */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><BarChart2 size={18} /> Tu semana emocional</h3>
              <ul className="space-y-3">
                {semana.map((d) => {
                  const pct = (d.valor / 5) * 100;
                  return (
                    <li key={d.dia} className="flex items-center gap-3">
                      <div className="w-12 text-sm font-medium">{d.dia}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-3 relative">
                        <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-3 rounded-full" style={{ width: `${pct}%` }}></div>
                      </div>
                      <div className="w-10 text-sm text-gray-500 text-right">{d.valor}/5</div>
                    </li>
                  );
                })}
              </ul>
              <p className="text-sm text-gray-500 mt-4">💡 Tip: Registra tu estado emocional diariamente para un mejor seguimiento.</p>
            </div>

            {/* REMINDERS */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><Bell size={18} /> Recordatorios</h3>
              <div className="space-y-3">
                {recordatorios.map((r) => (
                  <div key={r.titulo} className="flex items-center gap-4 p-3 rounded-lg border">
                    <div className={`w-2.5 h-8 rounded-l-md ${r.color === "yellow" ? "bg-yellow-300" : r.color === "blue" ? "bg-sky-300" : "bg-green-300"}`} />
                    <div>
                      <div className="font-medium">{r.titulo}: <span className="font-normal text-gray-600">{r.texto}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Acciones rápidas</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <div className="font-medium">Hablar con MENTALIA Bot</div>
                  <div className="text-sm text-gray-500">Conversa con nuestro asistente de apoyo emocional 24/7</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                  <BarChart2 size={20} />
                </div>
                <div>
                  <div className="font-medium">Ver mi progreso</div>
                  <div className="text-sm text-gray-500">Revisa tu evolución emocional de esta semana</div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                  <BookOpen size={20} />
                </div>
                <div>
                  <div className="font-medium">Escribir en mi diario</div>
                  <div className="text-sm text-gray-500">Reflexiona sobre tus pensamientos y emociones</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}



