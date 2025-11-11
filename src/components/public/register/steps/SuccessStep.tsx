"use client";

import { CheckCircle, User, Building, Phone, Mail, MapPin } from "lucide-react";
import type { RegistrationData } from "@/types/registration";

interface SuccessStepProps {
  data: RegistrationData;
}

export function SuccessStep({ data }: SuccessStepProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <div className="mx-auto w-24 h-24 bg-emerald-500/10 border border-emerald-400/20 rounded-xl flex items-center justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          ¡Registro Completado!
        </h2>
        <p className="text-white/70">Tu cuenta ha sido creada exitosamente</p>
      </div>

      <div className="flex-1 space-y-4">
        {/* Employee Info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <User className="w-5 h-5 text-white/80" />
            <h3 className="font-semibold text-white">
              Información del Empleado
            </h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-white/80">
              <strong>Nombre:</strong> {data.employee.first_name}{" "}
              {data.employee.last_name}
            </p>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-white/60" />
              <span className="text-white/80">{data.employee.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-white/60" />
              <span className="text-white/80">{data.employee.phone}</span>
            </div>
            {data.employee.position && (
              <p className="text-white/80">
                <strong>Puesto:</strong> {data.employee.position}
              </p>
            )}
            {data.employee.department && (
              <p className="text-white/80">
                <strong>Departamento:</strong> {data.employee.department}
              </p>
            )}
          </div>
        </div>

        {/* Supplier Info */}
        {data.supplier && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Building className="w-5 h-5 text-white/80" />
              <h3 className="font-semibold text-white">
                Información del Proveedor
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-white/80">
                <strong>Empresa:</strong> {data.supplier.supplier_name}
              </p>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-white/60" />
                <span className="text-white/80">
                  {data.supplier.contact_email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-white/60" />
                <span className="text-white/80">
                  {data.supplier.phone_number}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-white/60 mt-0.5" />
                <span className="text-white/80">{data.supplier.address}</span>
              </div>
            </div>
          </div>
        )}

        {data.employee.supplier_id && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Building className="w-5 h-5 text-white/80" />
              <h3 className="font-semibold text-white">Proveedor Asignado</h3>
            </div>
            <p className="text-sm text-white/80">
              <strong>ID:</strong> {data.employee.supplier_id}
            </p>
          </div>
        )}
      </div>

      {/* Botón eliminado: navegación al dashboard ocurrirá después de confirmar SMS */}
    </div>
  );
}
