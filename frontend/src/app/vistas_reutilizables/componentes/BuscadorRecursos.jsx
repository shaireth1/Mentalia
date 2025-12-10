"use client";

import { Search } from "lucide-react";

export default function BuscadorRecursos({ value, onChange }) {
  return (
    <div className="flex items-center gap-3 bg-[#f7f5ff] border border-[#e0d5ff]
      px-4 py-3 rounded-xl w-full max-w-full sm:max-w-md lg:max-w-lg transition-all">
      
      <Search className="w-5 h-5 text-[#7b61ff] shrink-0" />

      <input
        type="text"
        placeholder="Buscar recursos..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent w-full outline-none text-gray-700 
        placeholder-gray-400 text-sm sm:text-base"
      />
    </div>
  );
}