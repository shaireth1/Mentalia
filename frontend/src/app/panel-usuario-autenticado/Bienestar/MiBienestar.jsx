"use client";

import { TrendingUp, PieChart, Calendar, Smile, Star, Bolt, Brain, Crosshair } from "lucide-react";

import EvolucionEmocionalChart from "../Bienestar/EvolucionEmocionalChart";
import DistribucionEmocionesChart from "../Bienestar/DistribucionEmocionesChart";


export default function MiBienestar() {
  return (
    <div className="space-y-8">

      {/* TÍTULO */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Mi Bienestar Emocional
        </h1>
        <p className="text-gray-600 -mt-1">
          Seguimiento y análisis de tu estado emocional
        </p>
      </div>

      {/* TARJETAS SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Promedio semanal */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Promedio Semanal</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-3xl font-bold text-purple-600">4.1/5</p>
            <Smile className="h-8 w-8 text-purple-500 bg-purple-100 p-2 rounded-full" />
          </div>
          <p className="text-green-600 text-sm mt-2">+0.3 vs semana anterior</p>
        </div>

        {/* Días registrados */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Días Registrados</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-3xl font-bold text-indigo-600">5/7</p>
            <Calendar className="h-8 w-8 text-indigo-500 bg-indigo-100 p-2 rounded-full" />
          </div>
        </div>

        {/* Emoción principal */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Emoción Principal</p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-3xl font-bold text-green-600">Feliz</p>
            <Star className="h-8 w-8 text-green-500 bg-green-100 p-2 rounded-full" />
          </div>
          <p className="text-sm text-gray-600 mt-1">35% del tiempo</p>
        </div>

      </div>

      {/* GRÁFICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Evolución emocional */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Evolución emocional
          </p>
          <EvolucionEmocionalChart />
        </div>

        {/* Distribución de emociones */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PieChart className="h-5 w-5 text-purple-600" />
            Distribución de emociones
          </p>
          <DistribucionEmocionesChart />
        </div>

      </div>

      {/* INSIGHTS PERSONALIZADOS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Bolt className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold text-gray-800">Insights Personalizados</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Tendencia positiva */}
          <div className="flex items-start gap-4 border rounded-xl p-4 bg-white">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-green-100">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Tendencia positiva</p>
              <p className="text-gray-600 text-sm mt-1">
                Tu bienestar ha mejorado un 15% esta semana.
              </p>
            </div>
          </div>

          {/* Mindfulness */}
          <div className="flex items-start gap-4 border rounded-xl p-4 bg-white">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-purple-100">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Mindfulness</p>
              <p className="text-gray-600 text-sm mt-1">
                Has registrado 5 días consecutivos de estado emocional.
              </p>
            </div>
          </div>

          {/* Meta semanal */}
          <div className="flex items-start gap-4 border rounded-xl p-4 bg-white">
            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-blue-100">
              <Crosshair className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">Meta semanal</p>
              <p className="text-gray-600 text-sm mt-1">
                Estás a solo 2 registros de completar tu meta semanal.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}


