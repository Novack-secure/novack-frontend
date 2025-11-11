"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { employeeService, type Employee } from "@/lib/services";
import { handleApiError, showSuccess } from "@/lib/utils/error-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Home,
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Save,
  Upload,
  Briefcase,
} from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const profileSchema = z.object({
  first_name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  last_name: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 dígitos"),
  position: z.string().optional(),
  department: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, updateUser } = useAuth();
  const router = useRouter();

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const loadProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const data = await employeeService.getById(user.id);
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
      handleApiError(error, "Error al cargar perfil");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, reset]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadProfile();
    }
  }, [isAuthenticated, user, loadProfile]);

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

  const onSubmit = async (data: ProfileFormData) => {
    if (!user?.id) return;

    try {
      setIsSubmitting(true);

      await employeeService.update(user.id, data);

      if (profileImage) {
        const response = await employeeService.uploadProfileImage(
          user.id,
          profileImage
        );

        // Update user context with new profile image
        if (response.url) {
          updateUser({ profile_image_url: response.url });
        }
      }

      // Update user context with new data
      updateUser({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
      });

      showSuccess(
        "Perfil actualizado",
        "Tu información ha sido actualizada exitosamente"
      );
      setIsEditing(false);
      setProfileImage(null);
      setImagePreview(null);
      await loadProfile();
    } catch (error) {
      handleApiError(error, "Error al actualizar perfil");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-[#0386D9]"></div>
          <p className="text-white text-lg">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !employee) {
    return null;
  }

  return (
    <div className="flex flex-col h-full p-3 pl-2 overflow-hidden">
      <div className="flex-1 overflow-auto space-y-3">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/home">
                  <Home className="h-4 w-4" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Mi Perfil</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Mi Perfil</h1>
              <p className="text-sm text-slate-400 mt-1">
                Gestiona tu información personal
              </p>
            </div>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[#0386D9] hover:bg-[#0270BE] text-black font-semibold"
              >
                <Save className="w-4 h-4 mr-2" />
                Editar Perfil
              </Button>
            )}
          </div>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-[#0386D9]/30">
                  <AvatarImage
                    src={imagePreview || employee.profile_image_url || ""}
                  />
                  <AvatarFallback className="bg-[#0386D9] text-black text-2xl font-bold">
                    {employee.first_name[0]}
                    {employee.last_name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      {employee.first_name} {employee.last_name}
                    </h2>
                    {employee.is_creator && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                        Creador
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-white">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#0386D9]" />
                      <span>{employee.email}</span>
                    </div>
                    {employee.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#0386D9]" />
                        <span>{employee.phone}</span>
                      </div>
                    )}
                    {employee.position && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-[#0386D9]" />
                        <span>{employee.position}</span>
                      </div>
                    )}
                    {employee.department && (
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-[#0386D9]" />
                        <span>{employee.department}</span>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-4">
                      <Label
                        htmlFor="profileImage"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#0386D9]/10 hover:bg-[#0386D9]/20 text-[#0386D9] rounded-lg border border-[#0386D9]/30 transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        Cambiar Foto de Perfil
                      </Label>
                      <Input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Edit Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Información Personal */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0386D9] flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Datos Personales
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
                        />
                        {errors.last_name && (
                          <p className="text-red-400 text-sm">
                            {errors.last_name.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0386D9] flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Contacto
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
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Dirección
                        </div>
                      </Label>
                      <Input
                        id="address"
                        {...register("address")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Botones */}
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-2">
                      <div className="flex gap-3 justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsEditing(false);
                            reset();
                          }}
                          className="border-white/10 text-slate-400 hover:text-white hover:bg-white/5"
                          disabled={isSubmitting}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          className="bg-[#0386D9] hover:bg-[#0270BE] text-black font-semibold"
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
                              Guardar Cambios
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
        )}
      </div>
    </div>
  );
}
