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
import { Smartphone, RefreshCw, AlertCircle } from "lucide-react";

interface VerificationStepProps {
  phone: string;
  onNext: (code: string) => void;
  onBack: () => void;
}

export function VerificationStep({
  phone,
  onNext,
  onBack,
}: VerificationStepProps) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [code, setCode] = useState("");

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
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCodeSent(true);
    setCountdown(60);
    setIsResending(false);
  };

  const onSubmit = (data: { verification_code: string }) => {
    const submitted = (data.verification_code || code || "").replace(/\D/g, "");
    if (submitted === "123456") {
      onNext(submitted);
    } else {
      alert("Incorrect code. Use 123456 for the demo.");
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="text-center mt-4 mb-8">
        <div className="relative mx-auto w-20 h-20 bg-cyan-500/10 border border-cyan-400/20 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
          <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(300px_120px_at_-10%_-10%,rgba(7,217,217,0.15),transparent_40%)]" />
          <Smartphone className="w-10 h-10 text-cyan-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">SMS Verification</h2>
        <p className="text-white/70">
          We will send a verification code to: <strong>{phone}</strong>
        </p>
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
                className="relative w-full rounded-xl h-11 sm:h-12 text-sm sm:text-base font-semibold overflow-hidden bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-[0_10px_30px_rgba(7,217,217,0.35)] hover:shadow-[0_14px_40px_rgba(7,217,217,0.45)] transition-shadow"
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Sending code...
                  </>
                ) : (
                  <span className="relative z-10">Send SMS code</span>
                )}
                <span className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-10 transition-opacity bg-white" />
              </Button>
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

            <div className="p-4 bg-cyan-500/10 rounded-xl border border-cyan-400/20">
              <p className="text-sm text-cyan-200 text-center">
                For the demo, use code:{" "}
                <strong className="font-mono text-lg">123456</strong>
              </p>
            </div>

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
