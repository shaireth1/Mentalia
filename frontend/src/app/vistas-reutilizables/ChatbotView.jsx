"use client";

import { useState, useEffect, useRef } from "react";
import { SendHorizonal, Bot } from "lucide-react";

export default function ChatbotView({ mode = "anonimo" }) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("informal");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  useEffect(() => {
    setMounted(true);
  }, []);

  // 🔹 Cargar tono por defecto si el usuario está autenticado
  useEffect(() => {
    if (!mounted) return;
    if (mode !== "autenticado") return;

    try {
      const rawUser = localStorage.getItem("user");
      if (rawUser) {
        const user = JSON.parse(rawUser);
        if (user.tone === "formal" || user.tone === "informal") {
          setTone(user.tone);
        }
      }
    } catch (err) {
      console.error("Error leyendo tono de usuario:", err);
    }
  }, [mode, mounted]);

  // 🧹 RF6 — BORRAR HISTORIAL ANÓNIMO CUANDO SE CIERRA LA PESTAÑA
  useEffect(() => {
    if (mode !== "anonimo") return;

    const clearAnon = () => {
      sessionStorage.removeItem("chatHistory");
    };

    window.addEventListener("beforeunload", clearAnon);

    return () => {
      clearAnon();
      window.removeEventListener("beforeunload", clearAnon);
    };
  }, [mode]);

  // 📦 Cargar historial
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
              mode === "anonimo"
                ? "💜 ¡Hola! Soy MENTALIA Bot. Estoy aquí para escucharte. ¿Cómo te sientes hoy?"
                : "🤍 ¡Hola! Soy MENTALIA Bot, tu compañero de apoyo emocional. ¿Cómo te sientes hoy?",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      }
    } catch (err) {
      console.error("Error cargando historial:", err);
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
    }
  }, [mode, mounted]);

  // 💾 Guardar historial
  useEffect(() => {
    if (!mounted) return;
    try {
      const storage = mode === "anonimo" ? sessionStorage : localStorage;
      storage.setItem("chatHistory", JSON.stringify(messages));
    } catch (e) {
      console.error("Error guardando historial:", e);
    }
  }, [messages, mode, mounted]);

  // 🔽 Auto scroll
  useEffect(() => {
    if (!mounted) return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping, mounted]);

  // 🔄 Cambiar tono (y si es autenticado, persistir en backend)
  const changeTone = async (newTone) => {
    setTone(newTone);

    if (mode !== "autenticado") return;

    try {
      const token = localStorage.getItem("token");
      const rawUser = localStorage.getItem("user");

      if (token) {
        await fetch(`${baseUrl}/api/users/tone`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ tone: newTone }),
        });
      }

      if (rawUser) {
        const user = JSON.parse(rawUser);
        user.tone = newTone;
        localStorage.setItem("user", JSON.stringify(user));
      }
    } catch (err) {
      console.error("Error actualizando tono en backend:", err);
    }
  };

  // 🧠 Enviar mensaje
  const sendMessage = async () => {
    if (!input.trim()) return;

    const textToSend = input.trim();

    const userMessage = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((p) => [...p, userMessage]);
    setInput("");

    // ⭐ Activar "escribiendo"
    setIsBotTyping(true);

    const endpoint =
      mode === "anonimo"
        ? `${baseUrl}/api/chatbot/anonimo`
        : `${baseUrl}/api/chatbot/autenticado`;

    try {
      // 🔥 NUEVO → Tomar userId solo si está autenticado
      let userIdToSend = null;
      if (mode === "autenticado") {
        try {
          const saved = JSON.parse(localStorage.getItem("user"));
          userIdToSend = saved?.id || saved?._id || null;
        } catch {}
      }

      const bodyPayload = {
        message: textToSend,
        tone: tone,
        userId: userIdToSend, // 🔥 ENVIAMOS userId
      };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyPayload),
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const data = await res.json();

      // ⭐ Desactivar escribiendo
      setIsBotTyping(false);

      if (data && data.reply) {
        setMessages((p) => [
          ...p,
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
    } catch (err) {
      console.error("Error procesando mensaje:", err);

      // ⭐ Desactivar escribiendo en error
      setIsBotTyping(false);

      setMessages((p) => [
        ...p,
        {
          sender: "bot",
          text:
            "⚠️ No se pudo conectar con el servidor. Intenta de nuevo más tarde.",
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

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-[80vh] w-full bg-white rounded-2xl shadow-md overflow-hidden">

      {/* 🔹 HEADER */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-t-2xl">
        <Bot className="w-6 h-6" />
        <div>
          <h2 className="text-sm">MENTALIA Bot</h2>
          <p className="text-xs opacity-90">Disponible 24/7 · Conversación confidencial</p>
        </div>
        <div className="ml-auto text-xs opacity-80">
          <span className="px-2 py-1 rounded-md bg-white/10">
            {mode === "anonimo" ? "Sesión temporal" : "Usuario autenticado"}
          </span>
        </div>
      </div>

      {/* ⭐ Selector de tono */}
      <div className="bg-gray-50 py-2 px-4 border-b flex items-center gap-4 text-xs text-gray-600">
        <span>Tono del chatbot:</span>

        <button
          onClick={() => changeTone("informal")}
          className={`px-3 py-1 rounded-full text-xs border ${
            tone === "informal"
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white border-gray-300 text-gray-600"
          }`}
        >
          Informal
        </button>

        <button
          onClick={() => changeTone("formal")}
          className={`px-3 py-1 rounded-full text-xs border ${
            tone === "formal"
              ? "bg-purple-600 text-white border-purple-600"
              : "bg-white border-gray-300 text-gray-600"
          }`}
        >
          Formal
        </button>
      </div>

      {/* INFO ANÓNIMO */}
      {mode === "anonimo" && (
        <div className="p-4 bg-indigo-50 border-b border-indigo-100">
          <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-4 text-sm text-indigo-700">
            <strong>Sesión Anónima Activa</strong>
            <p className="mt-1 text-xs text-indigo-600/90 leading-snug">
              Tu conversación es completamente confidencial y solo estará disponible durante esta sesión.
            </p>
          </div>
        </div>
      )}

      {/* CHAT */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-white">
        {messages.map((msg, i) => {
          const isUser = msg.sender === "user";
          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`rounded-2xl px-4 py-3 max-w-[80%] break-words transition-all shadow-sm ${
                  isUser
                    ? "bg-purple-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.text}</p>
                <div className="text-[10px] mt-1 text-right opacity-70">{msg.time}</div>
              </div>
            </div>
          );
        })}

        {/* ⭐ Indicador de escritura */}
        {isBotTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-2xl text-sm shadow-sm animate-pulse">
              MENTALIA Bot está escribiendo…
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* FOOTER */}
      <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
        <div className="flex gap-3 items-center">
          <textarea
            className="flex-1 border border-gray-200 rounded-full p-3 resize-none h-10 focus:ring-2 focus:ring-purple-300 focus:outline-none placeholder:text-gray-400"
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
          💡 Presiona Enter para enviar • Tu conversación es confidencial
        </div>
      </div>
    </div>
  );
}
