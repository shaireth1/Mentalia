import React from "react";
import { Filter } from "lucide-react";

const options = ["Todos", "Feliz", "Normal", "Triste", "Ansioso", "Enojado"];

export default function FiltroEstado({ value, onChange }) {
  return (
    <div className="relative w-full sm:w-auto">
      <Filter
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-gray-600 text-sm sm:text-base focus:ring-2 focus:ring-purple-400 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

