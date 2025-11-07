"use client";

import { useState, useRef, useEffect } from "react";
import { SendHorizonal, Bot } from "lucide-react";

export default function ChatbotView({ mode = "anonimo" }) {
  const [messages, setMessages] = useState(() => {
    // Recuperar historial temporal de la sesión (solo si está disponible)
    const saved = sessionStorage.getItem("chatHistory");
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: "bot",
            text: "💜 ¡Hola! Soy MENTALIA Bot. Estoy aquí para acompañarte y escucharte. ¿Cómo te sientes hoy?",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ];
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // 🔹 Guardar historial durante la sesión
  useEffect(() => {
    sessionStorage.setItem("chatHistory", JSON.stringify(messages));
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔹 Eliminar historial al cerrar la pestaña
  useEffect(() => {
    const clearSession = () => {
      sessionStorage.removeItem("chatHistory");
    };
    window.addEventListener("beforeunload", clearSession);
    return () => window.removeEventListener("beforeunload", clearSession);
  }, []);

  // 🔹 Enviar mensaje al backend y mostrar respuesta
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("Servidor no disponible");

      const data = await res.json();

      const botMessage = {
        sender: "bot",
        text:
          data.currentResponse ||
          data.response ||
          "✨ Gracias por compartirlo. Estoy aquí para escucharte, cuéntame más si lo deseas.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ Error al conectar con el backend:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "🚫 Ocurrió un error al conectar con el servidor. Intenta más tarde, por favor.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // 🔹 Header dinámico según el modo
  const headerTitle =
    mode === "anonimo"
      ? "MENTALIA Bot — Sesión anónima"
      : "MENTALIA Bot — Chat de apoyo";

  return (
    <div className="flex flex-col w-full h-[calc(100vh-100px)] bg-[#faf7ff] rounded-2xl shadow-sm border border-[#e9e3fa] overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#7B3EF3] to-[#B266FF] text-white py-4 px-6 rounded-t-2xl flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <Bot className="text-white" size={22} />
        </div>
        <div>
          <h2 className="font-semibold text-lg">{headerTitle}</h2>
          <p className="text-sm opacity-90">
            Disponible 24/7 · Espacio confidencial y de apoyo emocional
          </p>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm whitespace-pre-line ${
                msg.sender === "user"
                  ? "bg-[#e7d8fb] text-gray-800"
                  : "bg-[#f3eaff] text-gray-800"
              }`}
            >
              <p className="text-sm">{msg.text}</p>
              <span className="text-xs text-gray-500 mt-1 block text-right">
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-[#f3eaff] text-gray-700 px-4 py-3 rounded-2xl text-sm animate-pulse">
              💭 Estoy pensando en la mejor manera de responderte...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#e9e3fa] bg-white p-4 rounded-b-2xl">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Escribe tu mensaje aquí..."
            className="flex-1 border border-[#e0d5f5] focus:ring-2 focus:ring-[#b97eff] focus:outline-none rounded-xl px-4 py-2 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-[#cfa3ff] hover:bg-[#b97eff] transition p-2 rounded-xl disabled:opacity-50"
          >
            <SendHorizonal size={18} className="text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          💬 Presiona Enter para enviar · Tu bienestar es importante 💜
        </p>
      </div>
    </div>
  );
}