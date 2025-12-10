"use client";

import { useState, useEffect, useRef } from "react";
import { SendHorizonal, Bot } from "lucide-react";

export default function ChatbotView({ mode = "anonimo" }) {
  const [mounted, setMounted] = useState(false);
  const [anonSessionId, setAnonSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [tone, setTone] = useState("informal");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  /* ===============================
      🔹 MONTAJE INICIAL
  =============================== */
  useEffect(() => {
    setMounted(true);

    if (mode === "anonimo") {
      let sid = sessionStorage.getItem("anonSessionId");
      if (!sid) {
        sid = "anon-" + crypto.randomUUID();
        sessionStorage.setItem("anonSessionId", sid);
      }
      setAnonSessionId(sid);
    }
  }, [mode]);

  /* ===============================
      🔹 TONO EN AUTENTICADOS
  =============================== */
  useEffect(() => {
    if (!mounted || mode !== "autenticado") return;

    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u?.tone) setTone(u.tone);
      }
    } catch {}
  }, [mode, mounted]);

  /* ===============================
      🔹 LIMPIAR SESIÓN ANÓNIMA
  =============================== */
  useEffect(() => {
    if (mode !== "anonimo") return;

    const clearAnon = () => {
      const sid = sessionStorage.getItem("anonSessionId");
      if (sid) fetch(`${baseUrl}/api/sessions/end/${sid}`, { method: "POST" });

      sessionStorage.removeItem("chatHistory");
      sessionStorage.removeItem("anonSessionId");
    };

    window.addEventListener("beforeunload", clearAnon);
    return () => window.removeEventListener("beforeunload", clearAnon);
  }, [mode]);

  /* ===============================
      🔹 CARGAR HISTORIAL
  =============================== */
  useEffect(() => {
    if (!mounted) return;

    const storage = mode === "anonimo" ? sessionStorage : localStorage;
    const raw = storage.getItem("chatHistory");

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setMessages(parsed);
          return;
        }
      } catch {}
    }

    setMessages([
      {
        sender: "bot",
        text:
          mode === "anonimo"
            ? "💜 ¡Hola! Soy MENTALIA Bot. ¿Cómo te sientes hoy?"
            : "🤍 ¡Hola! Estoy aquí para acompañarte. ¿Cómo te sientes hoy?",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);
  }, [mode, mounted]);

  /* ===============================
      💾 GUARDAR HISTORIAL
  =============================== */
  useEffect(() => {
    if (!mounted) return;
    const storage = mode === "anonimo" ? sessionStorage : localStorage;
    storage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages, mode, mounted]);

  /* ===============================
      🔽 SCROLL AUTOMÁTICO
  =============================== */
  useEffect(() => {
    if (!mounted) return;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping, mounted]);

  /* ===============================
      📤 ENVIAR MENSAJE
  =============================== */
  const sendMessage = async () => {
    if (!input.trim() || isBotTyping) return;

    if (mode === "anonimo" && !anonSessionId) return;

    const textToSend = input.trim();

    setMessages((p) => [
      ...p,
      {
        sender: "user",
        text: textToSend,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setInput("");
    setIsBotTyping(true);

    let userIdToSend = null;
    if (mode === "autenticado") {
      try {
        const saved = JSON.parse(localStorage.getItem("user"));
        userIdToSend =
          saved?.id || saved?._id || saved?.userId || saved?.data?._id || null;
      } catch {}
    }

    const endpoint =
      mode === "anonimo"
        ? `${baseUrl}/api/chatbot/anonimo`
        : `${baseUrl}/api/chatbot/autenticado`;

    const headers = { "Content-Type": "application/json" };
    if (mode === "autenticado") {
      const token = localStorage.getItem("token");
      if (token) headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        credentials: mode === "autenticado" ? "include" : "omit",
        body: JSON.stringify({
          message: textToSend,
          tone,
          userId: userIdToSend,
          sessionId: mode === "anonimo" ? anonSessionId : null,
        }),
      });

      const data = await res.json();
      setIsBotTyping(false);

      if (data.reply) {
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
      }
    } catch {
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

  /* ===============================
      🌐 VISTA COMPLETA RESPONSIVA
  =============================== */
  return (
    <div className="flex flex-col h-[85vh] sm:h-[80vh] md:h-[78vh] lg:h-[75vh] w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-md overflow-hidden">

      {/* HEADER */}
      <header className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600 to-indigo-500 text-white">
        <Bot className="w-6 h-6" />
        <div>
          <h2 className="text-sm font-semibold">MENTALIA Bot</h2>
          <p className="text-xs opacity-90">
            Disponible 24/7 · Conversación confidencial
          </p>
        </div>
        <div className="ml-auto text-xs opacity-80">
          <span className="px-2 py-1 rounded bg-white/10">
            {mode === "anonimo" ? "Sesión temporal" : "Autenticado"}
          </span>
        </div>
      </header>

      {/* TONO DEL CHATBOT */}
      <div className="bg-gray-50 py-2 px-4 border-b flex flex-wrap gap-2 text-xs">
        <span className="text-gray-600">Tono del chatbot:</span>

        {["informal", "formal"].map((t) => (
          <button
            key={t}
            onClick={() => setTone(t)}
            className={`px-3 py-1 rounded-full border ${
              tone === t
                ? "bg-purple-600 text-white border-purple-600"
                : "bg-white border-gray-300 text-gray-600"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* INFO SESION ANONIMA */}
      {mode === "anonimo" && (
        <div className="p-4 bg-indigo-50 border-b text-sm text-indigo-700">
          <div className="bg-white rounded-xl border p-4 shadow-sm">
            <strong>Sesión Anónima</strong>
            <p className="mt-1 text-xs text-indigo-600 leading-snug">
              Esta conversación es temporal y se borrará al cerrar la pestaña.
            </p>
          </div>
        </div>
      )}

      {/* CHAT */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
        {messages.map((msg, i) => {
          const isUser = msg.sender === "user";
          return (
            <div key={i} className={`flex ${isUser ? "justify-end" : ""}`}>
              <div
                className={`px-4 py-3 max-w-[80%] md:max-w-[65%] lg:max-w-[60%] rounded-2xl shadow-sm text-sm leading-relaxed ${
                  isUser
                    ? "bg-purple-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
                <div className="text-[10px] mt-1 opacity-70 text-right">
                  {msg.time}
                </div>
              </div>
            </div>
          );
        })}

        {isBotTyping && (
          <div className="bg-gray-200 text-gray-600 px-4 py-2 rounded-2xl text-sm animate-pulse w-fit">
            MENTALIA Bot está escribiendo…
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* FOOTER */}
      <footer className="p-3 border-t bg-gray-50">
        <div className="flex gap-2 items-center">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            className="flex-1 border border-gray-300 rounded-full p-3 text-sm resize-none h-12 focus:ring-2 focus:ring-purple-300"
            placeholder="Escribe tu mensaje…"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`w-12 h-12 flex items-center justify-center rounded-full transition ${
              input.trim()
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            <SendHorizonal className="w-5 h-5 text-white" />
          </button>
        </div>
      </footer>
    </div>
  );
}
