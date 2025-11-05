"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  MessageCircle,
  BookOpen,
  LogOut,
  Lock,
  Send,
  Clock,
} from "lucide-react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "💜 ¡Hola! Soy MENTALIA Bot. Este es un espacio confidencial y seguro para ti. Puedes contarme cómo te sientes, sin juicios.",
      sender: "bot",
      time: new Date().toISOString(),
    },
  ]);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Mensaje del usuario
    const newMessage = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      time: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      const res = await fetch("http://localhost:4000/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // 🔹 Interpretamos la emoción y elegimos un mensaje humano
      // 🧠 Usar directamente la respuesta del backend si existe
let botReply = data.response;

if (!botReply) {
  // Si el backend no devuelve nada, generar respuesta alternativa
  const emotion = data.emotion || "neutral";

  if (data.isCrisis) {
    botReply =
      "⚠️ Lamento mucho que te sientas así. No estás sol@ 💛. Si estás en peligro, contacta la línea 106 (Colombia) o acude al servicio de urgencias más cercano. ¿Quieres que te comparta contactos o recursos ahora?";
  } else {
    switch (emotion) {
      case "tristeza":
        botReply =
          "💜 Lamento que te sientas triste. A veces hablar puede aliviar un poco la carga. Estoy aquí contigo.";
        break;
      case "estrés":
        botReply =
          "😔 Parece que estás pasando por mucho estrés. Respira un momento, aquí puedes desahogarte, te escucho.";
        break;
      case "ansiedad":
        botReply =
          "💭 Entiendo esa sensación de ansiedad, puede ser abrumadora. Estoy aquí para acompañarte, ¿quieres que hablemos de lo que la causa?";
        break;
      case "miedo":
        botReply =
          "😢 Sentir miedo es humano. Cuéntame un poco más si quieres, estoy aquí para escucharte sin juzgar.";
        break;
      case "enojo":
        botReply =
          "😤 A veces la rabia aparece porque algo nos importa. Puedes contarme qué te hizo sentir así, si quieres.";
        break;
      default:
        botReply =
          "💜 Te estoy escuchando. Cuéntame un poco más, lo que sientas que necesitas expresar.";
        break;
    }
  }
}


      const botMessage = {
        id: messages.length + 2,
        text: botReply,
        sender: "bot",
        time: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ Error al conectar con el backend:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: messages.length + 2,
          text: "🚫 No pude conectarme al servidor. Intenta más tarde.",
          sender: "bot",
          time: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const formatTime = (isoTime) => {
    if (typeof window === "undefined") return "";
    const date = new Date(isoTime);
    return date.toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#f6f4fb]">
      {/* HEADER */}
      <header className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white py-3 px-6 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-lg font-semibold">MENTALIA</h1>
          <p className="text-sm opacity-80">
            Plataforma de Apoyo Emocional - SENA
          </p>
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
          <div>
            <nav className="space-y-3">
              <button className="flex items-center w-full px-3 py-2 text-left text-sm text-[#6b21a8] bg-purple-100 rounded-md">
                <MessageCircle size={18} className="mr-2" /> Chat de Apoyo
              </button>
              <button className="flex items-center w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-md">
                <BookOpen size={18} className="mr-2" /> Recursos y Técnicas
              </button>
            </nav>
          </div>
        </aside>

        {/* MAIN CHAT */}
        <main className="flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white p-4 rounded-t-md flex justify-between items-center">
            <div>
              <h3 className="font-semibold">MENTALIA Bot</h3>
              <p className="text-xs">Disponible 24/7</p>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <Clock size={14} /> <span>Sesión temporal</span>
              <Lock size={14} /> <span>Anónimo</span>
            </div>
          </div>

          {/* MENSAJES */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-lg px-4 py-3 rounded-2xl text-sm shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-white"
                      : "bg-purple-100 text-gray-800"
                  }`}
                >
                  {msg.text}
                  <p className="text-[10px] text-gray-400 mt-1 text-right">
                    {formatTime(msg.time)}
                  </p>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Escribe tu mensaje aquí..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#8b5cf6]"
            />
            <button
              onClick={handleSend}
              className="bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] hover:opacity-90 text-white p-2 rounded-full transition"
            >
              <Send size={18} />
            </button>
          </div>

          <p className="text-[11px] text-gray-500 text-center py-1">
            💡 Presiona Enter para enviar · Tu conversación es confidencial
          </p>
        </main>
      </div>
    </div>
  );
}
