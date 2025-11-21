export default function AlertaCritica({ cantidad }) {
  return (
    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex justify-between items-center">
      <span>⚠ {cantidad} alerta crítica sin atender</span>
      <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">
        Ver Alertas
      </button>
    </div>
  );
}

