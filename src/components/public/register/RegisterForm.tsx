"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Create supplier
      const supplierData = {
        supplier_name: `${formData.first_name} ${formData.last_name}`,
        supplier_creator: `${formData.first_name} ${formData.last_name}`,
        contact_email: formData.email,
        phone_number: formData.phone,
        address: "",
        description: "",
        logo_url: "",
        additional_info: {},
        is_subscribed: false,
        has_card_subscription: false,
        has_sensor_subscription: false,
        employee_count: 1,
        card_count: 0,
        creator_password: formData.password,
      };
      await api.post("/suppliers", supplierData);

      // Login (backend created the employee with the provided password)
      const loginResponse = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      const token =
        loginResponse.data?.access_token ||
        loginResponse.data?.token ||
        loginResponse.data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        router.push("/home");
      } else {
        setError("Error al obtener token de autenticación.");
      }
    } catch (err) {
      type ErrorWithResponse = {
        response?: { data?: { message?: unknown } };
        message?: unknown;
      };
      const e = err as ErrorWithResponse;
      const raw =
        e?.response?.data?.message ??
        e?.message ??
        "Error al registrarse. Verifica tus datos.";
      const message = Array.isArray(raw) ? raw.join(", ") : String(raw);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-900 via-gray-800 to-black">
      <Card className="w-full max-w-md mx-4 bg-white/10 backdrop-blur-sm border-white/20 text-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Registrarse</CardTitle>
          <CardDescription className="text-gray-300">
            Crea tu cuenta para comenzar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">Nombre</Label>
                <Input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                  placeholder="Juan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Apellido</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                  placeholder="Pérez"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                placeholder="tu@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                placeholder="+56912345678"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="bg-white/5 border-white/20 text-white placeholder-gray-400"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <div className="text-red-400 text-sm text-center">{error}</div>
            )}
            <Button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-cyan-400 hover:text-cyan-300 text-sm"
            >
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
