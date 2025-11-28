export default function TarjetaLog({ log }) {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-center">
        <h4 className="font-semibold text-purple-700 text-sm">
          {log.action}
        </h4>

        <span className="text-xs text-gray-500">
          {new Date(log.createdAt).toLocaleString()}
        </span>
      </div>

      <p className="text-sm text-gray-700 mt-2">
        Usuario ID: <strong>{log.adminId}</strong>
      </p>

      <p className="text-xs text-gray-600 mt-1">
        Acción realizada en: <strong>{log.route}</strong>
      </p>

      {log.details && (
        <p className="text-xs text-gray-500 mt-1">
          Detalles: {JSON.stringify(log.details)}
        </p>
      )}
    </div>
  );
}
