import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-[#A259FF] to-[#3A86FF] relative font-sans">
      
      {/* Encabezado superior */}
      <div className="absolute top-6 w-full flex justify-center">
        <div className="bg-white/20 text-sm px-6 py-1 rounded-full text-white font-medium shadow-sm">
          SENA - Servicio Nacional de Aprendizaje
        </div>
      </div>

      <div className="w-full max-w-7xl flex flex-col md:flex-row items-center justify-between px-8 lg:px-16 mt-20">
        
        {/* Texto principal */}
        <div className="text-white max-w-xl">
          <h1 className="text-5xl font-extrabold mb-2 flex items-center gap-3">
            <span className="text-5xl">🤍</span> 
            <span className="tracking-tight">MENTALIA</span>
          </h1>
          <p className="text-lg mb-8 font-medium opacity-90">Plataforma de Apoyo Emocional</p>

          <h2 className="text-2xl font-bold mb-4 leading-snug">
            Bienvenido a la plataforma de apoyo emocional del SENA
          </h2>

          <p className="text-base mb-8 leading-relaxed text-white/90 max-w-md">
            MENTALIA es tu espacio seguro para el bienestar emocional. 
            Te acompañamos 24/7 con herramientas tecnológicas diseñadas con 
            responsabilidad y empatía.
          </p>

          {/* Iconos */}
          <div className="grid grid-cols-2 gap-y-4 gap-x-10 text-sm font-medium mb-12">
            <div className="flex items-center gap-2">
              <span className="text-yellow-300 text-xl">🕒</span> Disponible 24/7
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-200 text-xl">🛡️</span> Confidencial y seguro
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-200 text-xl">👩‍⚕️</span> Apoyo profesional
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pink-300 text-xl">💜</span> Sin prejuicios
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button className="px-8 py-3 bg-gradient-to-r from-purple-600  text-white rounded-full font-semibold hover:opacity-90 transition shadow-lg">
              Iniciar Sesión
            </button>
            <button className="px-8 py-3 border border-white/40 text-white rounded-full font-semibold hover:bg-white/10 transition shadow-md">
              Usar de forma anónima
            </button>
          </div>
        </div>

        {/* Tarjeta con imagen */}
        <div className="bg-white rounded-2xl overflow-hidden mt-12 md:mt-0 md:ml-16 shadow-2xl max-w-lg w-full">
          <Image
            src="/foto-panel-principal.jpg"
            alt="Apoyo emocional"
            width={700}
            height={450}
            className="object-cover w-full h-80 md:h-96"
          />
          <div className="p-8">
            <h3 className="font-bold text-gray-900 text-xl mb-3">
              Tu bienestar es nuestra prioridad
            </h3>
            <p className="text-gray-600 text-base">
              Encuentra el apoyo que necesitas en un ambiente seguro, confidencial y gratuito.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full border-t border-white/20 py-4">
        <div className="flex justify-center items-center gap-10 text-sm text-white/80">
          <a href="#" className="hover:underline">Política de privacidad</a>
          <a href="#" className="hover:underline">Líneas de ayuda inmediatas</a>
          <span className="text-red-300 font-medium">📞 Línea Nacional: 106</span>
        </div>
      </footer>
    </main>
  );
}



