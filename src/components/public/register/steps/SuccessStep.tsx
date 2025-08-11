"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, User, Building, Phone, Mail, MapPin } from "lucide-react";
import type { RegistrationData } from "@/types/registration";

interface SuccessStepProps {
  data: RegistrationData;
  onFinish: () => void;
}

export function SuccessStep({ data, onFinish }: SuccessStepProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="text-center mb-8">
        <div className="mx-auto w-24 h-24 bg-emerald-500/10 border border-emerald-400/20 rounded-xl flex items-center justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Registration Completed!
        </h2>
        <p className="text-white/70">
          Your account has been created successfully
        </p>
      </div>

      <div className="flex-1 space-y-4">
        {/* Employee Info */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-3">
            <User className="w-5 h-5 text-white/80" />
            <h3 className="font-semibold text-white">Employee Information</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-white/80">
              <strong>Name:</strong> {data.employee.first_name}{" "}
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
                <strong>Position:</strong> {data.employee.position}
              </p>
            )}
            {data.employee.department && (
              <p className="text-white/80">
                <strong>Department:</strong> {data.employee.department}
              </p>
            )}
          </div>
        </div>

        {/* Supplier Info */}
        {data.supplier && (
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Building className="w-5 h-5 text-white/80" />
              <h3 className="font-semibold text-white">Supplier Information</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p className="text-white/80">
                <strong>Company:</strong> {data.supplier.supplier_name}
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
              <h3 className="font-semibold text-white">Assigned Supplier</h3>
            </div>
            <p className="text-sm text-white/80">
              <strong>ID:</strong> {data.employee.supplier_id}
            </p>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-white/10">
        <div className="text-center space-y-4">
          <p className="text-sm text-white/70">
            You will receive a confirmation email in the next few minutes.
          </p>
          <Button
            onClick={onFinish}
            className="relative w-full rounded-xl h-11 sm:h-12 text-sm sm:text-base font-semibold overflow-hidden bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-[0_10px_30px_rgba(7,217,217,0.35)] hover:shadow-[0_14px_40px_rgba(7,217,217,0.45)] transition-shadow"
          >
            <span className="relative z-10">Go to Dashboard</span>
            <span className="pointer-events-none absolute inset-0 opacity-0 hover:opacity-20 transition-opacity bg-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
