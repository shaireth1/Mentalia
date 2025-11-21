"use client";

import { useEffect, useState } from "react";
import { Monitor, Smartphone, Laptop, LogOut } from "lucide-react";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

function guessDeviceType(userAgent = "") {
  const ua = userAgent.toLowerCase();
  if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
    return "Smartphone";
  }
  if (ua.includes("windows") || ua.includes("macintosh") || ua.includes("linux")) {
    return "Laptop";
  }
  return "Desktop";
}

function getIcon(type) {
  switch (type) {
    case "Smartphone":
      return <Smartphone className="text-purple-600 w-5 h-5" />;
    case "Laptop":
      return <Laptop className="text-purple-600 w-5 h-5" />;
    default:
      return <Monitor className="text-purple-600 w-5 h-5" />;
  }
}

export default function SettingsView() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Cargar sesiones desde el backend
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/sessions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) {
          console.error(data);
          setMsg(data.msg || "No se pudieron cargar las sesiones");
        } else {
          setSessions(data);
        }
      } catch (err) {
        console.error(err);
        setMsg("Error al cargar las sesiones");
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [token]);

  const currentToken =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleLogoutCurrent = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${baseUrl}/api/sessions/logout-current`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.msg || "No se pudo cerrar la sesión actual");
        return;
      }

      // limpiar y redirigir
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setMsg("Error al cerrar la sesión actual");
    }
  };

  const handleLogoutAll = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${baseUrl}/api/sessions/logout-all`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.msg || "No se pudieron cerrar todas las sesiones");
        return;
      }

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      setMsg("Error al cerrar todas las sesiones");
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          Seguridad y Sesiones
        </h2>

        {/* Botón para RF3: cerrar todas las sesiones */}
        <button
          onClick={handleLogoutAll}
          className="text-xs font-medium text-red-500 hover:text-red-600 border border-red-200 px-3 py-1 rounded-full"
        >
          Cerrar todas las sesiones
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Aquí puedes ver los dispositivos donde has iniciado sesión con tu cuenta
        de{" "}
        <span className="text-purple-600 font-medium">MENTALIA</span> y cerrar
        sesión en alguno si lo deseas.
      </p>

      {msg && (
        <p className="text-xs text-center text-red-500 mb-3">{msg}</p>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Cargando sesiones...</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-gray-400">
          No hay sesiones activas registradas.
        </p>
      ) : (
        <div className="space-y-4">
          {sessions.map((s) => {
            const isCurrent = s.token === currentToken;
            const type = guessDeviceType(s.userAgent);
            const browserText = s.userAgent || "Navegador desconocido";

            return (
              <div
                key={s._id}
                className={`flex items-center justify-between p-4 rounded-lg border ${
                  isCurrent
                    ? "border-purple-400 bg-purple-50"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white rounded-full p-2 shadow-sm">
                    {getIcon(type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {isCurrent ? "Este dispositivo" : "Otro dispositivo"}
                      {isCurrent && (
                        <span className="text-xs text-purple-700 font-semibold ml-2">
                          (Actual)
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      {browserText}
                    </p>
                    <p className="text-xs text-gray-400">
                      {s.location || "Ubicación no disponible"} •{" "}
                      {new Date(s.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {isCurrent ? (
                  <button
                    className="flex items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-900 transition"
                    onClick={handleLogoutCurrent}
                  >
                    <LogOut className="w-4 h-4" />
                    Cerrar sesión aquí
                  </button>
                ) : (
                  <span className="flex items-center gap-1 text-sm text-gray-400">
                    <LogOut className="w-4 h-4" />
                    Sesión activa
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
