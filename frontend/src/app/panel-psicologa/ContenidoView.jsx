"use client";

import { useState } from "react";
import { Eye, Edit3, Trash2, Upload } from "lucide-react";

export default function ContenidoView() {
  const [items, setItems] = useState([
    {
      id: 1,
      titulo: "Técnicas de Respiración para Ansiedad",
      categoria: "ansiedad",
      tipo: "Técnica",
      descripcion: "Guía paso a paso para ejercicios de respiración...",
      autor: "Dr. María González",
      fecha: "9/1/2024",
    },
  ]);

  const [modalEditar, setModalEditar] = useState(null);
  const [modalNuevo, setModalNuevo] = useState(null);

  /* ------------------------ Guardar Edición ------------------------ */
  const guardarEdicion = () => {
    setItems((prev) =>
      prev.map((i) => (i.id === modalEditar.id ? modalEditar : i))
    );
    setModalEditar(null);
  };

  /* ------------------------ Crear Nuevo ------------------------ */
  const crearContenido = () => {
    setItems((prev) => [
      ...prev,
      { ...modalNuevo, id: Date.now(), autor: "Admin", fecha: "Hoy" },
    ]);
    setModalNuevo(null);
  };

  /* ------------------------ Eliminar ------------------------ */
  const eliminar = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full px-2 md:px-8 pb-10 mt-4">
      
      <h2 className="text-xl font-semibold text-gray-900 mb-3">
        Gestión de Contenido
      </h2>

      {/* BOTÓN SUBIR */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() =>
            setModalNuevo({
              titulo: "",
              tipo: "Técnica",
              categoria: "",
              descripcion: "",
              imagen: "",
            })
          }
          className="flex items-center gap-2 bg-[#008060] text-white px-5 py-2.5 rounded-lg hover:bg-[#006c50] transition shadow"
        >
          <Upload className="w-4 h-4" />
          Subir Contenido
        </button>
      </div>

      {/* LISTA */}
      <div className="space-y-4 mt-1">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">

              <div>
                <div className="flex gap-3 mb-2">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {item.tipo.toUpperCase()}
                  </span>

                  <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                    {item.categoria}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  {item.titulo}
                </h3>

                <p className="text-sm text-gray-600 mt-1">{item.descripcion}</p>

                <p className="text-xs text-gray-500 mt-2">
                  Creado por {item.autor} el {item.fecha}
                </p>
              </div>

              <div className="flex items-center gap-3">

                <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                  <Eye className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={() => setModalEditar(item)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Edit3 className="w-5 h-5 text-gray-700" />
                </button>

                <button
                  onClick={() => eliminar(item.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5 text-red-600" />
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODALES */}
      {modalEditar && (
        <ModalEditar
          data={modalEditar}
          setData={setModalEditar}
          onClose={() => setModalEditar(null)}
          onSave={guardarEdicion}
        />
      )}

      {modalNuevo && (
        <ModalNuevo
          data={modalNuevo}
          setData={setModalNuevo}
          onClose={() => setModalNuevo(null)}
          onSave={crearContenido}
        />
      )}
    </div>
  );
}

/* ================================================================
   ================ MODAL EDITAR / NUEVO ===========================
================================================================ */

function ModalEditar({ data, setData, onClose, onSave }) {
  return (
    <ModalBase titulo="Editar Contenido" onClose={onClose}>
      <FormularioContenido data={data} setData={setData} />

      <button
        onClick={onSave}
        className="mt-5 w-full bg-[#008060] text-white py-2.5 rounded-lg hover:bg-[#006c50] transition flex items-center justify-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Actualizar Contenido
      </button>
    </ModalBase>
  );
}

function ModalNuevo({ data, setData, onClose, onSave }) {
  return (
    <ModalBase titulo="Nuevo Contenido" onClose={onClose}>
      <FormularioContenido data={data} setData={setData} />

      <button
        onClick={onSave}
        className="mt-5 w-full bg-[#008060] text-white py-2.5 rounded-lg hover:bg-[#006c50] transition flex items-center justify-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Subir Contenido
      </button>
    </ModalBase>
  );
}

/* ================================================================
   ====================== FORMULARIO ===============================
================================================================ */

function FormularioContenido({ data, setData }) {
  return (
    <>
      {/* TÍTULO */}
      <label className="block text-sm font-medium mb-1 text-gray-700">
        Título
      </label>
      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 bg-gray-50"
        value={data.titulo}
        onChange={(e) => setData({ ...data, titulo: e.target.value })}
      />

      <div className="grid grid-cols-2 gap-6">
        
        {/* TIPO */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">
            Tipo de Contenido
          </label>
          <select
            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
            value={data.tipo}
            onChange={(e) => setData({ ...data, tipo: e.target.value })}
          >
            <option>Artículo</option>
            <option>Video</option>
            <option>Técnica</option>
          </select>
        </div>

        {/* CATEGORÍA */}
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

      {/* DESCRIPCIÓN */}
      <label className="block text-sm font-medium mt-4 text-gray-700">
        Contenido/Descripción
      </label>
      <textarea
        className="w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 h-28 bg-gray-50"
        value={data.descripcion}
        onChange={(e) => setData({ ...data, descripcion: e.target.value })}
      />

      {/* IMAGEN */}
      <label className="block text-sm font-medium mt-4 mb-1 text-gray-700">
        Imagen (opcional)
      </label>

      <input
        type="file"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 mb-2"
      />

      <input
        type="text"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
        placeholder="URL de la imagen…"
        onChange={(e) => setData({ ...data, imagen: e.target.value })}
      />
    </>
  );
}

/* ================================================================
   ====================== MODAL BASE ===============================
================================================================ */

function ModalBase({ titulo, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 relative">
        
        {/* Cerrar */}
        <button
          className="absolute right-5 top-5 text-gray-500 hover:text-gray-800 transition text-xl"
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


