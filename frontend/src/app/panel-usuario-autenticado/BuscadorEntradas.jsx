import React from "react";
import { Search } from "lucide-react";

export default function BuscadorEntradas({ value, onChange }) {
  return (
    <div className="relative w-full sm:flex-1">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Buscar en tus entradas..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm sm:text-base focus:ring-2 focus:ring-purple-400 focus:outline-none"
      />
    </div>
  );
}
