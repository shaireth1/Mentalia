"use client";

import { Monitor, Smartphone, Laptop, LogOut } from "lucide-react";

export default function SettingsView() {
  const devices = [
    {
      id: 1,
      name: "Este dispositivo",
      type: "Laptop",
      location: "Bogotá, Colombia",
      browser: "Chrome en Windows 11",
      lastActive: "Hace 2 minutos",
      current: true,
    },
    {
      id: 2,
      name: "Teléfono móvil",
      type: "Smartphone",
      location: "Medellín, Colombia",
      browser: "App MENTALIA Android",
      lastActive: "Hace 1 día",
    },
    {
      id: 3,
      name: "Computador de oficina",
      type: "Desktop",
      location: "Cali, Colombia",
      browser: "Edge en Windows 10",
      lastActive: "Hace 3 días",
    },
  ];

  const getIcon = (type) => {
    switch (type) {
      case "Smartphone":
        return <Smartphone className="text-purple-600 w-5 h-5" />;
      case "Laptop":
        return <Laptop className="text-purple-600 w-5 h-5" />;
      default:
        return <Monitor className="text-purple-600 w-5 h-5" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        🔒 Seguridad y Sesiones
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Aquí puedes ver los dispositivos donde has iniciado sesión con tu cuenta
        de <span className="text-purple-600 font-medium">MENTALIA</span> y cerrar sesión en alguno si lo deseas.
      </p>

      <div className="space-y-4">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              device.current
                ? "border-purple-400 bg-purple-50"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-full p-2 shadow-sm">
                {getIcon(device.type)}
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {device.name}{" "}
                  {device.current && (
                    <span className="text-xs text-purple-700 font-semibold ml-2">
                      (Actual)
                    </span>
                  )}
                </p>
                <p className="text-sm text-gray-500">{device.browser}</p>
                <p className="text-xs text-gray-400">
                  {device.location} • {device.lastActive}
                </p>
              </div>
            </div>

            {device.current ? (
              <button
                className="flex items-center gap-1 text-sm font-medium text-purple-700 hover:text-purple-900 transition"
                onClick={() => alert("Sesión cerrada en este dispositivo")}
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión aquí
              </button>
            ) : (
              <button
                disabled
                className="flex items-center gap-1 text-sm text-gray-400 cursor-not-allowed"
              >
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
