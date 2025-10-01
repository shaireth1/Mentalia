import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 to-indigo-400">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
        {/* Texto Izquierda */}
        <div className="text-white max-w-lg">
          <div className="bg-white/20 text-sm px-4 py-1 rounded-full inline-block mb-6">
            SENA - Servicio Nacional de Aprendizaje
          </div>

          <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-2">
            <span className="text-5xl">💜</span> MENTALIA
          </h1>
          <p className="text-lg font-medium mb-6">
            Plataforma de Apoyo Emocional
          </p>

          <h2 className="text-2xl font-bold mb-4">
            Bienvenido a la plataforma de apoyo emocional del SENA
          </h2>

          <p className="mb-6 leading-relaxed">
            MENTALIA es tu espacio seguro para el bienestar emocional. Te
            acompañamos 24/7 con herramientas tecnológicas diseñadas con
            responsabilidad y empatía.
          </p>

          {/* Iconos de beneficios */}
          <div className="grid grid-cols-2 gap-3 text-sm mb-8">
            <div className="flex items-center gap-2">
              <span className="text-yellow-300">⏰</span> Disponible 24/7
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-300">🛡️</span> Confidencial y seguro
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-300">👩‍⚕️</span> Apoyo profesional
            </div>
            <div className="flex items-center gap-2">
              <span className="text-pink-300">❤️</span> Sin prejuicios
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-purple-700 rounded-lg font-semibold hover:bg-purple-800 transition">
              Iniciar Sesión
            </button>
            <button className="px-6 py-2 bg-white/20 border border-white rounded-lg font-semibold hover:bg-white/30 transition">
              Usar de forma anónima
            </button>
          </div>
        </div>

        {/* Imagen Derecha */}
        <div className="bg-white rounded-2xl overflow-hidden mt-12 md:mt-0 md:ml-12 shadow-lg max-w-md">
          <Image
            src="/foto-panel-principal.jpg" 
            alt="Apoyo emocional"
            width={500}
            height={300}
            className="object-cover w-full h-64"
          />
          <div className="p-6">
            <h3 className="font-bold text-gray-800 text-lg mb-2">
              Tu bienestar es nuestra prioridad
            </h3>
            <p className="text-gray-600 text-sm">
              Encuentra el apoyo que necesitas en un ambiente seguro,
              confidencial y gratuito.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 text-center text-sm text-white/80 w-full">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <a href="#" className="hover:underline">
            Política de privacidad
          </a>
          <a href="#" className="hover:underline">
            Líneas de ayuda inmediatas
          </a>
          <span className="text-red-300">📞 Línea Nacional: 106</span>
        </div>
      </footer>
    </main>
  );
}


