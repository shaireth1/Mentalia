export default function ContenidoModalEditar({ item, close, actualizar }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-[400px] p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-3">Editar Contenido</h2>

        <p className="text-gray-600 text-sm mb-4">
          Editando: <strong>{item.title}</strong>
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={close}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
          >
            Cancelar
          </button>

          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}

