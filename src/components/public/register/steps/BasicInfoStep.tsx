"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import type { EmployeeData } from "@/types/registration";

interface BasicInfoStepProps {
  data: EmployeeData;
  onNext: (data: EmployeeData) => void;
}

export function BasicInfoStep({ data, onNext }: BasicInfoStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EmployeeData>({
    defaultValues: data,
  });

  const isCreator = watch("is_creator");

  const onSubmit = (formData: EmployeeData) => {
    onNext(formData);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          Employee Basic Information
        </h2>
        <p className="text-white/70">
          Enter your personal details to get started
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name" className="text-white/80">
                First name *
              </Label>
              <Input
                id="first_name"
                {...register("first_name", {
                  required: "First name is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                  pattern: {
                    value: /^[A-Za-z' -]+$/,
                    message: "Only letters and spaces",
                  },
                  setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
                })}
                placeholder="Enter your first name"
                className="rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
              />
              {errors.first_name && (
                <p className="text-sm text-red-500">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="last_name" className="text-white/80">
                Last name *
              </Label>
              <Input
                id="last_name"
                {...register("last_name", {
                  required: "Last name is required",
                  minLength: { value: 2, message: "Minimum 2 characters" },
                  pattern: {
                    value: /^[A-Za-z' -]+$/,
                    message: "Only letters and spaces",
                  },
                  setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
                })}
                placeholder="Enter your last name"
                className="rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
              />
              {errors.last_name && (
                <p className="text-sm text-red-500">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white/80">
              Email *
            </Label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email",
                },
                setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
              })}
              placeholder="tu@email.com"
              className="rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white/80">
              Password *
            </Label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
                  message: "Use letters and numbers",
                },
              })}
              placeholder="Enter your password"
              className="rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white/80">
              Phone *
            </Label>
            <PhoneInput
              id="phone"
              value={watch("phone") || ""}
              onChange={(val) => setValue("phone", val)}
              placeholder="e.g. +506 8611 2403"
            />
            <input
              type="hidden"
              {...(register as any)("phone", {
                required: "Phone is required",
                validate: (value: string) => {
                  const digits = (value || "").replace(/\D/g, "");
                  return (
                    (digits.length >= 7 && digits.length <= 15) ||
                    "Enter a valid international phone number"
                  );
                },
              })}
              value={watch("phone") || ""}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="position" className="text-white/80">
                Job title/Position
              </Label>
              <Input
                id="position"
                {...register("position", {
                  setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
                })}
                placeholder="e.g. Developer"
                className="rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-white/80">
                Department
              </Label>
              <Input
                id="department"
                {...register("department", {
                  setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
                })}
                placeholder="e.g. Engineering"
                className="rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-cyan-500/10 rounded-xl border border-cyan-400/20">
            <Checkbox
              id="is_creator"
              checked={isCreator}
              onCheckedChange={(checked) => setValue("is_creator", !!checked)}
            />
            <Label
              htmlFor="is_creator"
              className="text-sm font-medium text-cyan-200"
            >
              I am the supplier creator
            </Label>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 mt-6">
          <div className="sticky bottom-0 left-0 right-0">
            <Button
              type="submit"
              className="w-full rounded-xl h-12 sm:h-12 text-base font-semibold shadow-[0_10px_30px_rgba(7,217,217,0.25)]"
            >
              Continue
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
