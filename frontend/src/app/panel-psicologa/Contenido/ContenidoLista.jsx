import { Eye, Trash2, Pencil } from "lucide-react";

export default function ContenidoLista({
  contenido,
  loading,
  onVer,
  onEditar,
  actualizar,
}) {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const eliminarContenido = async (id) => {
    if (!confirm("¿Eliminar este contenido?")) return;

    try {
      const token = localStorage.getItem("token");

      await fetch(`${API_URL}/api/admin/contenido/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      actualizar();
    } catch (e) {
      console.error("Error eliminando", e);
    }
  };

  if (loading) return <p className="text-gray-500">Cargando contenido...</p>;

  if (contenido.length === 0)
    return (
      <p className="text-gray-500 text-sm">No hay contenido configurado.</p>
    );

  return (
    <div className="flex flex-col gap-4">
      {contenido.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-between items-start"
        >
          <div className="flex flex-col">
            {/* Tags */}
            <div className="flex gap-2 mb-1">
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-600 font-semibold">
                {item.category.toUpperCase()}
              </span>

              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                {item.tag}
              </span>
            </div>

            <h3 className="text-gray-900 font-semibold">{item.title}</h3>

            <p className="text-gray-600 text-sm">{item.description}</p>

            <p className="text-xs text-gray-400 mt-1">
              Creado por {item.author} el {item.date}
            </p>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={() => onVer(item)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <Eye size={18} />
            </button>

            <button
              onClick={() => onEditar(item)}
              className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={() => eliminarContenido(item._id)}
              className="p-2 bg-red-100 hover:bg-red-200 rounded-lg text-red-600"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

