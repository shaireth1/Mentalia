"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft, Eye } from "lucide-react";
import { useState } from "react";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    age: "",
    gender: "",
    program: "",
    ficha: "",
    email: "",
    phone: "",
    password: "",
  });

  // Manejo del cambio en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejo del submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Usuario registrado con éxito");
        console.log(data);
      } else {
        alert("❌ Error: " + data.error);
      }
    } catch (err) {
      console.error("Error en el registro:", err);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3e8ff] font-sans p-6">
      <div className="absolute top-6 left-6 flex items-center gap-2 text-purple-700 hover:underline cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        <Link href="/" className="text-sm font-medium">
          Volver
        </Link>
      </div>

      <div className="flex max-w-6xl w-full gap-6">
        {/* Panel izquierdo */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-1/2 hidden md:block">
          <Image
            src="/icono-registrarse.jpg"
            alt="Bienestar"
            width={600}
            height={400}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Tecnología al servicio de tu bienestar
            </h2>
            <p className="text-sm text-purple-500">
              Únete a nuestra comunidad y accede a herramientas personalizadas
              para tu crecimiento emocional.
            </p>
          </div>
        </div>


        
      

        {/* Panel derecho: Registro */}
        <div className="bg-white rounded-2xl shadow-md p-10 w-full md:w-1/2">
          <div className="flex items-center justify-center mb-8">
            <Heart className="w-6 h-6 text-purple-600 mr-2" />
            <div>
              <h1 className="text-xl font-bold text-purple-700 leading-none">
                MENTALIA
              </h1>
              <p className="text-xs text-gray-500">SENA</p>
            </div>
          </div>


          <h2 className="text-xl font-semibold text-center text-purple-800 mb-2">
            Crear cuenta
          </h2>
          <p className="text-sm text-center text-purple-500 mb-6">
            Completa tus datos para registrarte
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input name="fullName" type="text" placeholder="Nombre completo" className="input" onChange={handleChange} required />
            <input name="idNumber" type="text" placeholder="Número de documento" className="input" onChange={handleChange} required />
            <input name="age" type="number" placeholder="Edad" className="input" onChange={handleChange} required />
            <select name="gender" className="input" onChange={handleChange} required>
              <option value="">Selecciona género</option>
              <option value="female">Femenino</option>
              <option value="male">Masculino</option>
              <option value="other">Otro</option>
            </select>
            <input name="program" type="text" placeholder="Programa de formación" className="input" onChange={handleChange} required />
            <input name="ficha" type="text" placeholder="Ficha" className="input" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Correo electrónico" className="input" onChange={handleChange} required />
            <input name="phone" type="text" placeholder="Teléfono" className="input" onChange={handleChange} />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                className="input pr-10"
                onChange={handleChange}
                required
              />
              <Eye
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 w-5 h-5 text-gray-500 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Registrarse
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="text-purple-600 font-medium hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

// clases tailwind reutilizadas
const input = "mt-1 w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400 focus:outline-none";
