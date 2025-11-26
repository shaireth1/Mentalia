"use client";

import { Search } from "lucide-react";

export default function BuscadorRecursos() {
  return (
    <div className="flex items-center gap-2 bg-[#f3ecff] border border-[#d7c9ff] px-4 py-2 rounded-xl w-full md:w-64">
      <Search className="w-5 h-5 text-[#7b61ff]" />
      <input
        type="text"
        placeholder="Buscar recursos..."
        className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500"
      />
    </div>
  );
}

