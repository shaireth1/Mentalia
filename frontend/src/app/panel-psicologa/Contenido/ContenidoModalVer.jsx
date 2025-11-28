export default function ContenidoModalVer({ item, close }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-[500px] p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-3">{item.title}</h2>

        <p className="text-gray-700 mb-4">{item.description}</p>

        <button
          onClick={close}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}
