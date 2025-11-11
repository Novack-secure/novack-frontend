"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { employeeService, type Employee } from "@/lib/services";
import { handleApiError, showSuccess } from "@/lib/utils/error-handler";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  Home,
  Users,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";

export default function EmployeeManagementPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const loadEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      // Obtener empleados del proveedor directamente desde el backend
      if (user?.supplier?.id) {
        const data = await employeeService.getBySupplier(user.supplier.id);
        setEmployees(data);
        setFilteredEmployees(data);
      } else {
        // Si no tiene supplier_id, cargar todos (caso admin)
        const data = await employeeService.getAll();
        setEmployees(data);
        setFilteredEmployees(data);
      }
    } catch (error) {
      handleApiError(error, "Error al cargar empleados");
    } finally {
      setIsLoading(false);
    }
  }, [user?.supplier?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.supplier?.id) {
      loadEmployees();
    }
  }, [isAuthenticated, user, loadEmployees]);

  useEffect(() => {
    // Filtrar empleados cuando cambia el término de búsqueda
    if (searchTerm.trim() === "") {
      setFilteredEmployees(employees);
    } else {
      const filtered = employees.filter(
        (emp) =>
          emp.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEmployees(filtered);
    }
  }, [searchTerm, employees]);

  const openDeleteDialog = (id: string, employeeName: string) => {
    setEmployeeToDelete({ id, name: employeeName });
    setDeleteDialogOpen(true);
  };

  const handleDeleteEmployee = async () => {
    if (!employeeToDelete) return;

    try {
      setIsDeleting(true);
      await employeeService.delete(employeeToDelete.id);
      showSuccess(
        "Empleado eliminado",
        "El empleado ha sido eliminado exitosamente"
      );
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
      loadEmployees();
    } catch (error) {
      handleApiError(error, "Error al eliminar empleado");
    } finally {
      setIsDeleting(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0386D9] border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg">Cargando empleados...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
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
                <BreadcrumbLink href="/management/employee">
                  Gestión
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Empleados</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-[#0386D9]" />
                <div>
                  <h2 className="text-xl font-bold text-white">Gestión de Empleados</h2>
                  <p className="text-sm text-slate-400">
                    Total de empleados: {filteredEmployees.length}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => router.push("/management/employee/new")}
                className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Nuevo Empleado
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nombre, email, departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Employee List - Content */}
          <div className="flex-1 overflow-auto p-4">
            {filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Users className="h-16 w-16 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {searchTerm
                    ? "No se encontraron empleados"
                    : "No hay empleados registrados"}
                </h3>
                {!searchTerm && (
                  <>
                    <p className="text-slate-400 mb-6">Crea tu primer empleado para comenzar</p>
                    <Button
                      onClick={() => router.push("/management/employee/new")}
                      className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      Crear Empleado
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:border-[#0386D9]/20 transition-all duration-300">
                      <CardContent className="p-6">
                        {/* Header del empleado */}
                        <div className="flex items-start gap-3 mb-4">
                          <Avatar className="h-12 w-12 border border-[#0386D9]/30">
                            <AvatarFallback className="bg-[#0386D9] text-black font-semibold">
                              {employee.first_name[0]}
                              {employee.last_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-white truncate">
                              {employee.first_name} {employee.last_name}
                            </h3>
                            <p className="text-sm text-slate-400 truncate">
                              {employee.position || "Sin cargo"}
                            </p>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {employee.is_creator && (
                                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                  Creador
                                </Badge>
                              )}
                              {employee.role && (
                                <Badge className="bg-[#0386D9]/20 text-[#0386D9] border-[#0386D9]/30">
                                  {employee.role.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Información de contacto */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-4 h-4 text-[#0386D9]" />
                            <span className="text-slate-300 truncate">
                              {employee.email}
                            </span>
                          </div>
                          {employee.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-[#0386D9]" />
                              <span className="text-slate-300">
                                {employee.phone}
                              </span>
                            </div>
                          )}
                          {employee.department && (
                            <div className="flex items-center gap-2 text-sm">
                              <Building className="w-4 h-4 text-[#0386D9]" />
                              <span className="text-slate-300">
                                {employee.department}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Acciones */}
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-[#0386D9] text-[#0386D9] hover:bg-[#0386D9] hover:text-black"
                            onClick={() =>
                              router.push(`/management/employee/${employee.id}`)
                            }
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          {!employee.is_creator && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                              onClick={() =>
                                openDeleteDialog(
                                  employee.id,
                                  `${employee.first_name} ${employee.last_name}`
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-black/95 backdrop-blur-xl border border-red-500/30 text-white max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-500/20 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <DialogTitle className="text-xl text-white">
                Eliminar Empleado
              </DialogTitle>
            </div>
            <DialogDescription className="text-slate-300 text-base pt-2">
              ¿Estás seguro de que deseas eliminar a{" "}
              <span className="font-semibold text-white">
                {employeeToDelete?.name}
              </span>
              ?
              <br />
              <br />
              Esta acción no se puede deshacer y se eliminarán todos los datos
              asociados al empleado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setEmployeeToDelete(null);
              }}
              disabled={isDeleting}
              className="border-white/10 hover:bg-white/5 text-white"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteEmployee}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
