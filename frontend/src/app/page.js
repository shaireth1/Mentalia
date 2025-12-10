"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, Shield, User, Heart, Phone } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#A259FF] to-[#3A86FF] relative font-sans overflow-x-hidden">

      {/* Encabezado superior */}
      <div className="absolute top-6 w-full flex justify-center px-4">
        <div className="bg-white/25 text-base sm:text-xl px-6 sm:px-8 py-2 sm:py-3 rounded-full text-white font-semibold shadow-md tracking-wide text-center">
          SENA - Servicio Nacional de Aprendizaje
        </div>
      </div>

      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-6 sm:px-8 lg:px-16 mt-32 sm:mt-28">

        {/* Texto principal */}
        <div className="text-white max-w-xl text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 flex justify-center md:justify-start items-center gap-3">
            <Image 
              src="/logomentalia.png.png"
              alt="Logo Mentalia"
              width={50}
              height={50}
              className="w-10 h-10 object-contain"
            />
            <span className="tracking-tight">MENTALIA</span>
          </h1>

          <p className="text-base sm:text-lg mb-8 font-medium opacity-90">
            Plataforma de Apoyo Emocional
          </p>

          <h2 className="text-xl sm:text-2xl font-bold mb-4 leading-snug">
            Bienvenido a la plataforma de apoyo emocional del SENA
          </h2>

          <p className="text-sm sm:text-base mb-8 leading-relaxed text-white/90 max-w-md mx-auto md:mx-0">
            MENTALIA es tu espacio seguro para el bienestar emocional. 
            Te acompañamos 24/7 con herramientas tecnológicas diseñadas con 
            responsabilidad y empatía.
          </p>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-y-4 gap-x-10 text-sm font-medium mb-12 justify-center mx-auto md:mx-0">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Clock className="w-5 h-5 text-yellow-300" /> Disponible 24/7
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Shield className="w-5 h-5 text-blue-300" /> Confidencial y seguro
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <User className="w-5 h-5 text-green-300" /> Apoyo profesional
            </div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Heart className="w-5 h-5 text-pink-300" /> Sin prejuicios
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/login">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-full font-semibold hover:opacity-90 transition shadow-lg w-full sm:w-auto">
                Iniciar Sesión
              </button>
            </Link>

            <Link href="/panel-usuario-anonimo">
              <button className="px-8 py-3 border border-white/40 text-white rounded-full font-semibold hover:bg-white/10 transition shadow-md w-full sm:w-auto">
                Usar de forma anónima
              </button>
            </Link>
          </div>
        </div>

        {/* Tarjeta con imagen */}
        <div className="bg-white rounded-2xl overflow-hidden mt-12 md:mt-0 md:ml-10 lg:ml-16 shadow-2xl max-w-sm sm:max-w-md md:max-w-lg w-full">
          <Image
            src="/foto-panel-principal.jpg"
            alt="Apoyo emocional"
            width={700}
            height={450}
            className="object-cover w-full h-64 sm:h-72 md:h-80 lg:h-96"
          />
          <div className="p-6 sm:p-8">
            <h3 className="font-bold text-gray-900 text-lg sm:text-xl mb-3 text-center md:text-left">
              Tu bienestar es nuestra prioridad
            </h3>
            <p className="text-gray-600 text-sm sm:text-base text-center md:text-left">
              Encuentra el apoyo que necesitas en un ambiente seguro, confidencial y gratuito.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full border-t border-white/20 py-4 px-4">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-10 text-xs sm:text-sm text-white/80 text-center">
          <a href="#" className="hover:underline">Política de privacidad</a>
          <a href="#" className="hover:underline">Líneas de ayuda inmediatas</a>
          <span className="flex items-center gap-2 text-red-300 font-medium">
            <Phone className="w-4 h-4" /> Línea Nacional: 106
          </span>
        </div>
      </footer>
    </main>
  );
}
