"use client";

export default function ContenidoFormulario({ data, setData }) {
  return (
    <>
      <label className="block text-sm font-medium mb-1 text-gray-700">
        Título
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 bg-gray-50"
        value={data.titulo || ""}
        onChange={(e) => setData({ ...data, titulo: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Tipo
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
            value={data.tipo}
            onChange={(e) => setData({ ...data, tipo: e.target.value })}
          >
            <option>Artículo</option>
            <option>Video</option>
            <option>Técnica</option>
            <option>Guía</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Categoría
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
            value={data.categoria}
            onChange={(e) => setData({ ...data, categoria: e.target.value })}
          />
        </div>
      </div>

      <label className="block text-sm font-medium mt-4 text-gray-700">
        Descripción
      </label>
      <textarea
        className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 h-28 bg-gray-50"
        value={data.descripcion}
        onChange={(e) =>
          setData({ ...data, descripcion: e.target.value })
        }
      />
    </>
  );
}
