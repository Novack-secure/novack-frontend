"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { employeeService, type Employee } from "@/lib/services";
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
  Briefcase,
  MapPin,
  Upload,
} from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const employeeSchema = z.object({
  first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  position: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

export default function EditEmployeePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    if (isAuthenticated && employeeId) {
      loadEmployee();
    }
  }, [isAuthenticated, employeeId]);

  const loadEmployee = async () => {
    try {
      setIsLoading(true);
      const data = await employeeService.getById(employeeId);
      setEmployee(data);
      reset({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || "",
        position: data.position || "",
        department: data.department || "",
        address: data.address || "",
      });
    } catch (error) {
      handleApiError(error, "Error al cargar empleado");
      router.push("/management/employee");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      setIsSubmitting(true);

      // Actualizar datos del empleado
      await employeeService.update(employeeId, data);

      // Si hay una imagen, subirla
      if (profileImage) {
        await employeeService.uploadProfileImage(employeeId, profileImage);
      }

      showSuccess(
        "Empleado actualizado",
        "Los datos han sido actualizados exitosamente"
      );
      router.push("/management/employee");
    } catch (error) {
      handleApiError(error, "Error al actualizar empleado");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#07D9D9] border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg">Cargando empleado...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !employee) {
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
            Editar Empleado
          </h1>
          <p className="text-gray-400 mt-1">
            Actualiza la información de {employee.first_name}{" "}
            {employee.last_name}
          </p>
        </motion.div>

        {/* Profile Image Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card className="bg-white/5 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-[#07D9D9]/30">
                  <AvatarImage
                    src={imagePreview || employee.profile_image_url || ""}
                  />
                  <AvatarFallback className="bg-[#07D9D9] text-[#010440] text-2xl font-bold">
                    {employee.first_name[0]}
                    {employee.last_name[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label
                    htmlFor="profile-image"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#07D9D9]/10 hover:bg-[#07D9D9]/20 text-[#07D9D9] rounded-lg border border-[#07D9D9]/30 transition-all"
                  >
                    <Upload className="w-4 h-4" />
                    Cambiar Foto
                  </Label>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-sm text-gray-400 mt-2">
                    JPG, PNG o GIF. Máximo 5MB.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
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
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>
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
                        Guardar Cambios
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





