"use client";

import { useForm, type FieldErrors } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PhoneInput } from "@/components/ui/phone-input";

import type { SupplierData, EmployeeData } from "@/types/registration";

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
            Información de la Institución
          </h2>
          <p className="text-white/70">Crea el perfil de tu empresa</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 flex flex-col"
        >
          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto w-full">
              <div className="space-y-2 min-w-0">
                <Label htmlFor="supplier_name" className="text-white/80">
                  Nombre de la Institución *
                </Label>
                <Input
                  id="supplier_name"
                  {...register("supplier_name", {
                    required: "El nombre de la Institución es requerido",
                    minLength: { value: 3, message: "Mínimo 3 caracteres" },
                    maxLength: {
                      value: 100,
                      message: "Máximo 100 caracteres",
                    },
                  })}
                  placeholder="Nombre de tu empresa"
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
                  Email de contacto *
                </Label>
                <Input
                  id="contact_email"
                  type="email"
                  {...register("contact_email", {
                    required: "El email de contacto es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Email inválido",
                    },
                  })}
                  placeholder="contacto@empresa.com"
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
                  Teléfono *
                </Label>
                <PhoneInput
                  id="phone_number"
                  value={(watch("phone_number") as string) || ""}
                  onChange={(val) =>
                    setValue(
                      "phone_number" as unknown as never,
                      val as unknown as never,
                    )
                  }
                  placeholder="ej. +506 8611 2403"
                />
                <input
                  type="hidden"
                  {...register("phone_number" as unknown as never, {
                    required: "El teléfono es requerido",
                    validate: (value: string) => {
                      const e164 = (value || "").replace(/\s/g, "");
                      const ok = /^\+[1-9]\d{7,14}$/.test(e164);
                      return (
                        ok ||
                        "Ingresa un número de teléfono internacional válido"
                      );
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
                  URL del Logo
                </Label>
                <Input
                  id="logo_url"
                  type="url"
                  {...register("logo_url")}
                  placeholder="https://ejemplo.com/logo.png"
                  className="h-11 rounded-xl bg-white/10 border-white/20 text-white placeholder-white/50"
                />
              </div>
            </div>

            <div className="space-y-2 max-w-3xl mx-auto w-full">
              <Label htmlFor="address" className="text-white/80">
                Dirección *
              </Label>
              <Input
                id="address"
                {...register("address", {
                  required: "La dirección es requerida",
                  minLength: { value: 5, message: "Mínimo 5 caracteres" },
                  maxLength: { value: 200, message: "Máximo 200 caracteres" },
                })}
                placeholder="Dirección física de la empresa"
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
                Descripción *
              </Label>
              <Textarea
                id="description"
                {...register("description", {
                  required: "La descripción es requerida",
                  minLength: { value: 10, message: "Mínimo 10 caracteres" },
                  maxLength: { value: 500, message: "Máximo 500 caracteres" },
                })}
                placeholder="Describe tu empresa y servicios"
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

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">ID de la Institución *</h2>
        <p className="text-white/70">Ingresa el ID de la Institución existente</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 flex flex-col">
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="supplier_id" className="text-white/80">
              ID de la Institución
            </Label>
            <Input
              id="supplier_id"
              {...register("supplier_id", {
                required: "El ID de la Institución es requerido",
                pattern: {
                  value:
                    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
                  message: "Debe ser un UUID v4 válido",
                },
                setValueAs: (v) => (typeof v === "string" ? v.trim() : v),
              })}
              placeholder="Ingresa el ID de la Institución existente"
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
              <strong>Nota:</strong> Si no tienes el ID de la Institución, contacta
              a tu administrador o marca &quot;Soy el creador de la
              Institución&quot; en el paso anterior.
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
