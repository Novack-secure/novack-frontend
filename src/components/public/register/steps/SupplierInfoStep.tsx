"use client";

import { useForm, type FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";
// import { registrationSteps } from "@/data/steps";

import type { SupplierData, EmployeeData } from "@/types/registration";
import { extractDigits, lastNDigits } from "@/lib/api";

interface SupplierInfoStepProps {
  employeeData: EmployeeData;
  supplierData?: SupplierData;
  onNext: (data: SupplierData | { supplier_id: string }) => void;
  onBack: () => void;
}

export function SupplierInfoStep({
  employeeData,
  supplierData,
  onNext,
  onBack,
}: SupplierInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SupplierData | { supplier_id: string }>({
    defaultValues: employeeData.is_creator ? supplierData : { supplier_id: "" },
  });

  const onSubmit = (formData: SupplierData | { supplier_id: string }) => {
    onNext(formData);
  };

  if (employeeData.is_creator) {
    const creatorErrors = errors as FieldErrors<SupplierData>;
    return (
      <div className="h-full flex flex-col">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            Supplier Information
          </h2>
          <p className="text-white/70">Create your company profile</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col"
        >
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto w-full">
              <div className="space-y-2 min-w-0">
                <Label htmlFor="supplier_name" className="text-white/80">
                  Supplier name *
                </Label>
                <Input
                  id="supplier_name"
                  {...register("supplier_name", {
                    required: "Supplier name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                    maxLength: {
                      value: 100,
                      message: "Maximum 100 characters",
                    },
                  })}
                  placeholder="Your company name"
                  className="h-11 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
                />
                {creatorErrors.supplier_name && (
                  <p className="text-sm text-red-500">
                    {creatorErrors.supplier_name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 min-w-0">
                <Label htmlFor="contact_email" className="text-white/80">
                  Contact email *
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  {...register("contact_email", {
                    required: "Contact email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email",
                    },
                  })}
                  placeholder="contact@company.com"
                  className="h-11 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
                />
                {creatorErrors.contact_email && (
                  <p className="text-sm text-red-500">
                    {creatorErrors.contact_email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto w-full">
              <div className="space-y-2 min-w-0">
                <Label htmlFor="phone_number" className="text-white/80">
                  Phone *
                </Label>
                <PhoneInput
                  id="phone_number"
                  value={(watch("phone_number") as string) || ""}
                  onChange={(val) =>
                    setValue(
                      "phone_number" as unknown as never,
                      val as unknown as never
                    )
                  }
                  placeholder="e.g. +506 8611 2403"
                />
                <input
                  type="hidden"
                  {...register("phone_number" as unknown as never, {
                    required: "Phone is required",
                    validate: (value: string) => {
                      const e164 = (value || "").replace(/\s/g, "");
                      const ok = /^\+[1-9]\d{7,14}$/.test(e164);
                      return ok || "Enter a valid international phone number";
                    },
                  })}
                  value={(watch("phone_number") as string) || ""}
                />
                {creatorErrors.phone_number && (
                  <p className="text-sm text-red-500">
                    {creatorErrors.phone_number.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 min-w-0">
                <Label htmlFor="logo_url" className="text-white/80">
                  Logo URL
                </Label>
                <Input
                  id="logo_url"
                  type="url"
                  {...register("logo_url")}
                  placeholder="https://example.com/logo.png"
                  className="h-11 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>
            </div>

            <div className="space-y-2 max-w-3xl mx-auto w-full">
              <Label htmlFor="address" className="text-white/80">
                Address *
              </Label>
              <Input
                id="address"
                {...register("address", {
                  required: "Address is required",
                  minLength: { value: 5, message: "Minimum 5 characters" },
                  maxLength: { value: 200, message: "Maximum 200 characters" },
                })}
                placeholder="Company physical address"
                className="h-11 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
              />
              {creatorErrors.address && (
                <p className="text-sm text-red-500">
                  {creatorErrors.address.message}
                </p>
              )}
            </div>

            <div className="space-y-2 max-w-3xl mx-auto w-full">
              <Label htmlFor="description" className="text-white/80">
                Description *
              </Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "Description is required",
                  minLength: { value: 10, message: "Minimum 10 characters" },
                  maxLength: { value: 500, message: "Maximum 500 characters" },
                })}
                placeholder="Describe your company and services"
                rows={4}
                className="rounded-xl resize-y bg-white/10 border-white/20 text-white placeholder-white/50 min-h-[100px] sm:min-h-[120px]"
              />
              {creatorErrors.description && (
                <p className="text-sm text-red-500">
                  {creatorErrors.description.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 max-w-3xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 rounded-xl h-11 sm:h-12 text-sm sm:text-base bg-transparent border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
              <div className="flex-1">
                <Button
                  type="submit"
                  className="w-full rounded-xl h-12 text-base font-semibold shadow-[0_10px_30px_rgba(7,217,217,0.25)]"
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Supplier ID</h2>
        <p className="text-white/70">Enter the existing supplier ID</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="supplier_id" className="text-white/80">
              Supplier ID *
            </Label>
            <Input
              id="supplier_id"
              {...register("supplier_id", {
                required: "Supplier ID is required",
                pattern: {
                  value:
                    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
                  message: "Must be a valid UUID v4",
                },
                setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
              })}
              placeholder="Enter the existing supplier ID"
              className="rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
            />
            {(errors as FieldErrors<{ supplier_id: string }>).supplier_id && (
              <p className="text-sm text-red-500">
                {
                  (errors as FieldErrors<{ supplier_id: string }>).supplier_id
                    ?.message
                }
              </p>
            )}
          </div>

          <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-400/20">
            <p className="text-sm text-amber-200">
              <strong>Note:</strong> If you don't have the supplier ID, contact
              your admin or check "I am the supplier creator" in the previous
              step.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 mt-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 rounded-xl h-11 sm:h-12 text-sm sm:text-base bg-transparent border-white/20 text-white hover:bg-white/10"
            >
              Atrás
            </Button>
            <div className="flex-1">
              <Button
                type="submit"
                className="w-full rounded-xl h-12 text-base font-semibold shadow-[0_10px_30px_rgba(7,217,217,0.25)]"
              >
                Continuar
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
