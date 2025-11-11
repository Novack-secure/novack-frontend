"use client";

import { useState } from "react";
import { Globe } from "@/components/ui/globe";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { Lock, Mail } from "lucide-react";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_creator: boolean;
  supplier?: {
    id: string;
    supplier_name: string;
  };
}

interface LoginResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  employee?: User;
  requires2FA?: boolean;
  phoneNumber?: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const data: LoginResponse = response.data;

      if (data.requires2FA) {
        const employeeId = data.employee?.id;
        setUserId(typeof employeeId === "string" ? employeeId : "");
        setShowOtp(true);
        return undefined;
      }

      if (data.access_token && data.employee) {
        login(data.access_token, data.refresh_token || "", data.employee);
        router.push("/home");
        return;
      }

      setError("Error al obtener token de autenticación.");
    } catch (err) {
      type ErrorWithMessage = {
        response?: { data?: { message?: unknown } };
        message?: unknown;
      };
      const e = err as ErrorWithMessage;
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

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login/sms-verify", {
        userId,
        otp,
      });

      const data: LoginResponse = response.data;

      if (data.access_token && data.employee) {
        login(data.access_token, data.refresh_token || "", data.employee);
        router.push("/home");
        return;
      }

      setError("Error al verificar código OTP.");
    } catch (err) {
      type ErrorWithMessage = {
        response?: { data?: { message?: unknown } };
        message?: unknown;
      };
      const e = err as ErrorWithMessage;
      const raw =
        e?.response?.data?.message ||
        e?.message ||
        "Error al verificar código OTP.";
      const message = Array.isArray(raw) ? raw.join(", ") : String(raw);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-black overflow-hidden">
      {/* Left Side - Login Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-1/2 p-8 lg:p-16 relative overflow-hidden">
        {/* Grid Pattern Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 w-full max-w-md">
          {/* Logo */}

          <Link href="/">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-start mb-12"
            >
              <Image
                src="/Imagotipo.svg"
                alt="Novack Security Platform"
                width={180}
                height={60}
                className="h-12 w-auto"
              />
            </motion.div>
          </Link>
          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2 text-white">
                Bienvenido de nuevo
              </h2>
              <p className="text-gray-400 text-sm">
                Inicia sesión en tu cuenta
              </p>
            </div>

            <form
              className="space-y-5"
              onSubmit={showOtp ? handleOtpSubmit : handleSubmit}
            >
              {!showOtp ? (
                <>
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-gray-300 text-sm font-medium"
                    >
                      Email
                    </Label>
                    <div className="relative group">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-500 group-focus-within:text-[#0386D9] transition-colors" />
                      <Input
                        type="email"
                        id="email"
                        placeholder="tu@empresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#0386D9] focus:ring-1 focus:ring-[#0386D9] h-11 rounded-lg transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-gray-300 text-sm font-medium"
                      >
                        Contraseña
                      </Label>
                      <button
                        type="button"
                        className="text-xs text-[#0386D9] hover:text-[#0270BE] transition-colors"
                      >
                        ¿Olvidaste tu contraseña?
                      </button>
                    </div>
                    <div className="relative group">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-500 group-focus-within:text-[#0386D9] transition-colors" />
                      <Input
                        type="password"
                        id="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#0386D9] focus:ring-1 focus:ring-[#0386D9] h-11 rounded-lg transition-all"
                        required
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-2">
                  <Label
                    htmlFor="otp"
                    className="text-gray-300 text-sm font-medium"
                  >
                    Código de verificación SMS
                  </Label>
                  <Input
                    type="text"
                    id="otp"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#0386D9] focus:ring-1 focus:ring-[#0386D9] h-11 rounded-lg transition-all"
                    required
                  />
                </div>
              )}

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-[#0386D9] hover:bg-[#0270BE] text-black font-semibold rounded-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="size-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Iniciando sesión...</span>
                  </div>
                ) : showOtp ? (
                  "Verificar código"
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              {!showOtp && (
                <>
                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="bg-black px-4 text-gray-400">
                        o continúa con
                      </span>
                    </div>
                  </div>

                  {/* Google Auth Button - Temporalmente deshabilitado */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      alert("Google Auth temporalmente deshabilitado")
                    }
                    className="w-full h-11 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-[#0386D9]/30 transition-all duration-200 opacity-50"
                    disabled={true}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.93 3.28-4.77 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Continuar con Google (Próximamente)
                  </Button>

                  {/* Register Link */}
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-400">
                      ¿No tienes una cuenta?{" "}
                      <Link
                        href="/register"
                        className="text-[#0386D9] hover:text-[#0270BE] font-medium transition-colors"
                      >
                        Regístrate
                      </Link>
                    </p>
                  </div>
                </>
              )}

              {showOtp && (
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOtp(false);
                      setOtp("");
                      setError("");
                    }}
                    className="text-sm text-gray-400 hover:text-[#0386D9] transition-colors"
                  >
                    ← Volver al login
                  </button>
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Globe Background */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        {/* Globe - Positioned below and to the right */}
        <div className="absolute top-1/3 -right-1/4 w-[180%] h-[180%]">
          <Globe className="scale-[1.8]" />
        </div>

        {/* Gradient Overlay to fade globe into black */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-black/10 to-black/40 pointer-events-none" />

        {/* Status Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute top-8 right-8 flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 z-10"
        >
          <div className="size-2 rounded-full bg-[#0386D9] animate-pulse" />
          <span className="text-white text-xs font-medium">Sistema Activo</span>
        </motion.div>
      </div>
    </div>
  );
}
