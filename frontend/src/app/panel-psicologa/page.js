"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function PsicologaPage() {
  const router = useRouter();
  const [psicologa, setPsicologa] = useState({
    nombre: "Dra. Laura Martínez",
    correo: "laura@mentalia.com",
    especialidad: "Psicología clínica",
  });

  const data = [
    { nombre: "Pacientes", valor: 10 },
    { nombre: "Sesiones", valor: 25 },
    { nombre: "Casos activos", valor: 8 },
  ];

  const handleLogout = () => {
    router.push("/"); // redirige al inicio (app/page.js)
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Panel de Psicóloga</h1>
        <Button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 text-white">
          Salir
        </Button>
      </div>

      <Card className="p-4">
        <CardContent>
          <p><strong>Nombre:</strong> {psicologa.nombre}</p>
          <p><strong>Correo:</strong> {psicologa.correo}</p>
          <p><strong>Especialidad:</strong> {psicologa.especialidad}</p>
        </CardContent>
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-2">Estadísticas</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <XAxis dataKey="nombre" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="valor" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
