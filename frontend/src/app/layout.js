import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "../context/AuthContext";

// ⭐ ACCESIBILIDAD
import { AccesibilidadProvider } from "../context/AccesibilidadContext";
import AccesibilidadPanel from "../components/AccesibilidadPanel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Mentalia Chat",
  description: "Sistema de bienestar emocional",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          
          /* ⭐ NUEVO: evita que nada se salga en móviles */
          overflow-x-hidden
          min-w-[320px]
        `}
      >
        {/* 🌟 PROVIDERS GLOBALES */}
        <AuthProvider>
          <AccesibilidadProvider>
            {/* 🌟 PANEL FLOTANTE DE ACCESIBILIDAD */}
            <AccesibilidadPanel />

            {/* ⭐ NUEVO: hace que todo el contenido sea flexible */}
            <div className="w-full max-w-[2000px] mx-auto">
              {children}
            </div>
          </AccesibilidadProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
