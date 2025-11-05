"use client";
import { useState, useEffect, useRef } from "react";

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 ¡Hola! Soy tu asistente emocional. Cuéntame, ¿cómo te sientes hoy?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:4000/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (res.ok) {
        const botMessage = {
          sender: "bot",
          text: data.currentResponse || data.response || "Lo siento, no entendí eso 💭",
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "❌ Error en el servidor, inténtalo más tarde." },
        ]);
      }
    } catch (error) {
      console.error("Error al conectar con el chatbot:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "🚫 No se pudo conectar con el chatbot." },
      ]);
    } finally {
      setLoading(false);
      setInput("");
      scrollToBottom();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f2e1ff]">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-2xl flex flex-col overflow-hidden">
        <div className="bg-purple-700 text-white p-4 text-center font-semibold text-lg">
          🤖 Chatbot Emocional — Mentalia
        </div>

        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-3 rounded-xl max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-purple-200 text-purple-900"
                    : "bg-purple-700 text-white"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 bg-purple-100 flex items-center space-x-2">
          <input
            type="text"
            className="flex-1 p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            placeholder="Escribe tu mensaje..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`px-4 py-3 rounded-lg text-white font-semibold transition ${
              loading ? "bg-purple-400" : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {loading ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}
