"use client";
import { Play, FileText, Link2 } from "lucide-react";

export default function RecursoCard({ item }) {
  const esVideo = item.tipo === "video";
  const esArticulo = item.tipo === "articulo";
  const esTecnica = item.tipo === "tecnica";
  const esPodcast = item.tipo === "podcast";
  const esLibro = item.tipo === "libro";
  const esEnlace = item.enlace && !item.archivoUrl;

  const imagenDefault =
    item.archivoUrl ||
    "https://images.pexels.com/photos/322552/pexels-photo-322552.jpeg";

  return (
    <div
      className="
        bg-white shadow-md rounded-2xl overflow-hidden
        w-full max-w-[350px]   /* limite máximo */
        mx-auto               /* centra */
      "
    >
      {/* Imagen */}
      <div className="relative h-[180px] sm:h-[200px] md:h-[220px] w-full">
        <img
          src={imagenDefault}
          alt="imagen recurso"
          className="object-cover w-full h-full"
        />

        {/* Badge tipo */}
        <span className="absolute top-3 left-3 bg-green-200 text-green-700 px-3 py-[3px] rounded-full text-sm">
          {item.tipo}
        </span>

        {/* Badge gratis */}
        <span className="absolute top-3 right-3 bg-emerald-200 text-emerald-700 px-3 py-[3px] rounded-full text-sm">
          Gratis
        </span>
      </div>

      {/* Contenido */}
      <div className="p-4 sm:p-5">
        <h3 className="text-lg font-semibold">{item.titulo}</h3>

        <p className="text-gray-600 mt-2 line-clamp-3 text-sm sm:text-base">
          {item.descripcion}
        </p>

        {/* Categoría */}
        <div className="mt-3">
          <span className="bg-purple-100 text-purple-700 px-3 py-[3px] rounded-full text-sm">
            {item.categoria}
          </span>
        </div>

        {/* Botón */}
        <button
          className="
            mt-4 w-full bg-purple-600 hover:bg-purple-700
            text-white font-medium py-2 rounded-lg transition
            flex items-center justify-center gap-2 text-sm sm:text-base
          "
          onClick={() => {
            if (esVideo || esEnlace) window.open(item.enlace, "_blank");
            else if (item.archivoUrl) window.open(item.archivoUrl, "_blank");
          }}
        >
          {esVideo && <Play size={18} />}
          {esArticulo && <FileText size={18} />}
          {esPodcast && <Play size={18} />}
          {esLibro && <FileText size={18} />}
          {esEnlace && <Link2 size={18} />}
          Ver recurso
        </button>
      </div>
    </div>
  );
}
