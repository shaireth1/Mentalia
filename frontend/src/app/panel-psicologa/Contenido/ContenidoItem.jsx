import { Eye, Pencil, Trash2 } from "lucide-react";

export default function ContenidoItem({ data }) {
  return (
    <div className="
      bg-white 
      rounded-2xl 
      shadow-md 
      border 
      p-7 
      flex 
      justify-between 
      items-center 
      w-full
    ">
      
      {/* Columna izquierda */}
      <div className="flex flex-col">

        {/* Chips */}
        <div className="flex gap-3 mb-3">
          <span className="bg-blue-100 text-blue-600 px-4 py-1 text-xs font-semibold rounded-lg">
            {data.tipo}
          </span>

          <span className="bg-gray-100 text-gray-600 px-4 py-1 text-xs rounded-lg">
            {data.categoria}
          </span>
        </div>

        <h3 className="text-lg font-semibold mb-1">{data.titulo}</h3>
        <p className="text-gray-600 text-sm mb-2">{data.descripcion}</p>

        <p className="text-gray-500 text-xs">
          Creado por {data.creador} el {data.fecha}
        </p>
      </div>

      {/* Acciones */}
      <div className="flex gap-4">

        <button className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100 transition">
          <Eye className="w-5 h-5" />
        </button>

        <button className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-gray-100 transition">
          <Pencil className="w-5 h-5" />
        </button>

        <button className="w-10 h-10 flex items-center justify-center rounded-full border hover:bg-red-50 text-red-500 transition">
          <Trash2 className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
}

