import { Users, LineChart, BarChart3, AlertTriangle } from "lucide-react";

export default function EstadisticasCards() {
  const stats = [
    { title: "Usuarios Totales", value: 1247, icon: <Users className="text-purple-600 w-8 h-8" /> },
    { title: "Sesiones Activas", value: 342, icon: <LineChart className="text-blue-600 w-8 h-8" /> },
    { title: "Sesiones Chatbot", value: 1834, icon: <BarChart3 className="text-purple-600 w-8 h-8" /> },
    { title: "Alertas Hoy", value: 0, icon: <AlertTriangle className="text-red-600 w-8 h-8" /> },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
      {stats.map((s) => (
        <div
          key={s.title}
          className="bg-white shadow-sm rounded-xl p-5 border border-gray-200 flex justify-between items-center"
        >
          <div>
            <p className="text-sm text-gray-500">{s.title}</p>
            <h2 className="text-2xl font-semibold mt-2 text-gray-900">{s.value}</h2>
          </div>
          {s.icon}
        </div>
      ))}
    </div>
  );
}
