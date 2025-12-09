"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { setupBackendSessionMonitor } from "../utils/sessionActivity";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();

  // ⭐ Referencia al timer real (para evitar duplicados)
  const inactivityRef = useRef(null);

  // 🟣 Cargar sesión guardada
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 🟣 Monitoreo de inactividad REAL
  useEffect(() => {
    if (!token) return;

    clearTimeout(inactivityRef.current);

    const resetTimer = () => {
      clearTimeout(inactivityRef.current);
      inactivityRef.current = setTimeout(() => {
        handleLogout(true); // ⛔ cerrar por inactividad
      }, 30 * 60 * 1000); // 30 minutos exactos
    };

    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];

    events.forEach((ev) => window.addEventListener(ev, resetTimer));

    resetTimer(); // iniciar el timer

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      clearTimeout(inactivityRef.current);
    };
  }, [token]);

  // 🟣 🔥 Monitor del backend (ping cada 2 min)
  useEffect(() => {
    if (!token) return;

    // instala el monitor
    const stop = setupBackendSessionMonitor(token, handleLogout);

    // limpieza
    return () => {
      if (stop) stop();
    };
  }, [token]);

  // 🟣 Logout
  const handleLogout = async (auto = false) => {
    try {
      if (token) {
        await fetch("http://localhost:4000/api/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }

    // 🧹 limpiar sesión
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    clearTimeout(inactivityRef.current);

    if (auto) {
      alert("⚠️ Tu sesión se cerró automáticamente por inactividad.");
    }

    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, setUser, setToken, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
