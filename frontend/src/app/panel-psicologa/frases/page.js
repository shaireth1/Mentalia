"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FrasesPage() {
  const router = useRouter();
  const [frases, setFrases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nuevaFrase, setNuevaFrase] = useState("");
  const [editando, setEditando] = useState(null);
  const [editValue, setEditValue] = useState("");

  const token = localStorage.getItem("token"); // 🔥 JWT real guardado por login

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

  // 🔥 Cargar lista del backend
  const cargarFrases = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/crisis-phrases`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setFrases(data);
    } catch (error) {
      console.error("Error obteniendo frases:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return router.push("/");
    cargarFrases();
  }, []);

  // ➕ Agregar frase
  const agregarFrase = async () => {
    if (!nuevaFrase.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/crisis-phrases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: nuevaFrase }),
      });

      await res.json();
      setNuevaFrase("");
      cargarFrases();
    } catch (err) {
      console.log(err);
    }
  };

  // ✏ Editar frase
  const guardarEdicion = async (id) => {
    try {
      await fetch(`${API_URL}/api/admin/crisis-phrases/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editValue }),
      });

      setEditando(null);
      cargarFrases();
    } catch (err) {
      console.log(err);
    }
  };

  // 🗑 Eliminar frase
  const eliminarFrase = async (id) => {
    try {
      await fetch(`${API_URL}/api/admin/crisis-phrases/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      cargarFrases();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex flex-col">
      <header className="bg-white/70 backdrop-blur-md shadow-md p-5 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-700">Gestión de Frases de Riesgo</h1>
        <button
          onClick={() => router.push("/panel-psicologa")}
          className="text-indigo-700 hover:text-indigo-500 font-medium"
        >
          ⬅ Volver
        </button>
      </header>

      <section className="flex flex-col items-center py-10 px-6 flex-1 w-full">
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-2xl">
          <h2 className="text-xl font-semibold text-indigo-700 mb-4">Agregar Nueva Frase</h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Escribe una frase de riesgo..."
              className="flex-1 border p-2 rounded-md"
              value={nuevaFrase}
              onChange={(e) => setNuevaFrase(e.target.value)}
            />
            <button
              onClick={agregarFrase}
              className="bg-indigo-600 text-white px-4 rounded-md hover:bg-indigo-700 flex items-center gap-2"
            >
              <Plus size={18} /> Agregar
            </button>
          </div>
        </div>

        <h2 className="text-3xl font-semibold text-indigo-700 mt-10 mb-6">Frases Registradas</h2>

        {loading ? (
          <p className="text-gray-600">Cargando...</p>
        ) : (
          <ul className="bg-white rounded-xl shadow-md w-full max-w-2xl divide-y divide-gray-200">
            {frases.map((f) => (
              <li key={f._id} className="p-4 flex justify-between items-center hover:bg-indigo-50 transition">
                {editando === f._id ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border p-2 flex-1 mr-3 rounded-md"
                  />
                ) : (
                  <span>{f.text}</span>
                )}

                <div className="flex gap-3">
                  {editando === f._id ? (
                    <button
                      onClick={() => guardarEdicion(f._id)}
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditando(f._id);
                        setEditValue(f.text);
                      }}
                      className="text-yellow-600 hover:text-yellow-800"
                    >
                      <Edit size={20} />
                    </button>
                  )}

                  <button
                    onClick={() => eliminarFrase(f._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
