"use client";

import {
  Clock,
  Star,
  ExternalLink,
  FileText,
  Play,
  Mic,
  BookOpen,
  CircleAlert,
} from "lucide-react";

export default function TarjetaRecurso({
  titulo,
  descripcion,
  tipo,
  categoria,
  tiempo,
  rating,
  imagen,
  gratis,
  onClick,
}) {
  const iconosTipo = {
    Técnica: CircleAlert,   // EXACTO al icono de la captura
    Artículo: FileText,
    Video: Play,
    Podcast: Mic,
    Libro: BookOpen,
  };

  const Icono = iconosTipo[tipo] || FileText;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden">
      
      {/* Imagen */}
      <div className="relative w-full h-40">
        <img src={imagen} alt={titulo} className="w-full h-full object-cover" />

        {/* Badge tipo EXACTO */}
        <div className="absolute top-2 left-2 flex items-center gap-1 
            bg-white/90 px-3 py-1 rounded-full text-xs font-medium shadow-sm 
            text-gray-700">
          <Icono size={14} className="text-green-700" />
          {tipo}
        </div>

        {/* Badge gratis */}
        {gratis && (
          <div className="absolute top-2 right-2 bg-green-100 text-green-700 
              px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
            Gratis
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">

        <h3 className="text-lg font-semibold text-gray-800">{titulo}</h3>

        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {descripcion}
        </p>

        {/* Tiempo + rating */}
        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          
          <div className="flex items-center gap-1">
            <Clock size={15} />
            {tiempo}
          </div>

          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={16} fill="#facc15" stroke="none" />
            <span className="text-gray-700">{rating}</span>
          </div>

        </div>

        {/* Categoría */}
        <div className="mt-3">
          <span className="text-xs bg-purple-100 text-purple-700 
              px-3 py-1 rounded-full font-medium">
            {categoria}
          </span>
        </div>

        {/* Botón Ver recurso */}
        <div className="flex justify-end mt-4">
          <button className="flex items-center gap-2 bg-[#7b63ff] 
              hover:bg-[#684ce8] transition text-white text-sm 
              px-4 py-1.5 rounded-lg">
            Ver recurso
            <ExternalLink size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}



