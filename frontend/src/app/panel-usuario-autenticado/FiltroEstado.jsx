import React from "react";
import { Filter } from "lucide-react";

export default function FiltroEstado() {
  return (
    <div className="relative">
      <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
      <select className="appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-gray-600 focus:ring-2 focus:ring-purple-400 focus:outline-none">
        <option>Todos los estados</option>
        <option>Feliz</option>
        <option>Normal</option>
        <option>Triste</option>
        <option>Ansioso</option>
      </select>
    </div>
  );
}

