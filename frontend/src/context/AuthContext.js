"use client";
import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { setupBackendSessionMonitor } from "../utils/sessionActivity";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const inactivityRef = useRef(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Cargar sesión guardada
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Timer de inactividad
  useEffect(() => {
    if (!token) return;

    clearTimeout(inactivityRef.current);

    const resetTimer = () => {
      clearTimeout(inactivityRef.current);
      inactivityRef.current = setTimeout(() => {
        handleLogout(true);
      }, 30 * 60 * 1000);
    };

    const events = ["click", "mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((ev) => window.addEventListener(ev, resetTimer));
    resetTimer();

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, resetTimer));
      clearTimeout(inactivityRef.current);
    };
  }, [token]);

  // Monitor backend
  useEffect(() => {
    if (!token) return;
    const stop = setupBackendSessionMonitor(token, handleLogout);
    return () => stop && stop();
  }, [token]);

  // Logout global
  const handleLogout = async (auto = false) => {
    try {
      if (token) {
        await fetch(`${API_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);

    clearTimeout(inactivityRef.current);

    if (auto) alert("⚠️ Tu sesión se cerró por inactividad.");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, setUser, setToken, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
