import Link from "next/link";
import { LayoutDashboard, Settings, FileWarning, Book, BarChart4 } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white/80 p-4 rounded-r-2xl shadow-sm min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center bg-violet-200 rounded-md">
          <span className="text-violet-700 font-bold text-lg">Ψ</span>
        </div>

        <div>
          <h3 className="font-bold">MENTALIA</h3>
          <p className="text-xs text-gray-400">Panel Administrativo</p>
        </div>
      </div>

      <nav className="space-y-2">
        <Link
          href="/panel-psicologa"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 text-gray-700"
        >
          <LayoutDashboard className="w-5 h-5" /> <span>Dashboard</span>
        </Link>

        <Link
          href="/panel-psicologa/frases"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-violet-50 text-gray-700"
        >
          <FileWarning className="w-5 h-5" /> <span>Frases de Riesgo</span>
        </Link>

        <Link
          href="/panel-psicologa/alertas"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700"
        >
          <Book className="w-5 h-5" /> <span>Alertas</span>
        </Link>

        <Link
          href="/panel-psicologa/exportaciones"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700"
        >
          <BarChart4 className="w-5 h-5" /> <span>Exportaciones</span>
        </Link>

        <Link
          href="/panel-psicologa/ajustes"
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 text-gray-700"
        >
          <Settings className="w-5 h-5" /> <span>Ajustes</span>
        </Link>
      </nav>
    </aside>
  );
}
