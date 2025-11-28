"use client";

export default function ModalBase({ titulo, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 relative">
        <button
          className="absolute right-5 top-5 text-gray-500 hover:text-gray-800 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <h3 className="text-xl font-semibold text-gray-900 mb-5">
          {titulo}
        </h3>

        {children}
      </div>
    </div>
  );
}
