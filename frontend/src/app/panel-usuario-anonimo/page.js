"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

export default function Page() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "¡Hola! Soy MENTALIA Bot. Te doy la bienvenida a este espacio seguro y confidencial. Como usuario anónimo, puedes conversar conmigo libremente. Tu conversación solo estará disponible durante esta sesión. ¿Cómo te sientes en este momento?",
      time: "13:31",
    },
  ]);

  const [input, setInput] = useState("");
  const [sessionActive] = useState(true);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessages = [
      ...messages,
      { sender: "user", text: input, time: "13:32" },
    ];

    setMessages(newMessages);
    setInput("");

    // Respuesta simulada del bot
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Tus sentimientos son importantes y merecen ser escuchados. ¿Te gustaría contarme más detalles sobre cómo te sientes?",
          time: "13:32",
        },
      ]);
    }, 800);
  };

  return (
    <div className="flex h-screen bg-[#f6f4fb] text-gray-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
          <Heart className="w-5 h-5 text-purple-600" />
          <h1 className="font-semibold text-purple-700">MENTALIA</h1>
        </div>

        <nav className="flex flex-col mt-4">
          <button className="px-6 py-2 text-left text-purple-700 bg-purple-50 font-medium rounded-r-full border-l-4 border-purple-500">
            Chat de Apoyo
          </button>
          <button className="px-6 py-2 text-left text-gray-700 hover:bg-purple-50 transition">
            Recursos y Técnicas
          </button>
        </nav>
      </aside>

      {/* Main Chat Section */}
      <main className="flex-1 flex flex-col bg-white rounded-tl-2xl shadow-inner">
        {/* Header */}
        <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 flex justify-between items-center rounded-tl-2xl">
          <div className="flex items-center gap-3">
            <Heart className="w-6 h-6" />
            <div>
              <h2 className="font-semibold text-base tracking-wide">
                MENTALIA Bot
              </h2>
              <p className="text-xs opacity-80">
                Disponible 24/7 - Conversación confidencial
              </p>
            </div>
          </div>

          <div className="text-sm opacity-90 flex items-center gap-2">
            <span className="bg-white/20 px-2 py-1 rounded-md">
              {sessionActive ? "Sesión Anónima Activa" : "Finalizada"}
            </span>
            <span className="hidden md:block">
              {sessionActive
                ? "Tu conversación es completamente confidencial."
                : ""}
            </span>
          </div>
        </header>

        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-4 bg-[#faf9ff]">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md px-4 py-3 rounded-2xl shadow-sm text-sm ${
                  msg.sender === "user"
                    ? "bg-purple-600 text-white rounded-br-none"
                    : "bg-white text-gray-700 rounded-bl-none border border-gray-100"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`text-[11px] mt-1 text-right ${
                    msg.sender === "user"
                      ? "text-purple-100"
                      : "text-gray-400"
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input box */}
        <div className="border-t border-gray-200 bg-white p-4 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={handleSend}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition"
          >
            ➤
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center py-2 bg-white border-t">
          💬 Presiona Enter para enviar · Tu conversación es confidencial
        </p>
      </main>
    </div>
  );
}
