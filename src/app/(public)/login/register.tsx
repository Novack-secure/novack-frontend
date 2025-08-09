"use client"

import type React from "react"

import { useState } from "react"

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-purple-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Registro</h1>
          <p className="text-sm opacity-90">Área de registro - Morado</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-160px)] p-6">
        <div className="w-full max-w-lg">
          {/* Register Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-emerald-500 text-white p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Crear Cuenta</h2>
              <p className="text-sm opacity-90">Encabezado del registro</p>
            </div>

            {/* Personal Info Section */}
            <div className="bg-blue-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Personal</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* First Name */}
                <div className="bg-cyan-200 p-3 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-cyan-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    placeholder="Juan"
                  />
                </div>

                {/* Last Name */}
                <div className="bg-lime-200 p-3 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-lime-300 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="Pérez"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="mb-4">
                <div className="bg-amber-200 p-3 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email - Ámbar</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="juan@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            <div className="bg-rose-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Seguridad - Rosa Claro</h3>

              {/* Password Field */}
              <div className="mb-4">
                <div className="bg-pink-200 p-3 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña - Rosa</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-pink-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="mb-4">
                <div className="bg-fuchsia-200 p-3 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Contraseña - Fucsia</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-fuchsia-300 rounded-md focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Terms Section */}
            <div className="bg-violet-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Términos y Condiciones - Violeta</h3>

              <div className="bg-violet-200 p-3 rounded-lg mb-4">
                <label className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-violet-600 focus:ring-violet-500 border-violet-300 rounded"
                  />
                  <span className="text-sm text-gray-700">
                    Acepto los{" "}
                    <a href="#" className="text-violet-600 hover:underline">
                      términos y condiciones
                    </a>{" "}
                    y la{" "}
                    <a href="#" className="text-violet-600 hover:underline">
                      política de privacidad
                    </a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="bg-green-400 p-3 rounded-lg">
                <button
                  className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
                  disabled={!formData.acceptTerms}
                >
                  Crear Cuenta - Verde
                </button>
              </div>
            </div>

            {/* Login Link */}
            <div className="bg-slate-100 p-4 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes cuenta?{" "}
                <a href="#" className="text-slate-600 font-medium hover:underline">
                  Inicia sesión aquí 
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-80">Footer - Gris Oscuro | © 2025 Novack</p>
        </div>
      </footer>
    </div>
  )
}
