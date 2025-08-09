"use client"

import { useState } from "react"
import Login from "../login/login"
import Register from "../login/register"

export default function AuthNavigation() {
  const [currentView, setCurrentView] = useState<"login" | "register">("login")

  return (
    <div>
      {/* Navigation Bar */}
      <div className="bg-gray-900 text-white p-4">
        <div className="container mx-auto flex justify-center space-x-4">
          <button
            onClick={() => setCurrentView("login")}
            className={`px-6 py-2 rounded-md transition-colors ${
              currentView === "login" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setCurrentView("register")}
            className={`px-6 py-2 rounded-md transition-colors ${
              currentView === "register" ? "bg-purple-600 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {/* Content */}
      {currentView === "login" ? <Login /> : <Register />}
    </div>
  )
}
