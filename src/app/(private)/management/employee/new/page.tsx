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
import { ArrowLeft, Save, User, Mail, Briefcase, MapPin } from "lucide-react";
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
    if (!user?.supplier?.id) {
      handleApiError(new Error("No se encontró el ID del proveedor"), "Error");
      return;
    }

    try {
      setIsSubmitting(true);
      await employeeService.create({
        ...data,
        supplier_id: user.supplier.id,
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
    <div className="flex flex-col h-full p-3 pl-2 overflow-hidden">
      <div className="flex-1 overflow-auto space-y-3">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4"
        >
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white hover:bg-white/5"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Nuevo Empleado</h1>
            <p className="text-sm text-slate-400">
              Registra un nuevo empleado en el sistema
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
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
                  <h3 className="text-lg font-semibold text-[#0386D9] flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información Personal
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name" className="text-white">
                        Nombre *
                      </Label>
                      <Input
                        id="first_name"
                        {...register("first_name")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        placeholder="Juan"
                      />
                      {errors.first_name && (
                        <p className="text-red-400 text-sm">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="last_name" className="text-white">
                        Apellido *
                      </Label>
                      <Input
                        id="last_name"
                        {...register("last_name")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
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
                  <h3 className="text-lg font-semibold text-[#0386D9] flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Información de Contacto
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        placeholder="juan@empresa.com"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-sm">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-white">
                        Teléfono *
                      </Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
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
                    <Label htmlFor="password" className="text-white">
                      Contraseña *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      {...register("password")}
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
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
                  <h3 className="text-lg font-semibold text-[#0386D9] flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Información Laboral
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-white">
                        Cargo
                      </Label>
                      <Input
                        id="position"
                        {...register("position")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        placeholder="Gerente de Seguridad"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department" className="text-white">
                        Departamento
                      </Label>
                      <Input
                        id="department"
                        {...register("department")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
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
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      placeholder="Calle Principal #123"
                    />
                  </div>
                </div>

                {/* Botones */}
                <Card className="bg-white/5 border-white/10 mt-6">
                  <CardContent className="p-2">
                    <div className="flex gap-3 justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                        disabled={isSubmitting}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
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
                  </CardContent>
                </Card>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
