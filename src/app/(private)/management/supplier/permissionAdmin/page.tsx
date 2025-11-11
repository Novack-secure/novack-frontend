"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, Shield, Check, X, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function PermissionAdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-[#0386D9]"></div>
          <div className="text-white text-lg">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const users = [
    {
      id: 1,
      name: "María González",
      email: "maria.gonzalez@institucion.edu",
      role: "Administrador",
      permissions: ["dashboard", "users", "reports", "settings"],
      status: "active",
      avatar: "MG",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@institucion.edu",
      role: "Coordinador",
      permissions: ["dashboard", "reports"],
      status: "active",
      avatar: "CR",
    },
    {
      id: 3,
      name: "Ana Martínez",
      email: "ana.martinez@institucion.edu",
      role: "Profesor",
      permissions: ["dashboard"],
      status: "active",
      avatar: "AM",
    },
    {
      id: 4,
      name: "Luis Hernández",
      email: "luis.hernandez@institucion.edu",
      role: "Asistente",
      permissions: ["dashboard"],
      status: "inactive",
      avatar: "LH",
    },
    {
      id: 5,
      name: "Sofía López",
      email: "sofia.lopez@institucion.edu",
      role: "Administrador",
      permissions: ["dashboard", "users", "reports", "settings", "system"],
      status: "active",
      avatar: "SL",
    },
  ];

  const availablePermissions = [
    {
      id: "dashboard",
      name: "Dashboard",
      description: "Acceso al panel principal",
    },
    {
      id: "users",
      name: "Gestión de Usuarios",
      description: "Administrar usuarios y permisos",
    },
    { id: "reports", name: "Reportes", description: "Generar y ver reportes" },
    {
      id: "settings",
      name: "Configuración",
      description: "Configuración del sistema",
    },
    {
      id: "system",
      name: "Sistema",
      description: "Acceso completo al sistema",
    },
  ];

  const togglePermission = (userId: number, permissionId: string) => {
    console.log(`Toggle permission ${permissionId} for user ${userId}`);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full p-3 pl-2 overflow-hidden">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3"
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
              <BreadcrumbPage>Permisos</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      <div className="flex-1 overflow-auto space-y-3">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 rounded-xl bg-[#0386D9]/20 border border-[#0386D9]/30">
              <Shield className="h-6 w-6 text-[#0386D9]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Gestión de Permisos
              </h2>
              <p className="text-sm text-slate-400">
                Administre los permisos y accesos de los usuarios del sistema
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#0386D9]"
            />
          </div>
        </motion.div>

        {/* Users List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
            >
              <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-[#0386D9]/20 transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    {/* User Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="h-12 w-12 border border-[#0386D9]/30">
                        <AvatarFallback className="bg-[#0386D9] text-black font-semibold">
                          {user.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">
                            {user.name}
                          </h3>
                          <Badge
                            variant={
                              user.status === "active" ? "default" : "secondary"
                            }
                            className={
                              user.status === "active"
                                ? "bg-green-500/20 text-green-400 border-green-500/50"
                                : "bg-slate-500/20 text-slate-400 border-slate-500/50"
                            }
                          >
                            {user.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                          >
                            {user.role}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm">{user.email}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-white hover:bg-white/5"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-slate-900 border-white/10">
                        <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                          Editar Usuario
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10 cursor-pointer">
                          Resetear Contraseña
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-white/10 cursor-pointer">
                          Desactivar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Permissions Grid */}
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-slate-400 mb-3">
                      Permisos del Usuario
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {availablePermissions.map((permission) => {
                        const hasPermission = user.permissions.includes(
                          permission.id
                        );
                        const handleClick = () => {
                          togglePermission(user.id, permission.id);
                        };
                        const handleKeyDown = (e: React.KeyboardEvent) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            togglePermission(user.id, permission.id);
                          }
                        };
                        return (
                          <div
                            key={permission.id}
                            className={`flex items-center justify-between p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                              hasPermission
                                ? "bg-[#0386D9]/10 border-[#0386D9]"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                            onClick={handleClick}
                            onKeyDown={handleKeyDown}
                            role="button"
                            tabIndex={0}
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                {hasPermission ? (
                                  <Check className="w-4 h-4 text-[#0386D9]" />
                                ) : (
                                  <X className="w-4 h-4 text-slate-400" />
                                )}
                                <span
                                  className={`text-sm font-medium ${
                                    hasPermission
                                      ? "text-[#0386D9]"
                                      : "text-white"
                                  }`}
                                >
                                  {permission.name}
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">
                                {permission.description}
                              </p>
                            </div>
                            <Badge
                              variant={hasPermission ? "default" : "outline"}
                              className={
                                hasPermission
                                  ? "bg-[#0386D9] text-black"
                                  : "border-white/10 text-slate-400"
                              }
                            >
                              {hasPermission ? "Activo" : "Inactivo"}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
