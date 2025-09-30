import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-500">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Columna izquierda: Texto */}
        <div className="p-12 flex flex-col justify-center text-gray-800">
          <h1 className="text-4xl font-extrabold mb-6 text-purple-700">💜 MENTALIA</h1>
          <h2 className="text-2xl font-semibold mb-4">
            Bienvenido a la plataforma de apoyo emocional del SENA
          </h2>
          <p className="mb-6 text-gray-600 leading-relaxed">
            MENTALIA es tu espacio seguro para el bienestar emocional. 
            Te acompañamos 24/7 con herramientas tecnológicas diseñadas 
            con responsabilidad y empatía.
          </p>

          {/* Lista de características */}
          <ul className="space-y-2 text-gray-700 mb-8">
            <li>⏰ Disponible 24/7</li>
            <li>🛡️ Confidencial y seguro</li>
            <li>👩‍⚕️ Apoyo profesional</li>
            <li>❤️ Sin prejuicios</li>
          </ul>

          {/* Botones */}
          <div className="flex gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition">
              Iniciar Sesión
            </button>
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg shadow-md transition">
              Usar de forma anónima
            </button>
          </div>
        </div>

        {/* Columna derecha: Imagen */}
        <div className="relative w-full h-full">
          <Image
            src="/foto-panel-principal.jpg" // asegúrate de que está en /public
            alt="Apoyo emocional"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </main>
  );
}

