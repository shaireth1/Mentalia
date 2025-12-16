"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowLeft, Eye } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

/* 🔹 Estilos reutilizables */
const label =
  "block text-sm font-semibold text-purple-700 mb-1 tracking-wide";
const input =
  "w-full border border-purple-200 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-purple-400 focus:outline-none text-sm";

/* ✅ VALIDACIÓN CORRECTA DE CORREO (GENÉRICA Y REAL) */
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function Register() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 🔴 FIX

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
    consentimiento: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleNumericChange = (e, maxLength) => {
    const { name, value } = e.target;
    let cleanValue = value.replace(/\D/g, "");
    if (maxLength) cleanValue = cleanValue.slice(0, maxLength);

    setFormData({
      ...formData,
      [name]: cleanValue,
    });
  };

  const onlyNumbersKeyDown = (e) => {
    if (
      !/[0-9]/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      e.key !== "Tab"
    ) {
      e.preventDefault();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // 🔴 FIX
    setLoading(true);

    try {
      if (!formData.consentimiento) {
        alert("⚠️ Debes aceptar el consentimiento informado para continuar.");
        return;
      }

      if (!emailRegex.test(formData.email.trim())) {
        alert("⚠️ Ingrese un correo electrónico válido.");
        return;
      }

      if (formData.password.length < 8) {
        alert("⚠️ La contraseña debe tener mínimo 8 caracteres.");
        return;
      }

      const body = {
        nombre: formData.fullName,
        identificacion: formData.idNumber,
        edad: formData.age,
        genero: formData.gender,
        programa: formData.program,
        ficha: formData.ficha,
        telefono: formData.phone,
        email: formData.email.trim(),
        password: formData.password,
        consentimientoDatos: true,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("✅ Usuario registrado con éxito");
        router.push("/login");
      } else {
        alert("❌ " + (data.msg || data.error));
      }
    } finally {
      setLoading(false); // 🔴 FIX
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3e8ff] font-sans p-6 relative">

      {/* Volver */}
      <div className="absolute top-6 left-6 flex items-center gap-2 text-purple-700 hover:underline cursor-pointer">
        <ArrowLeft className="w-4 h-4" />
        <Link href="/" className="text-sm font-medium">
          Volver
        </Link>
      </div>

      {/* Logo */}
      <div className="absolute top-6 right-8 flex flex-col items-center text-purple-700">
        <div className="flex items-center">
          <Heart className="w-6 h-6 mr-2" />
          <span className="text-xl font-medium tracking-wide">MENTALIA</span>
        </div>
        <span className="text-xs text-purple-500 -mt-1">SENA</span>
      </div>

      <div className="flex flex-col md:flex-row max-w-5xl mx-auto w-full gap-10 items-center justify-center">
        {/* PANEL IZQUIERDO */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full md:w-[60%] flex flex-col">
          <div className="h-[280px] w-full overflow-hidden">
            <Image
              src="/registrarse.png.png"
              alt="Bienestar"
              width={600}
              height={400}
              className="w-full h-full object-cover object-[50%_25%]"
            />
          </div>
          <div className="p-6">
            <h2 className="text-lg font-semibold text-purple-700 mb-2">
              Tecnología al servicio de tu bienestar
            </h2>
            <p className="text-sm text-purple-500 leading-relaxed">
              Únete a nuestra comunidad y accede a herramientas personalizadas
              para tu crecimiento emocional.
            </p>
          </div>
        </div>

        {/* PANEL DERECHO */}
        <div className="bg-white rounded-2xl shadow-md p-6 w-full md:w-[60%]">
          <h2 className="text-2xl font-semibold text-center text-purple-700 mb-1">
            Crear Cuenta
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              <div>
                <label className={label}>Nombre Completo *</label>
                <input
                  name="fullName"
                  type="text"
                  className={input}
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className={label}>Identificación *</label>
                <input
                  name="idNumber"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  className={input}
                  value={formData.idNumber}
                  onKeyDown={onlyNumbersKeyDown}
                  onChange={(e) => handleNumericChange(e, 10)}
                  required
                />
              </div>

              <div>
                <label className={label}>Edad *</label>
                <input
                  name="age"
                  type="number"
                  className={input}
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label className={label}>Género *</label>
                <select
                  name="gender"
                  className={input}
                  value={formData.gender}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona tu género</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={label}>Programa de Formación *</label>
                <select
                  name="program"
                  className={input}
                  value={formData.program}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona tu programa</option>
                  <option value="Análisis y Desarrollo de Software">
                    Análisis y Desarrollo de Software
                  </option>
                  <option value="Producción de Multimedia">
                    Producción de Multimedia
                  </option>
                  <option value="Gestión de Redes de Datos">
                    Gestión de Redes de Datos
                  </option>
                  <option value="Contabilidad y Finanzas">
                    Contabilidad y Finanzas
                  </option>
                  <option value="Gestión del Talento Humano">
                    Gestión del Talento Humano
                  </option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <div>
                <label className={label}>Número de Ficha *</label>
                <input
                  name="ficha"
                  type="text"
                  inputMode="numeric"
                  maxLength={7}
                  className={input}
                  value={formData.ficha}
                  onKeyDown={onlyNumbersKeyDown}
                  onChange={(e) => handleNumericChange(e, 7)}
                  required
                />
              </div>

              <div>
                <label className={label}>Teléfono *</label>
                <input
                  name="phone"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  className={input}
                  value={formData.phone}
                  onKeyDown={onlyNumbersKeyDown}
                  onChange={(e) => handleNumericChange(e, 10)}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={label}>Correo Electrónico *</label>
                <input
                  name="email"
                  type="email"
                  className={input}
                  value={formData.email}
                  onChange={handleChange}
                  required
                  pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  title="Ingrese un correo electrónico válido"
                />
              </div>

              <div className="md:col-span-2 relative">
                <label className={label}>Contraseña *</label>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`${input} pr-10`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Eye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 w-5 h-5 text-gray-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Consentimiento */}
            <div className="flex items-start gap-3 text-xs text-gray-600 mt-2">
              <input
                type="checkbox"
                name="consentimiento"
                checked={formData.consentimiento}
                onChange={handleChange}
                className="mt-1 w-4 h-4"
                required
              />
              <p>
                Acepto el{" "}
                <Link
                  href="/politicas/consentimiento"
                  target="_blank"
                  className="text-purple-700 underline"
                >
                  consentimiento informado para el tratamiento de datos
                </Link>
                .
              </p>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold"
            >
              Crear Cuenta
            </button>
          </form>

          <p className="text-sm text-center text-purple-600 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-purple-800 font-medium">
              Iniciar sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
