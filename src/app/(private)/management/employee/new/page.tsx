"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { employeeService } from "@/lib/services";
import { handleApiError, showSuccess } from "@/lib/utils/error-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const employeeSchema = z.object({
  first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  position: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function NewEmployeePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  const onSubmit = async (data: EmployeeFormData) => {
    if (!user?.supplier_id) {
      handleApiError(new Error("No se encontró el ID del proveedor"), "Error");
      return;
    }

    try {
      setIsSubmitting(true);
      await employeeService.create({
        ...data,
        supplier_id: user.supplier_id,
        is_creator: false,
      });
      showSuccess("Empleado creado", "El empleado ha sido creado exitosamente");
      router.push("/management/employee");
    } catch (error) {
      handleApiError(error, "Error al crear empleado");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-black overflow-auto">
      <div className="flex-1 p-6">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4 text-gray-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#07D9D9] to-[#0596A6] bg-clip-text text-transparent">
            Nuevo Empleado
          </h1>
          <p className="text-gray-400 mt-1">
            Registra un nuevo empleado en el sistema
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">
                Información del Empleado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#07D9D9] flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información Personal
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-gray-300">
                        Nombre *
                      </Label>
                      <Input
                        id="first_name"
                        {...register("first_name")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        placeholder="Juan"
                      />
                      {errors.first_name && (
                        <p className="text-red-400 text-sm">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="text-gray-300">
                        Apellido *
                      </Label>
                      <Input
                        id="last_name"
                        {...register("last_name")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        placeholder="Pérez"
                      />
                      {errors.last_name && (
                        <p className="text-red-400 text-sm">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contacto */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#07D9D9] flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Información de Contacto
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        placeholder="juan@empresa.com"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-gray-300">
                        Teléfono *
                      </Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        placeholder="+1234567890"
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-300">
                      Contraseña *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      placeholder="Mínimo 8 caracteres"
                    />
                    {errors.password && (
                      <p className="text-red-400 text-sm">
                        {errors.password.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Información Laboral */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#07D9D9] flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Información Laboral
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-gray-300">
                        Cargo
                      </Label>
                      <Input
                        id="position"
                        {...register("position")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        placeholder="Gerente de Seguridad"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-gray-300">
                        Departamento
                      </Label>
                      <Input
                        id="department"
                        {...register("department")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                        placeholder="Seguridad"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="address"
                      className="text-gray-300 flex items-center gap-2"
                    >
                      <MapPin className="w-4 h-4" />
                      Dirección
                    </Label>
                    <Input
                      id="address"
                      {...register("address")}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                      placeholder="Calle Principal #123"
                    />
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 border-white/10 text-gray-300 hover:bg-white/5"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#07D9D9] hover:bg-[#0596A6] text-[#010440] font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-[#010440] border-t-transparent rounded-full animate-spin mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Empleado
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}





