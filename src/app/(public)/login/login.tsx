"use client"

import type React from "react"

import { useState } from "react"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Mi Aplicación - Login</h1>
          <p className="text-sm opacity-90">Área de autenticación - Azul</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-160px)] p-6">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Card Header */}
            <div className="bg-green-500 text-white p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">Iniciar Sesión</h2>
              <p className="text-sm opacity-90">Encabezado del formulario - Verde</p>
            </div>

            {/* Form Section */}
            <div className="bg-yellow-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Formulario - Amarillo Claro</h3>

              {/* Email Field */}
              <div className="mb-4">
                <div className="bg-purple-200 p-3 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campo Email - Morado Claro</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <div className="bg-orange-200 p-3 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campo Contraseña - Naranja Claro
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="bg-red-400 p-3 rounded-lg mb-4">
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                  Botón de Envío - Rojo
                </button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="bg-teal-100 p-4">
              <h4 className="text-sm font-semibold text-gray-800 mb-3">Opciones Adicionales - Verde Azulado</h4>
              <div className="space-y-2">
                <div className="bg-teal-200 p-2 rounded text-center">
                  <a href="#" className="text-teal-700 text-sm hover:underline">
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="bg-teal-300 p-2 rounded text-center">
                  <span className="text-sm text-gray-700">¿No tienes cuenta? </span>
                  <a href="#" className="text-teal-700 font-medium hover:underline">
                    Regístrate aquí
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Social Login */}
          <div className="mt-6 bg-indigo-200 p-4 rounded-lg">
            <h4 className="text-center text-sm font-semibold text-gray-800 mb-3">Login Social - Índigo Claro</h4>
            <div className="space-y-2">
              <button className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 transition-colors">
                Continuar con Google
              </button>
              <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors">
                Continuar con Facebook
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4">
        <div className="container mx-auto text-center">
          <p className="text-sm opacity-80">Footer - Gris Oscuro | © 2024 Mi Aplicación</p>
        </div>
      </footer>
    </div>
  )
}
