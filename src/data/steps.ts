import type { Step } from "@/types/registration"

export const registrationSteps: Step[] = [
  {
    id: 1,
    title: "Información Básica",
    description: "Datos personales del empleado",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Información del Proveedor",
    description: "Datos del proveedor o ID existente",
    isCompleted: false,
  },
  {
    id: 3,
    title: "Verificación SMS",
    description: "Confirma tu número de teléfono",
    isCompleted: false,
  },
  {
    id: 4,
    title: "Confirmación",
    description: "Registro completado exitosamente",
    isCompleted: false,
  },
]
