"use client";
import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [psicologa, setPsicologa] = useState({ nombre: "", correo: "" });
  const router = useRouter();

  useEffect(() => {
    // Simulamos obtener datos desde localStorage o desde una API
    const data = localStorage.getItem("psicologa");
    if (data) {
      setPsicologa(JSON.parse(data));
    } else {
      // Si no hay sesión, redirige a inicio
      router.push("/");
    }
  }, [router]);

  const handleLogout = () => {
    // Limpia sesión y redirige a página principal
    localStorage.removeItem("psicologa");
    router.push("/");
  };

  return (
    <header className="bg-gradient-to-r from-[#7b2cff] to-[#8a3bff] text-white p-4 shadow">
      <div className="container-max flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">Panel de Psicóloga Institucional</h2>
          <p className="text-sm opacity-85">
            Monitoreo y gestión de la plataforma MENTALIA
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="font-semibold">{psicologa.nombre || "Cargando..."}</div>
            <div className="text-sm opacity-80">{psicologa.correo}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-md bg-white/12 hover:bg-white/20 transition"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

