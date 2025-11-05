"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

export default function ChatbotView() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "¡Hola! Soy MENTALIA Bot, tu compañero de apoyo emocional. Estoy aquí para escucharte sin juzgar. ¿Cómo te sientes hoy?",
      time: "13:46",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#faf8ff] rounded-xl shadow-sm border border-transparent">
      {/* Encabezado */}
      <div className="p-4 rounded-t-xl bg-gradient-to-r from-[#7b2ff7] to-[#9f44d3] flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <MessageSquare size={20} />
          <div>
            <h2 className="font-semibold">MENTALIA Bot</h2>
            <p className="text-xs text-white/80">Disponible 24/7 • Conversación confidencial</p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gradient-to-b from-[#faf8ff] to-[#f5edff]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === "bot" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[70%] shadow-sm text-sm ${
                msg.sender === "bot"
                  ? "bg-[#f3e7ff] text-gray-700"
                  : "bg-[#d9c6ff] text-gray-800"
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-xs text-gray-500 mt-1 block text-right">{msg.time}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Entrada de mensaje */}
      <form onSubmit={handleSend} className="p-4 bg-white rounded-b-xl flex items-center gap-2 border-t border-gray-100">
        <input
          type="text"
          placeholder="Escribe tu mensaje aquí..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-[#d7baff] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a96cff]"
        />
        <button
          type="submit"
          className="bg-[#b46dff] hover:bg-[#9f44d3] text-white rounded-full p-2 transition"
        >
          <Send size={18} />
        </button>
      </form>

      <p className="text-center text-xs text-gray-500 py-2">
        💡 Presiona Enter para enviar • Tu conversación es confidencial
      </p>
    </div>
  );
}

