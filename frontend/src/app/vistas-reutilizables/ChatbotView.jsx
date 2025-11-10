"use client";

import { useState, useEffect, useRef } from "react";
import { SendHorizonal, Bot } from "lucide-react";

export default function ChatbotView({ mode = "anonimo" }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const isClient = typeof window !== "undefined";

  // 🧠 Cargar historial según el tipo de usuario
  useEffect(() => {
    if (!isClient) return;

    const storage = mode === "anonimo" ? sessionStorage : localStorage;
    const saved = storage.getItem("chatHistory");

    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([
        {
          sender: "bot",
          text: "💜 ¡Hola! Soy MENTALIA Bot. Estoy aquí para escucharte. ¿Cómo te sientes hoy?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  }, [mode, isClient]);

  // 🧠 Guardar historial automáticamente
  useEffect(() => {
    if (!isClient) return;
    const storage = mode === "anonimo" ? sessionStorage : localStorage;
    storage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages, mode, isClient]);

  // 🔽 Auto scroll al final
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🧠 Enviar mensaje al backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // 🔹 CORREGIDO: rutas reales del backend
      const endpoint =
        mode === "anonimo"
          ? "http://localhost:4000/api/chatbot/anon"
          : "http://localhost:4000/api/chatbot/auth";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        throw new Error(`Error del servidor: ${res.status}`);
      }

      const data = await res.json();

      if (data && data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: data.reply,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (error) {
      console.error("Error procesando mensaje:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "⚠️ No se pudo conectar con el servidor. Intenta de nuevo más tarde.",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[80vh] w-full bg-white rounded-2xl shadow-md overflow-hidden">
      {/* 🔹 Encabezado */}
      <div className="flex items-center gap-2 p-4 bg-gradient-to-r from-purple-700 to-purple-400 text-white font-semibold">
        <Bot className="w-6 h-6" />
        <h2>
          Chat de Apoyo Emocional –{" "}
          {mode === "anonimo" ? "Sesión Anónima" : "Usuario Autenticado"}
        </h2>
      </div>

      {/* 🔹 Cuerpo del chat */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                msg.sender === "user"
                  ? "bg-purple-500 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              }`}
            >
              <p>{msg.text}</p>
              <span className="text-xs text-gray-500 mt-1 block text-right">
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* 🔹 Entrada de texto */}
      <div className="p-4 border-t flex gap-2 bg-gray-50">
        <textarea
          className="flex-1 border border-gray-300 rounded-xl p-2 resize-none focus:ring focus:ring-purple-300 focus:outline-none"
          rows="1"
          value={input}
          placeholder="Escribe tu mensaje..."
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2 flex items-center justify-center"
        >
          <SendHorizonal />
        </button>
      </div>
    </div>
  );
}
