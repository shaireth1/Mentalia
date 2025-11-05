"use client";

import { useState } from "react";
import { Search, Filter, Download, ExternalLink } from "lucide-react";

export default function RecursosView() {
  const [search, setSearch] = useState("");

  const recursos = [
    {
      id: 1,
      titulo: "Técnicas de Respiración para la Ansiedad",
      tipo: "Técnica",
      tiempo: "10 min",
      rating: 4.8,
      categoria: "Ansiedad",
      imagen: "/images/templo.jpg",
      gratis: true,
      destacado: true,
      descripcion:
        "Aprende ejercicios de respiración profunda que puedes usar en cualquier momento para reducir la ansiedad.",
    },
    {
      id: 2,
      titulo: "Cómo Manejar el Estrés Académico",
      tipo: "Artículo",
      tiempo: "8 min lectura",
      rating: 4.6,
      categoria: "Estrés",
      imagen: "/images/therapy.jpg",
      gratis: true,
      destacado: true,
      descripcion:
        "Estrategias específicas para estudiantes del SENA para gestionar la presión académica y mantener el bienestar.",
    },
    {
      id: 3,
      titulo: "Mindfulness para Principiantes",
      tipo: "Video",
      tiempo: "25 min",
      rating: 4.9,
      categoria: "Mindfulness",
      imagen: "/images/hands.jpg",
      gratis: true,
      destacado: true,
      descripcion:
        "Una introducción completa a la práctica del mindfulness con ejercicios guiados paso a paso.",
    },
  ];

  const todos = [
    {
      id: 4,
      titulo: "Podcast: Salud Mental en Estudiantes",
      tipo: "Podcast",
      tiempo: "45 min",
      rating: 4.7,
      categoria: "Estudio",
      gratis: true,
      imagen: "/images/emotion.jpg",
      descripcion:
        "Conversaciones con psicólogos especializados en el bienestar de estudiantes universitarios y técnicos.",
    },
    {
      id: 5,
      titulo: "Inteligencia Emocional - Guía Completa",
      tipo: "Libro",
      tiempo: "120 min lectura",
      rating: 4.5,
      categoria: "Relaciones",
      gratis: true,
      imagen: "/images/hands.jpg",
      descripcion:
        "Libro digital gratuito sobre el desarrollo de la inteligencia emocional en el contexto educativo.",
    },
    {
      id: 6,
      titulo: "Journaling Terapéutico",
      tipo: "Técnica",
      tiempo: "15 min",
      rating: 4.6,
      categoria: "Mindfulness",
      gratis: true,
      imagen: "/images/templo.jpg",
      descripcion:
        "Técnicas de escritura reflexiva para procesar emociones y mejorar el autoconocimiento.",
    },
  ];

  const tecnicasRapidas = [
    {
      titulo: "Respiración 4-7-8",
      descripcion: "Inhala 4 seg, mantén 7 seg, exhala 8 seg",
      boton: "Practicar ahora",
      color: "bg-purple-50 border-purple-200",
    },
    {
      titulo: "Técnica 5-4-3-2-1",
      descripcion: "Conecta con tus sentidos para reducir ansiedad",
      boton: "Comenzar",
      color: "bg-green-50 border-green-200",
    },
    {
      titulo: "Relajación Muscular",
      descripcion: "Libera tensión corporal progresivamente",
      boton: "Iniciar sesión",
      color: "bg-blue-50 border-blue-200",
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 text-gray-800">
          📚 Recursos de Bienestar
        </h2>
        <p className="text-gray-500 text-sm">
          Herramientas y contenido para tu crecimiento emocional
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-2xl p-4 flex items-center gap-3 mb-8">
        <Search className="text-gray-400" />
        <input
          type="text"
          placeholder="Buscar recursos..."
          className="flex-1 border-none outline-none bg-transparent text-gray-700"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Filter className="text-gray-400 cursor-pointer" />
      </div>

      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">
          Destacados esta semana
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recursos.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden"
            >
              <img src={r.imagen} alt={r.titulo} className="w-full h-48 object-cover" />
              <div className="p-4">
                <p className="text-sm text-purple-600 font-semibold">{r.tipo}</p>
                <h4 className="font-semibold text-gray-800">{r.titulo}</h4>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{r.descripcion}</p>
                <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                  <span>{r.tiempo}</span>
                  <span className="text-yellow-500">⭐ {r.rating}</span>
                </div>
                <button className="mt-4 w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 flex items-center justify-center gap-2">
                  Ver recurso <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Todos los recursos</h3>
        <div className="flex flex-col gap-4">
          {todos.map((r) => (
            <div
              key={r.id}
              className="bg-white rounded-2xl shadow hover:shadow-md transition p-4 flex items-center gap-4"
            >
              <img
                src={r.imagen}
                alt={r.titulo}
                className="w-40 h-28 object-cover rounded-xl"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{r.titulo}</h4>
                <p className="text-gray-500 text-sm mt-1">{r.descripcion}</p>
                <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                  <span>{r.tiempo}</span>
                  <span className="text-yellow-500">⭐ {r.rating}</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="bg-gray-100 text-gray-600 rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-gray-200">
                  <Download size={16} /> Descargar
                </button>
                <button className="bg-purple-600 text-white rounded-xl px-4 py-2 flex items-center gap-2 hover:bg-purple-700">
                  Ver recurso <ExternalLink size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Técnicas Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tecnicasRapidas.map((t, i) => (
            <div
              key={i}
              className={`border rounded-2xl p-4 ${t.color} flex flex-col justify-between`}
            >
              <div>
                <h4 className="font-semibold text-gray-800">{t.titulo}</h4>
                <p className="text-gray-600 text-sm mt-1">{t.descripcion}</p>
              </div>
              <button className="mt-4 bg-white text-gray-800 font-medium px-4 py-2 rounded-xl shadow hover:bg-gray-100">
                {t.boton}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
