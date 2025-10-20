// sidebar.jsx
import { LayoutDashboard, Settings } from 'lucide-react';

export default function Sidebar(){
  return (
    <aside className="w-64 bg-white/80 p-4 rounded-r-2xl shadow-sm min-h-screen">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 flex items-center justify-center bg-pink-100 rounded-md">
          <svg className="w-6 h-6 text-pink-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21s-6.716-4.35-9.2-8.14C-..."></path>
          </svg>
        </div>
        <div>
          <h3 className="font-bold">MENTALIA</h3>
          <p className="text-xs text-gray-400">Plataforma de Apoyo Emocional - SENA</p>
        </div>
      </div>

      <nav className="space-y-2">
        <a className="flex items-center gap-3 p-3 rounded-lg bg-violet-50 text-violet-700">
          <LayoutDashboard className="w-5 h-5" /> <span>Panel Administrativo</span>
        </a>
        <a className="flex items-center gap-3 p-3 rounded-lg text-gray-600 hover:bg-gray-50">
          <Settings className="w-5 h-5" /> <span>Configuración</span>
        </a>
      </nav>
    </aside>
  );
}
