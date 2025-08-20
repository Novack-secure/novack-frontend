"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Smartphone,
  RefreshCw,
  AlertCircle,
  Mail,
  Loader2,
} from "lucide-react";

interface VerificationStepProps {
  phone: string;
  onNext: (code: string) => void;
  onBack: () => void;
  employeeId?: string; // para llamadas públicas al backend
  employeeEmail?: string; // fallback si aún no tenemos ID
}

export function VerificationStep({
  phone,
  onNext,
  onBack,
  employeeId,
  employeeEmail,
}: VerificationStepProps) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [code, setCode] = useState("");
  const [method, setMethod] = useState<"sms" | "email">("sms");

  const countdownPercent = Math.max(
    0,
    Math.min(100, Math.round((countdown / 60) * 100))
  );
  const gradientClass =
    method === "sms"
      ? "from-cyan-500 to-emerald-500"
      : "from-indigo-500 to-fuchsia-500";

  const {
    register,
    handleSubmit,
    formState: { errors, submitCount },
    setValue,
  } = useForm<{ verification_code: string }>();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    setValue("verification_code", code, { shouldValidate: true });
  }, [code, setValue]);

  const sendCode = async () => {
    setIsResending(true);
    try {
      if (!employeeId && !employeeEmail) {
        await new Promise((resolve) => setTimeout(resolve, 1200));
      } else {
        if (method === "sms") {
          const res = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
            }/2fa/sms/public/initiate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                employee_id: employeeId,
                employee_email: employeeEmail,
                phone_number: phone.replace(/\s/g, ""),
              }),
            }
          );
          if (!res.ok) {
            const text = await res.text();
            throw new Error(
              text || "No se pudo iniciar la verificación por SMS"
            );
          }
        } else {
          if (!employeeEmail) {
            throw new Error("Email requerido para verificación por correo");
          }
          const res = await fetch(
            `${
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
            }/2fa/email/public/initiate`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                employee_email: employeeEmail,
              }),
            }
          );
          if (!res.ok) {
            const text = await res.text();
            throw new Error(
              text || "No se pudo iniciar la verificación por email"
            );
          }
        }
      }
      setIsCodeSent(true);
      setCountdown(60);
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (data: { verification_code: string }) => {
    const submitted = (data.verification_code || code || "").replace(/\D/g, "");
    if (submitted.length !== 6) {
      alert("Invalid code. Must be 6 digits");
      return;
    }
    if (!employeeId && !employeeEmail) {
      onNext(submitted);
      return;
    }
    const urlBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    const endpoint =
      method === "sms"
        ? `${urlBase}/2fa/sms/public/verify`
        : `${urlBase}/2fa/email/public/verify`;
    const payload =
      method === "sms"
        ? {
            employee_id: employeeId,
            employee_email: employeeEmail,
            otp: submitted,
          }
        : {
            employee_email: employeeEmail,
            otp: submitted,
          };

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      alert(text || "No se pudo verificar el código");
      return;
    }
    const json = await res.json();
    if (json?.verified) {
      onNext(submitted);
    } else {
      alert("Código inválido");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mt-4 mb-8">
        <div className="relative mx-auto w-24 h-24 rounded-2xl flex items-center justify-center mb-4 overflow-hidden">
          {/* Resplandor suave sin animación */}
          <div
            className={`absolute -inset-6 rounded-3xl bg-gradient-to-br ${gradientClass} opacity-30 blur-xl`}
          />
          {/* Anillo sutil */}
          <div className="absolute inset-0 rounded-2xl border border-white/10" />
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
            {method === "sms" ? (
              <Smartphone className="w-8 h-8 text-white/90" />
            ) : (
              <Mail className="w-8 h-8 text-white/90" />
            )}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {method === "sms" ? "Verificación por SMS" : "Verificación por Email"}
        </h2>
        {method === "sms" ? (
          <p className="text-white/70">
            Te enviaremos un código por SMS a: <strong>{phone}</strong>
          </p>
        ) : (
          <p className="text-white/70">
            Te enviaremos un código por email a:{" "}
            <strong>{employeeEmail}</strong>
          </p>
        )}
        <div className="mt-4 flex items-center justify-center">
          <div className="inline-flex rounded-xl bg-white/5 border border-white/10 p-1">
            <button
              type="button"
              onClick={() => setMethod("sms")}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                method === "sms"
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              SMS
            </button>
            <button
              type="button"
              onClick={() => setMethod("email")}
              className={`px-4 py-1.5 rounded-lg text-sm transition-colors ${
                method === "email"
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Email
            </button>
          </div>
        </div>
      </div>

      {!isCodeSent ? (
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-6 max-w-md">
              <p className="text-white/70">
                Click the button to receive your verification code
              </p>
              <Button
                onClick={sendCode}
                disabled={isResending}
                className={`relative w-full rounded-xl h-11 sm:h-12 text-sm sm:text-base font-semibold overflow-hidden bg-gradient-to-r ${gradientClass} text-white shadow-[0_10px_30px_rgba(7,217,217,0.35)] hover:shadow-[0_14px_40px_rgba(7,217,217,0.45)] transition-shadow`}
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Enviando código...
                  </>
                ) : (
                  <span className="relative z-10">Enviar código</span>
                )}
                <span className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-10 transition-opacity bg-white" />
              </Button>
              {countdown > 0 && (
                <div className="mx-auto mt-3 w-full max-w-md">
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${gradientClass}`}
                      style={{ width: `${countdownPercent}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="w-full rounded-xl h-11 sm:h-12 text-sm sm:text-base bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Back
            </Button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col"
        >
          <div className="flex-1 space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="verification_code"
                className="text-white/80 block text-center"
              >
                Enter the 6‑digit code
              </Label>
              <div className="flex justify-center">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 w-fit">
                  <InputOTP maxLength={6} value={code} onChange={setCode}>
                    <InputOTPGroup className="gap-3">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <InputOTPSlot
                          key={i}
                          index={i}
                          className="h-12 w-10 sm:w-12 text-xl rounded-xl bg-white/5 border border-white/10 text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <input
                type="hidden"
                {...register("verification_code", {
                  required: "Code is required",
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: "The code must be 6 digits",
                  },
                })}
              />
              {submitCount > 0 && errors.verification_code && (
                <div className="mx-auto max-w-md">
                  <div className="mt-1 rounded-xl border border-red-500/30 bg-red-500/10 text-red-200 px-3 py-2 flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">
                      {errors.verification_code.message}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Mensaje de demo eliminado; ahora el código es aleatorio */}

            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={sendCode}
                disabled={isResending || countdown > 0}
                variant="link"
              >
                {isResending ? "Resending..." : "Resend code"}
              </Button>
              {countdown > 0 && (
                <span className="text-sm text-white/70">in {countdown}s</span>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="w-full sm:w-auto rounded-xl h-11 sm:h-12 text-sm sm:text-base bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
              <div className="flex-1">
                <Button
                  type="submit"
                  className="w-full rounded-xl h-12 text-base font-semibold shadow-[0_10px_30px_rgba(7,217,217,0.25)]"
                >
                  Verify
                </Button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
