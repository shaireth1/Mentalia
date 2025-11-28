"use client";

import { useState, useEffect } from "react";
import ContenidoLista from "./ContenidoLista";
import ContenidoModalNuevo from "./ContenidoModalNuevo";
import ContenidoModalEditar from "./ContenidoModalEditar";
import ContenidoModalVer from "./ContenidoModalVer";

export default function ContenidoView() {
  const [contenido, setContenido] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);
  const [modalVer, setModalVer] = useState(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const cargarContenido = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_URL}/api/admin/contenido`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setContenido(data);
    } catch (e) {
      console.error("Error cargando contenido", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarContenido();
  }, []);

  return (
    <div className="w-full mt-2">
      {/* Título + botón */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Gestión de Contenido
        </h2>

        <button
          onClick={() => setModalNuevo(true)}
          className="px-4 py-2 bg-[#009C74] hover:bg-[#007b63] text-white rounded-lg transition"
        >
          Subir Contenido
        </button>
      </div>

      {/* Lista */}
      <ContenidoLista
        contenido={contenido}
        loading={loading}
        onVer={(item) => setModalVer(item)}
        onEditar={(item) => setModalEditar(item)}
        actualizar={cargarContenido}
      />

      {/* Modales */}
      {modalNuevo && (
        <ContenidoModalNuevo
          close={() => setModalNuevo(false)}
          actualizar={cargarContenido}
        />
      )}

      {modalEditar && (
        <ContenidoModalEditar
          item={modalEditar}
          close={() => setModalEditar(null)}
          actualizar={cargarContenido}
        />
      )}

      {modalVer && (
        <ContenidoModalVer item={modalVer} close={() => setModalVer(null)} />
      )}
    </div>
  );
}



