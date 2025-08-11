"use client";

import { useState } from "react";
import { StepIndicator } from "./StepIndicator";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { SupplierInfoStep } from "./steps/SupplierInfoStep";
import { VerificationStep } from "./steps/VerificationStep";
import { SuccessStep } from "./steps/SuccessStep";
import { registrationSteps } from "@/data/steps";

import type {
  RegistrationData,
  EmployeeData,
  SupplierData,
} from "@/types/registration";

export default function RegistrationStepper() {
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

  const handleVerificationNext = (code: string) => {
    setRegistrationData((prev) => ({
      ...prev,
      verification_code: code,
    }));
    console.log("=== PASO 3 COMPLETADO - VERIFICACIÓN SMS ===");
    console.log(
      JSON.stringify(
        { verification_code: code, verified_at: new Date().toISOString() },
        null,
        2
      )
    );
    setCurrentStep(3);
  };

  const handleFinish = () => {
    const completeRegistrationData = {
      timestamp: new Date().toISOString(),
      employee: {
        first_name: registrationData.employee.first_name,
        last_name: registrationData.employee.last_name,
        email: registrationData.employee.email,
        password: registrationData.employee.password,
        phone: registrationData.employee.phone,
        is_creator: registrationData.employee.is_creator,
        position: registrationData.employee.position || null,
        department: registrationData.employee.department || null,
        supplier_id: registrationData.employee.supplier_id || null,
      },
      supplier: registrationData.supplier || null,
      verification: {
        phone_verified: true,
        verification_code: registrationData.verification_code,
        verified_at: new Date().toISOString(),
      },
      registration_status: "completed",
    };

    console.log("=== DATOS DE REGISTRO COMPLETOS ===");
    console.log(JSON.stringify(completeRegistrationData, null, 2));
    console.log("=== OBJETO COMPLETO ===");
    console.log(completeRegistrationData);

    alert("¡Registro completado! Revisa la consola para ver todos los datos.");
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div>
      <div className="w-full mx-auto px-4">
        {/* Header moved to BackHeader */}

        {/* Two Panel Layout with Lateral Steps */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch h-[560px] sm:h-[600px] lg:h-[680px]">
          <aside className="w-full lg:w-1/3 h-full overflow-auto bg-white/5 border border-white/10 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <StepIndicator
              steps={registrationSteps}
              currentStep={currentStep}
              orientation="vertical"
            />
          </aside>
          <section className="relative w-full lg:flex-1 h-full overflow-hidden bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:bg-[radial-gradient(circle_at_20%_20%,rgba(7,217,217,0.08),transparent_25%),radial-gradient(circle_at_80%_0%,rgba(7,217,217,0.06),transparent_20%)] before:pointer-events-none">
            <div className="flex flex-col h-full">
              <div className="p-4 overflow-y-auto h-full">
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
                    onNext={handleVerificationNext}
                    onBack={goBack}
                  />
                )}

                {currentStep === 3 && (
                  <SuccessStep
                    data={registrationData}
                    onFinish={handleFinish}
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
