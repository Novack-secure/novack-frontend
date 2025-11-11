import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { Step } from "@/types/registration";

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  orientation?: "horizontal" | "vertical";
}

export function StepIndicator({
  steps,
  currentStep,
  orientation = "horizontal",
}: StepIndicatorProps) {
  if (orientation === "vertical") {
    return (
      <div className="h-full flex flex-col">
        <div className="mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-white">
            Progreso
          </h2>
          <p className="text-xs sm:text-sm text-white/70">
            Paso {currentStep + 1} de {steps.length}
          </p>
        </div>
        <nav className="flex-1" aria-label="Steps">
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex items-start gap-4 transition-all duration-300",
                  index <= currentStep ? "opacity-100" : "opacity-60"
                )}
              >
                <div
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl border",
                    index < currentStep
                      ? "bg-emerald-500 text-white border-emerald-500/70"
                      : index === currentStep
                      ? "bg-cyan-500 text-white border-cyan-500/70"
                      : "bg-white/10 text-white/60 border-white/20"
                  )}
                >
                  {index < currentStep ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <span className="text-base font-semibold">{step.id}</span>
                  )}
                </div>
                <div className="pt-0.5 flex-1">
                  <h3
                    className={cn(
                      "text-base font-semibold",
                      index <= currentStep ? "text-white" : "text-white/70"
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/60 mt-1 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-semibold text-white">
          Progreso
        </h2>
        <p className="text-xs sm:text-sm text-white/70">
          Paso {currentStep + 1} de {steps.length}
        </p>
      </div>

      <ol className="grid grid-cols-4 gap-3">
        {steps.map((step, index) => {
          const isDone = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <li key={step.id} className="flex flex-col">
              <div
                className={cn(
                  "flex items-center justify-center h-10 rounded-lg border text-[11px] sm:text-sm font-medium px-2 text-center",
                  isDone
                    ? "bg-emerald-500 text-white border-emerald-500/70"
                    : isCurrent
                    ? "bg-cyan-500 text-white border-cyan-500/70"
                    : "bg-white/10 text-white/70 border-white/15"
                )}
              >
                {isDone ? <Check className="w-5 h-5" /> : step.title}
              </div>
              <div className="mt-2 text-center text-[10px] sm:text-xs text-white/60">
                {step.description}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
