"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StepIndicator } from "./StepIndicator";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { SupplierInfoStep } from "./steps/SupplierInfoStep";
import { VerificationStep } from "./steps/VerificationStep";
import { SuccessStep } from "./steps/SuccessStep";
import { registrationSteps } from "@/data/steps";
import { api, extractDigits, lastNDigits } from "@/lib/api";

import type {
  RegistrationData,
  EmployeeData,
  SupplierData,
} from "@/types/registration";

async function createSupplier(payload: SupplierData) {
  // Enviar E.164 (sin espacios). El PhoneInput ya provee E.164.
  const phoneDigits = extractDigits(payload.phone_number);
  // Para compat con backend actual, si más de 9 dígitos nacionales, recorto últimos 9 para card/suscripción.
  const nine = lastNDigits(phoneDigits, 9);
  const body = {
    ...payload,
    phone_number: nine,
    is_subscribed: payload.is_subscribed ?? false,
    has_card_subscription: payload.has_card_subscription ?? false,
    has_sensor_subscription: payload.has_sensor_subscription ?? false,
    employee_count: payload.employee_count ?? 1,
    card_count: payload.card_count ?? 0,
    additional_info: payload.additional_info ?? {},
    logo_url: payload.logo_url ?? "",
  };
  const { data } = await api.post("/suppliers", body);
  return data as { id: string };
}

async function createEmployee(payload: EmployeeData) {
  const body = {
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: payload.email,
    password: payload.password,
    supplier_id: payload.supplier_id,
    is_creator: !!payload.is_creator,
    phone: payload.phone,
    position: payload.position || undefined,
    department: payload.department || undefined,
  };
  const { data } = await api.post("/employees", body);
  return data as { id: string };
}

