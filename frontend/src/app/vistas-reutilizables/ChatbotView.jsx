"use client";

import { useState, useEffect, useRef } from "react";
import { SendHorizonal, Bot } from "lucide-react";

/**
 * ChatbotView.jsx
 * - mode: "anonimo" | "autenticado"
 * - Usa storage: sessionStorage (anon) / localStorage (autenticado)
 * - Usa NEXT_PUBLIC_API_URL si está definido, si no usa http://localhost:4000
 */

export default function ChatbotView({ mode = "anonimo" }) {
  const [mounted, setMounted] = useState(false); // evita mismatch SSR/client
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  const baseUrl =
    (typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL) ||
    "http://localhost:4000";

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cargar historial (solo en cliente)
  useEffect(() => {
    if (!mounted) return;

    try {
      const storage = mode === "anonimo" ? sessionStorage : localStorage;
      const raw = storage.getItem("chatHistory");
      if (raw) {
        const parsed = JSON.parse(raw);
        setMessages(Array.isArray(parsed) ? parsed : []);
      } else {
        setMessages([
          {
            sender: "bot",
            text:
              "💜 ¡Hola! Soy MENTALIA Bot. Estoy aquí para escucharte. ¿Cómo te sientes hoy?",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            meta: { initial: true },
          },
        ]);
      }
    } catch (e) {
      // si algo falla, inicializamos al menos con el mensaje del bot
      setMessages([
        {
          sender: "bot",
          text:
            "💜 ¡Hola! Soy MENTALIA Bot. Estoy aquí para escucharte. ¿Cómo te sientes hoy?",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
      console.error("Error cargando historial:", e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, mounted]);

  // Guardar historial en storage cada vez que mensajes cambian
  useEffect(() => {
    if (!mounted) return;
    try {
      const storage = mode === "anonimo" ? sessionStorage : localStorage;
      storage.setItem("chatHistory", JSON.stringify(messages));
    } catch (e) {
      console.error("Error guardando historial:", e);
    }
  }, [messages, mode, mounted]);

  // Auto-scroll
  useEffect(() => {
    if (!mounted) return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, mounted]);

  // Enviar mensaje al backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    const textToSend = input.trim();

    // Añadimos mensaje del usuario inmediatamente (optimista)
    const userMessage = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((p) => [...p, userMessage]);
    setInput("");

    // Seleccionar endpoint según modo
    const endpoint =
  mode === "anonimo"
    ? `${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/anonimo`
    : `${process.env.NEXT_PUBLIC_API_URL}/api/chatbot/autenticado`;

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      // Si 404 u otro, lanzamos error para manejarlo
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${res.statusText} — ${text}`);
      }

      // Intentamos parsear JSON (manejamos HTML inesperado)
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const body = await res.text();
        throw new Error("Respuesta del servidor no es JSON: " + body.slice(0, 200));
      }

      const data = await res.json();

      if (data && data.reply) {
        setMessages((p) => [
          ...p,
          {
            sender: "bot",
            text: data.reply,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } else {
        throw new Error("Respuesta inválida del servidor");
      }
    } catch (err) {
      console.error("Error procesando mensaje:", err);
      setMessages((p) => [
        ...p,
        {
          sender: "bot",
          text: "⚠️ No se pudo conectar con el servidor. Intenta de nuevo más tarde.",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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

  // No renderizar (SSR mismatch protection)
  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col h-[80vh] w-full bg-white rounded-2xl shadow-md overflow-hidden">
      {/* Encabezado degradado */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-t-2xl">
        <Bot className="w-6 h-6" />
        <div>
          <h2 className="text-sm">MENTALIA Bot</h2>
          <p className="text-xs opacity-90">
            Disponible 24/7 · Conversación confidencial
          </p>
        </div>
        <div className="ml-auto text-xs opacity-80">
          <span className="px-2 py-1 rounded-md bg-white/10"> {mode === "anonimo" ? "Sesión temporal" : "Usuario"}</span>
        </div>
      </div>

      {/* Mensaje info (visible solo en modo anónimo) */}
      {mode === "anonimo" && (
        <div className="p-4">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-sm text-indigo-700">
            <strong>Sesión Anónima Activa</strong>
            <div className="mt-1 text-xs text-indigo-600/90">
              Tu conversación es completamente confidencial y solo estará disponible durante esta sesión.
            </div>
          </div>
        </div>
      )}

      {/* Body chats */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
        {messages.length === 0 && (
          <div className="text-center text-sm text-gray-400">Comienza la conversación...</div>
        )}

        {messages.map((msg, i) => {
          const isUser = msg.sender === "user";
          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] break-words shadow-sm ${
                  isUser
                    ? "bg-purple-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div className="text-xs text-gray-400 mt-1 text-right">{msg.time}</div>
              </div>
            </div>
          );
        })}

        <div ref={chatEndRef} />
      </div>

      {/* Input footer (de estilo como en Figma) */}
      <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
        <div className="flex gap-3 items-center">
          <textarea
            className="flex-1 border border-gray-200 rounded-full p-3 resize-none h-10 focus:ring-2 focus:ring-purple-300 focus:outline-none"
            rows={1}
            value={input}
            placeholder="Escribe tu mensaje aquí..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            title="Enviar"
            className="w-12 h-10 rounded-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center text-white shadow"
          >
            <SendHorizonal />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-400">
          <span>💡 Presiona Enter para enviar • Tu conversación es confidencial</span>
        </div>
      </div>
    </div>
  );
}
