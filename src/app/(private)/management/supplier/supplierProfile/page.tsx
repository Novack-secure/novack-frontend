"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { supplierService, type Supplier } from "@/lib/services";
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
  Calendar,
  Award,
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

const supplierSchema = z.object({
  supplier_name: z
    .string()
    .min(2, "El nombre del proveedor debe tener al menos 2 caracteres"),
  contact_email: z.string().email("Email inválido"),
  phone_number: z
    .string()
    .min(10, "El teléfono debe tener al menos 10 dígitos"),
  address: z.string().min(1, "La dirección es requerida"),
  description: z.string().optional(),
});

type SupplierFormData = z.infer<typeof supplierSchema>;

export default function SupplierProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading, updateUser } = useAuth();
  const router = useRouter();

  const [supplier, setSupplier] = useState<Supplier | null>(null);
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
  } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const loadSupplier = useCallback(async () => {
    if (!user?.supplier?.id) return;

    try {
      setIsLoading(true);
      const data = await supplierService.getById(user.supplier.id);
      setSupplier(data);
      reset({
        supplier_name: data.supplier_name || "",
        contact_email: data.contact_email || "",
        phone_number: data.phone_number || "",
        address: data.address || "",
        description: data.description || "",
      });
    } catch (error) {
      handleApiError(error, "Error al cargar información del proveedor");
    } finally {
      setIsLoading(false);
    }
  }, [user?.supplier?.id, reset]);

  useEffect(() => {
    if (isAuthenticated && user?.supplier?.id) {
      loadSupplier();
    }
  }, [isAuthenticated, user, loadSupplier]);

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

  const onSubmit = async (data: SupplierFormData) => {
    if (!user?.supplier?.id) return;

    try {
      setIsSubmitting(true);

      await supplierService.update(user.supplier.id, data);

      if (profileImage) {
        const response = await supplierService.uploadProfileImage(
          user.supplier.id,
          profileImage
        );

        // Update user context with new profile image
        if (response.url) {
          updateUser({ profile_image_url: response.url });
        }
      }

      showSuccess(
        "Perfil actualizado",
        "La información ha sido actualizada exitosamente"
      );
      setIsEditing(false);
      setProfileImage(null);
      setImagePreview(null);
      await loadSupplier();
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

  if (!isAuthenticated || !user || !supplier) {
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
                <BreadcrumbPage>Perfil del Proveedor</BreadcrumbPage>
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
              <h1 className="text-2xl font-bold text-white">
                Perfil del Proveedor
              </h1>
              <p className="text-sm text-slate-400 mt-1">
                Gestiona la información de tu empresa
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

        {/* Profile Image & Company Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Avatar className="h-24 w-24 border-2 border-[#0386D9]/30">
                  <AvatarImage src={imagePreview || supplier.logo_url || ""} />
                  <AvatarFallback className="bg-[#0386D9] text-black text-2xl font-bold">
                    {supplier.supplier_name[0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white">
                      {supplier.supplier_name}
                    </h2>
                    <Badge className="bg-[#0386D9]/20 text-[#0386D9] border-[#0386D9]/30">
                      Free
                    </Badge>
                  </div>
                  <div className="space-y-1 text-white">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#0386D9]" />
                      <span>{supplier.contact_email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#0386D9]" />
                      <span>{supplier.phone_number}</span>
                    </div>
                    {supplier.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#0386D9]" />
                        <span>{supplier.address}</span>
                      </div>
                    )}
                  </div>

                  {isEditing && (
                    <div className="mt-4">
                      <Label
                        htmlFor="logo"
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-[#0386D9]/10 hover:bg-[#0386D9]/20 text-[#0386D9] rounded-lg border border-[#0386D9]/30 transition-all"
                      >
                        <Upload className="w-4 h-4" />
                        Cambiar Logo
                      </Label>
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <Calendar className="w-6 h-6 text-[#0386D9] mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Miembro desde</p>
                    <p className="text-sm font-semibold text-white">
                      {new Date(supplier.created_at).toLocaleDateString(
                        "es-ES",
                        { month: "short", year: "numeric" }
                      )}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                    <Award className="w-6 h-6 text-[#0386D9] mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Plan</p>
                    <p className="text-sm font-semibold text-white">Free</p>
                  </div>
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
                  Información de la Empresa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Información de la Empresa */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0386D9] flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Datos de la Empresa
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="supplier_name" className="text-white">
                        Nombre del Proveedor *
                      </Label>
                      <Input
                        id="supplier_name"
                        {...register("supplier_name")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                      {errors.supplier_name && (
                        <p className="text-red-400 text-sm">
                          {errors.supplier_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Información de Contacto */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0386D9] flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Datos de Contacto
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contact_email" className="text-white">
                          Email de Contacto *
                        </Label>
                        <Input
                          id="contact_email"
                          type="email"
                          {...register("contact_email")}
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        />
                        {errors.contact_email && (
                          <p className="text-red-400 text-sm">
                            {errors.contact_email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone_number" className="text-white">
                          Teléfono *
                        </Label>
                        <Input
                          id="phone_number"
                          {...register("phone_number")}
                          className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        />
                        {errors.phone_number && (
                          <p className="text-red-400 text-sm">
                            {errors.phone_number.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Dirección */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0386D9] flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Ubicación
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-white">
                        Dirección *
                      </Label>
                      <Input
                        id="address"
                        {...register("address")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                      />
                      {errors.address && (
                        <p className="text-red-400 text-sm">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-white">
                        Descripción
                      </Label>
                      <Input
                        id="description"
                        {...register("description")}
                        className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
                        placeholder="Describe tu empresa..."
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