export default function RegistrationStepper() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    employee: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      is_creator: false,
      position: "",
      department: "",
      supplier_id: "",
    },
  });
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  async function loginAndGoHome(email: string, password: string) {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      const token = data?.access_token || data?.token || data?.accessToken;
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
      setIsRedirecting(true);
      // Pequeña animación antes de redirigir
      setTimeout(() => router.replace("/home"), 600);
    } catch (e) {
      router.replace("/login");
    }
  }

  const handleBasicInfoNext = (employeeData: EmployeeData) => {
    setRegistrationData((prev) => ({
      ...prev,
      employee: employeeData,
    }));
    console.log("=== PASO 1 COMPLETADO - INFORMACIÓN BÁSICA ===");
    console.log(JSON.stringify({ employee: employeeData }, null, 2));
    setCurrentStep(1);
  };

  const handleSupplierInfoNext = (
    supplierData: SupplierData | { supplier_id: string }
  ) => {
    if ("supplier_id" in supplierData) {
      setRegistrationData((prev) => ({
        ...prev,
        employee: { ...prev.employee, supplier_id: supplierData.supplier_id },
      }));
    } else {
      setRegistrationData((prev) => ({
        ...prev,
        supplier: supplierData,
      }));
    }
    console.log("=== PASO 2 COMPLETADO - INFORMACIÓN DEL PROVEEDOR ===");
    if ("supplier_id" in supplierData) {
      console.log(
        JSON.stringify({ supplier_id: supplierData.supplier_id }, null, 2)
      );
    } else {
      console.log(JSON.stringify({ supplier: supplierData }, null, 2));
    }
    setCurrentStep(2);
  };

  const handleVerificationNext = async (code: string) => {
    if (isFinishing) return;
    setIsFinishing(true);
    // Guardar el código verificado
    setRegistrationData((prev) => ({ ...prev, verification_code: code }));
    // Crear en DB y luego login + redirect
    try {
      if (registrationData.employee.is_creator && registrationData.supplier) {
        await createSupplier({
          ...registrationData.supplier,
          contact_email:
            registrationData.supplier.contact_email ||
            registrationData.employee.email,
          supplier_creator:
            `${registrationData.employee.first_name} ${registrationData.employee.last_name}`.trim(),
        });
        // Backend crea el usuario creador automáticamente con password temporal; aquí usamos la del registro
        await loginAndGoHome(
          registrationData.employee.email,
          registrationData.employee.password
        );
        return;
      }
      if (!registrationData.employee.supplier_id) {
        throw new Error("Supplier ID es requerido");
      }
      await createEmployee({
        ...registrationData.employee,
        supplier_id: registrationData.employee.supplier_id,
      });
      await loginAndGoHome(
        registrationData.employee.email,
        registrationData.employee.password
      );
    } catch (err) {
      const e = err as any;
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "Error al finalizar registro";
      console.error(Array.isArray(msg) ? msg.join(", ") : String(msg));
      setIsFinishing(false);
    }
  };

  const handleFinish = async () => {
    try {
      // 1) Si es creador, crear supplier primero y permitir que el backend cree al usuario creador
      if (registrationData.employee.is_creator && registrationData.supplier) {
        const supplierCreated = await createSupplier({
          ...registrationData.supplier,
          contact_email:
            registrationData.supplier.contact_email ||
            registrationData.employee.email,
          supplier_creator:
            `${registrationData.employee.first_name} ${registrationData.employee.last_name}`.trim(),
        });
        // Avanzar a verificación de SMS

        setCurrentStep(2);
        return;
      }

      // 2) No creador: requiere supplier_id existente
      if (!registrationData.employee.supplier_id) {
        throw new Error("Supplier ID es requerido");
      }

      const employeePayload: EmployeeData = {
        ...registrationData.employee,
        supplier_id: registrationData.employee.supplier_id,
      };
      const created = await createEmployee(employeePayload);

      setCurrentStep(2);
    } catch (err: unknown) {
      type ErrorWithResponse = {
        response?: { data?: { message?: unknown } };
        message?: unknown;
      };
      const e = err as ErrorWithResponse;
      const raw =
        e?.response?.data?.message ?? e?.message ?? "Error en registro";
      const message = Array.isArray(raw) ? raw.join(", ") : String(raw);
      console.error(`Error: ${message}`);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      <div className="w-full mx-auto px-0 sm:px-4">
        {/* Header moved to BackHeader */}

        {/* Two Panel Layout with Lateral Steps */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:min-h-[680px]">
          <aside className="hidden lg:block lg:w-1/3 lg:max-h-none lg:overflow-auto bg-white/5 border border-white/10 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <StepIndicator
              steps={registrationSteps}
              currentStep={currentStep}
              orientation="vertical"
            />
          </aside>
          <section className="relative w-full lg:flex-1 min-h-[100dvh] lg:min-h-0 bg-white/5 backdrop-blur-sm rounded-none border-0 shadow-none lg:rounded-2xl lg:border lg:border-white/10 lg:shadow-[0_20px_60px_rgba(0,0,0,0.35)] text-white before:content-[''] before:absolute before:inset-0 before:rounded-none lg:before:rounded-2xl before:bg-[radial-gradient(circle_at_20%_20%,rgba(7,217,217,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(7,217,217,0.06),transparent_20%)] before:pointer-events-none lg:overflow-hidden">
            <div className="flex flex-col h-full">
              <div className="p-4 lg:overflow-y-auto">
                {currentStep === 0 && (
                  <BasicInfoStep
                    data={registrationData.employee}
                    onNext={handleBasicInfoNext}
                  />
                )}

                {currentStep === 1 && (
                  <SupplierInfoStep
                    employeeData={registrationData.employee}
                    supplierData={registrationData.supplier}
                    onNext={handleSupplierInfoNext}
                    onBack={goBack}
                  />
                )}

                {currentStep === 2 && (
                  <VerificationStep
                    phone={registrationData.employee.phone}
                    employeeId={registrationData.employee_id}
                    employeeEmail={registrationData.employee.email}
                    onNext={handleVerificationNext}
                    onBack={goBack}
                  />
                )}

                {isRedirecting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade">
                    <div className="px-6 py-4 rounded-2xl bg-white/10 border border-white/15 text-white shadow-xl">
                      Redirigiendo a tu panel...
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
