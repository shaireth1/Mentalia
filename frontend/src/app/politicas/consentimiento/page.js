"use client";

export default function ConsentimientoPage() {
  return (
    <main className="min-h-screen bg-[#f6f4fb] px-6 py-10 flex justify-center">
      <div className="max-w-3xl bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">
          Consentimiento Informado para el Tratamiento de Datos Personales
        </h1>

        <p className="text-sm text-gray-700 mb-4">
          En cumplimiento de la <strong>Ley 1581 de 2012</strong>, el Decreto 1377 de 2013 y
          los lineamientos de ética digital del <strong>SENA</strong>, MENTALIA informa:
        </p>

        <h2 className="font-semibold mt-4 mb-2">1. Datos recolectados</h2>
        <p className="text-sm text-gray-700">
          Nombre, edad, género, correo electrónico, teléfono, programa de formación
          y datos relacionados con el uso de la plataforma.
        </p>

        <h2 className="font-semibold mt-4 mb-2">2. Finalidad</h2>
        <p className="text-sm text-gray-700">
          Los datos serán usados exclusivamente para:
        </p>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Autenticación y gestión de usuarios</li>
          <li>Seguimiento emocional</li>
          <li>Atención psicológica y estadística institucional</li>
          <li>Mejora del servicio</li>
        </ul>

        <h2 className="font-semibold mt-4 mb-2">3. Datos sensibles</h2>
        <p className="text-sm text-gray-700">
          MENTALIA podrá tratar datos sensibles relacionados con el estado emocional
          <strong>únicamente con consentimiento explícito</strong>.
        </p>

        <h2 className="font-semibold mt-4 mb-2">4. Derechos del titular</h2>
        <ul className="list-disc ml-6 text-sm text-gray-700">
          <li>Conocer, actualizar y rectificar sus datos</li>
          <li>Solicitar eliminación de datos</li>
          <li>Revocar el consentimiento</li>
        </ul>

        <h2 className="font-semibold mt-4 mb-2">5. Seguridad</h2>
        <p className="text-sm text-gray-700">
          La información es protegida mediante cifrado, autenticación segura y
          control de accesos.
        </p>

        <p className="text-xs text-gray-500 mt-6">
          Última actualización: Diciembre 2025
        </p>
      </div>
    </main>
  );
}
