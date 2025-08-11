import type { Step } from "@/types/registration"

export const registrationSteps: Step[] = [
  {
    id: 1,
    title: "Basic Information",
    description: "Employee personal details",
    isCompleted: false,
  },
  {
    id: 2,
    title: "Supplier Information",
    description: "Supplier details or existing ID",
    isCompleted: false,
  },
  {
    id: 3,
    title: "SMS Verification",
    description: "Confirm your phone number",
    isCompleted: false,
  },
  {
    id: 4,
    title: "Confirmation",
    description: "Registration completed successfully",
    isCompleted: false,
  },
]
