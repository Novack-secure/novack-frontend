"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  User,
  Building,
  Phone,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  Mail,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  visitorService,
  Appointment,
  Visitor,
} from "@/lib/services/visitor.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function MeetingDetailPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "scheduled" | "checked_in" | "checked_out" | "cancelled"
  >("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadAppointments();
    }
  }, [isAuthenticated, user]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const visitors = await visitorService.getAll();
      const allAppointments = visitors
        .filter((v) => v.appointment)
        .map((v) => ({ ...v.appointment!, visitor: v })) as Appointment[];

      setAppointments(allAppointments);

      // Seleccionar la primera cita por defecto
      if (allAppointments.length > 0 && !selectedAppointment) {
        setSelectedAppointment(allAppointments[0]);
      }
    } catch (error) {
      console.error("Error al cargar citas:", error);
      toast.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async (appointmentId: string) => {
    try {
      const appointment = appointments.find((a) => a.id === appointmentId);
      if (!appointment?.visitor_id) return;

      await visitorService.checkOut(appointment.visitor_id);
      toast.success("Check-out realizado exitosamente");
      loadAppointments();
    } catch (error) {
      console.error("Error al hacer check-out:", error);
      toast.error("Error al realizar el check-out");
    }
  };

  // Filtrar citas
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Filtro por estado
      if (statusFilter !== "all" && appointment.status !== statusFilter) {
        return false;
      }

      // Filtro por búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const visitorName = `${appointment.visitor?.first_name || ""} ${
          appointment.visitor?.last_name || ""
        }`.toLowerCase();
        const purpose = (appointment.purpose || "").toLowerCase();
        const location = (appointment.location || "").toLowerCase();

        return (
          visitorName.includes(query) ||
          purpose.includes(query) ||
          location.includes(query)
        );
      }

      return true;
    });
  }, [appointments, statusFilter, searchQuery]);

  // Formatear fecha y hora
  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return {
        date: date.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
        time: date.toLocaleTimeString("es-ES", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    } catch {
      return { date: "N/A", time: "N/A" };
    }
  };

  // Obtener color de badge por estado
  const getStatusColor = (
    status: string
  ): { bg: string; text: string; icon: React.ReactNode } => {
    switch (status) {
      case "scheduled":
        return {
          bg: "bg-blue-500/10 border-blue-500/30",
          text: "text-blue-400",
          icon: <Calendar className="size-3" />,
        };
      case "checked_in":
        return {
          bg: "bg-green-500/10 border-green-500/30",
          text: "text-green-400",
          icon: <CheckCircle className="size-3" />,
        };
      case "checked_out":
        return {
          bg: "bg-gray-500/10 border-gray-500/30",
          text: "text-gray-400",
          icon: <XCircle className="size-3" />,
        };
      case "cancelled":
        return {
          bg: "bg-red-500/10 border-red-500/30",
          text: "text-red-400",
          icon: <XCircle className="size-3" />,
        };
      default:
        return {
          bg: "bg-gray-500/10 border-gray-500/30",
          text: "text-gray-400",
          icon: <Calendar className="size-3" />,
        };
    }
  };

  // Obtener iniciales
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="size-12 border-4 border-[#07D9D9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 pl-2">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-3">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/home"
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Home className="size-4" />
              Inicio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="text-gray-600" />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-white font-medium flex items-center gap-2">
              <Calendar className="size-4" />
              Citas
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden gap-3">
        {/* Lista de citas */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-96 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Calendar className="size-5 text-[#07D9D9]" />
                Citas Programadas
              </h2>
              <Button
                size="icon"
                className="size-8 bg-gradient-to-r from-[#07D9D9] to-[#0596A6] hover:from-[#0596A6] hover:to-[#07D9D9] text-black"
              >
                <Plus className="size-4" />
              </Button>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Buscar citas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#07D9D9] h-9"
              />
            </div>

            {/* Filtros de estado */}
            <div className="flex flex-wrap gap-2">
              {[
                "all",
                "scheduled",
                "checked_in",
                "checked_out",
                "cancelled",
              ].map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant="ghost"
                  onClick={() => setStatusFilter(status as typeof statusFilter)}
                  className={`h-8 text-xs transition-all ${
                    statusFilter === status
                      ? "bg-[#07D9D9]/10 border border-[#07D9D9]/30 text-[#07D9D9]"
                      : "bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {status === "all"
                    ? "Todas"
                    : status === "scheduled"
                    ? "Programadas"
                    : status === "checked_in"
                    ? "En Curso"
                    : status === "checked_out"
                    ? "Finalizadas"
                    : "Canceladas"}
                </Button>
              ))}
            </div>
          </div>

          {/* Lista de citas */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-12 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4 bg-white/10" />
                      <Skeleton className="h-3 w-1/2 bg-white/10" />
                    </div>
                  </div>
                  <Skeleton className="h-3 w-full bg-white/10" />
                </div>
              ))
            ) : filteredAppointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <Calendar className="size-16 text-gray-600 mb-4" />
                <p className="text-gray-400">No se encontraron citas</p>
                <p className="text-gray-500 text-sm mt-1">
                  {searchQuery
                    ? "Intenta con otros términos de búsqueda"
                    : "Agenda una nueva cita"}
                </p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => {
                const statusStyle = getStatusColor(appointment.status);
                const checkInDateTime = formatDateTime(
                  appointment.check_in_time
                );

                return (
                  <motion.button
                    key={appointment.id}
                    onClick={() => setSelectedAppointment(appointment)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-3 rounded-lg transition-all text-left ${
                      selectedAppointment?.id === appointment.id
                        ? "bg-[#07D9D9]/10 border border-[#07D9D9]/30"
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <Avatar className="size-12 border border-white/10">
                        <AvatarImage
                          src={appointment.visitor?.profile_image_url}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-[#07D9D9] to-[#0596A6] text-black text-sm font-semibold">
                          {getInitials(
                            appointment.visitor?.first_name || "",
                            appointment.visitor?.last_name || ""
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-sm truncate">
                          {appointment.visitor?.first_name}{" "}
                          {appointment.visitor?.last_name}
                        </h3>
                        <p className="text-xs text-gray-400 truncate">
                          {appointment.purpose}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="size-3" />
                        <span>
                          {checkInDateTime.date} • {checkInDateTime.time}
                        </span>
                      </div>
                      <Badge
                        className={`${statusStyle.bg} ${statusStyle.text} border text-xs flex items-center gap-1`}
                      >
                        {statusStyle.icon}
                        {appointment.status}
                      </Badge>
                    </div>
                  </motion.button>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Detalles de la cita */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden"
        >
          {selectedAppointment ? (
            <div className="h-full overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Header del visitante */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16 border-2 border-white/10">
                      <AvatarImage
                        src={selectedAppointment.visitor?.profile_image_url}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#07D9D9] to-[#0596A6] text-black text-xl font-bold">
                        {getInitials(
                          selectedAppointment.visitor?.first_name || "",
                          selectedAppointment.visitor?.last_name || ""
                        )}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {selectedAppointment.visitor?.first_name}{" "}
                        {selectedAppointment.visitor?.last_name}
                      </h2>
                      <p className="text-gray-400">
                        {selectedAppointment.visitor?.id_type}:{" "}
                        {selectedAppointment.visitor?.id_number}
                      </p>
                    </div>
                  </div>

                  {(() => {
                    const statusStyle = getStatusColor(
                      selectedAppointment.status
                    );
                    return (
                      <Badge
                        className={`${statusStyle.bg} ${statusStyle.text} border text-sm flex items-center gap-2 px-3 py-1`}
                      >
                        {statusStyle.icon}
                        <span className="capitalize">
                          {selectedAppointment.status}
                        </span>
                      </Badge>
                    );
                  })()}
                </div>

                {/* Información de contacto */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <User className="size-5 text-[#07D9D9]" />
                      Información de Contacto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                      <Mail className="size-4 text-gray-500" />
                      <span className="text-sm">
                        {selectedAppointment.visitor?.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-300">
                      <Phone className="size-4 text-gray-500" />
                      <span className="text-sm">
                        {selectedAppointment.visitor?.phone}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Detalles de la cita */}
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <Calendar className="size-5 text-[#07D9D9]" />
                      Detalles de la Cita
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 uppercase tracking-wide">
                        Propósito
                      </label>
                      <p className="text-white mt-1">
                        {selectedAppointment.purpose}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                          Check-in
                        </label>
                        <div className="flex items-center gap-2 text-white mt-1">
                          <Clock className="size-4 text-[#07D9D9]" />
                          <span className="text-sm">
                            {
                              formatDateTime(selectedAppointment.check_in_time)
                                .date
                            }
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">
                          {
                            formatDateTime(selectedAppointment.check_in_time)
                              .time
                          }
                        </p>
                      </div>

                      {selectedAppointment.check_out_time && (
                        <div>
                          <label className="text-xs text-gray-500 uppercase tracking-wide">
                            Check-out
                          </label>
                          <div className="flex items-center gap-2 text-white mt-1">
                            <Clock className="size-4 text-[#07D9D9]" />
                            <span className="text-sm">
                              {
                                formatDateTime(
                                  selectedAppointment.check_out_time
                                ).date
                              }
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm mt-1">
                            {
                              formatDateTime(selectedAppointment.check_out_time)
                                .time
                            }
                          </p>
                        </div>
                      )}
                    </div>

                    {selectedAppointment.location && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                          Ubicación
                        </label>
                        <div className="flex items-center gap-2 text-white mt-1">
                          <MapPin className="size-4 text-[#07D9D9]" />
                          <span className="text-sm">
                            {selectedAppointment.location}
                          </span>
                        </div>
                      </div>
                    )}

                    {selectedAppointment.host_employee && (
                      <div>
                        <label className="text-xs text-gray-500 uppercase tracking-wide">
                          Anfitrión
                        </label>
                        <div className="flex items-center gap-2 text-white mt-1">
                          <User className="size-4 text-[#07D9D9]" />
                          <span className="text-sm">
                            {selectedAppointment.host_employee.first_name}{" "}
                            {selectedAppointment.host_employee.last_name}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Acciones */}
                {selectedAppointment.status === "checked_in" && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleCheckOut(selectedAppointment.id)}
                      className="flex-1 bg-gradient-to-r from-[#07D9D9] to-[#0596A6] hover:from-[#0596A6] hover:to-[#07D9D9] text-black"
                    >
                      <CheckCircle className="size-4 mr-2" />
                      Realizar Check-out
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Calendar className="size-20 text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                Selecciona una cita
              </h3>
              <p className="text-gray-400">
                Elige una cita de la lista para ver sus detalles
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
