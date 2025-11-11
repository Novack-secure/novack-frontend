"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Phone,
  Filter,
  CheckCircle,
  XCircle,
  Mail,
  Home,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  appointmentService,
  Appointment,
} from "@/lib/services/appointment.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import MapUser from "@/components/private/map/mapUser";

export default function MeetingDetailPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pendiente" | "en_progreso" | "completado" | "cancelado"
  >("all");
  const [timeFilter, setTimeFilter] = useState<
    "all" | "today" | "week" | "month"
  >("all");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<"mapa" | "detalles">("mapa");
  const [viewMode] = useState<"active" | "archived">("active");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const loadAppointments = useCallback(async () => {
    if (!user?.supplier?.id) return;
    try {
      setLoading(true);
      const supplierId = user.supplier.id;

      // Solo archivar cuando estamos en modo activo
      if (viewMode === "active") {
        try {
          const archiveResult = await appointmentService.archiveOldAppointments(
            supplierId
          );

          // Mostrar notificación solo si se archivaron citas
          if (archiveResult.archived > 0) {
            toast.info(
              `${archiveResult.archived} ${
                archiveResult.archived === 1
                  ? "cita completada ha sido archivada"
                  : "citas completadas han sido archivadas"
              }`,
              {
                description:
                  "Las citas archivadas están disponibles en la pestaña de archivados",
              }
            );
          }
        } catch (archiveError) {
          console.warn(
            "No se pudieron archivar las citas antiguas:",
            archiveError
          );
        }
      }

      // Obtener citas según el modo
      const allAppointments =
        viewMode === "active"
          ? await appointmentService.getAll(supplierId)
          : await appointmentService.getArchived(supplierId);

      setAppointments(allAppointments);

      // Seleccionar la primera cita por defecto
      if (allAppointments.length > 0 && !selectedAppointment) {
        setSelectedAppointment(allAppointments[0]);
      } else if (allAppointments.length === 0) {
        setSelectedAppointment(null);
      }
    } catch (error) {
      console.error("Error al cargar citas:", error);
      toast.error("Error al cargar las citas");
    } finally {
      setLoading(false);
    }
  }, [user?.supplier?.id, selectedAppointment, viewMode]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  // Recargar cuando cambie el modo de vista
  useEffect(() => {
    if (isAuthenticated && user) {
      setSelectedAppointment(null);
      loadAppointments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  const handleCheckIn = async (appointmentId: string) => {
    try {
      const updatedAppointment = await appointmentService.checkIn(
        appointmentId
      );
      toast.success("Check-in realizado exitosamente");

      // Update both the list and selected appointment
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? updatedAppointment : apt))
      );
      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment(updatedAppointment);
      }
    } catch (error) {
      type ErrorWithResponse = {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const e = error as ErrorWithResponse;
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "Error al realizar el check-in";
      toast.error(errorMessage);
    }
  };

  const handleCheckOut = async (appointmentId: string) => {
    try {
      const updatedAppointment = await appointmentService.checkOut(
        appointmentId
      );
      toast.success("Check-out realizado exitosamente");

      // Update both the list and selected appointment
      setAppointments((prev) =>
        prev.map((apt) => (apt.id === appointmentId ? updatedAppointment : apt))
      );
      if (selectedAppointment?.id === appointmentId) {
        setSelectedAppointment(updatedAppointment);
      }
    } catch (error) {
      type ErrorWithResponse = {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const e = error as ErrorWithResponse;
      const errorMessage =
        e?.response?.data?.message ||
        e?.message ||
        "Error al realizar el check-out";
      toast.error(errorMessage);
    }
  };

  // Filtrar citas
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      // Filtro por estado
      if (statusFilter !== "all" && appointment.status !== statusFilter) {
        return false;
      }

      // Filtro por tiempo
      if (timeFilter !== "all") {
        const appointmentDate = new Date(appointment.scheduled_time);
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
        const monthFromNow = new Date(
          today.getTime() + 30 * 24 * 60 * 60 * 1000
        );

        if (timeFilter === "today") {
          const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
          if (appointmentDate < today || appointmentDate >= tomorrow)
            return false;
        } else if (timeFilter === "week") {
          if (appointmentDate < today || appointmentDate >= weekFromNow)
            return false;
        } else if (timeFilter === "month") {
          if (appointmentDate < today || appointmentDate >= monthFromNow)
            return false;
        }
      }

      // Filtro por búsqueda
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const visitorName = (appointment.visitor?.name || "").toLowerCase();
        const title = (appointment.title || "").toLowerCase();
        const location = (appointment.location || "").toLowerCase();

        return (
          visitorName.includes(query) ||
          title.includes(query) ||
          location.includes(query)
        );
      }

      return true;
    });
  }, [appointments, statusFilter, timeFilter, searchQuery]);

  // Formatear fecha y hora
  const formatDateTime = (dateString: string) => {
    if (!dateString) {
      return { date: "N/A", time: "N/A" };
    }

    try {
      const date = new Date(dateString);

      // Verificar si la fecha es válida
      if (isNaN(date.getTime())) {
        return { date: "N/A", time: "N/A" };
      }

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
  ): { bg: string; text: string; icon: React.ReactNode; label: string } => {
    switch (status) {
      case "pendiente":
        return {
          bg: "bg-yellow-500/10 border-yellow-500/30",
          text: "text-yellow-400",
          icon: <Clock className="size-3" />,
          label: "Pendiente",
        };
      case "en_progreso":
        return {
          bg: "bg-[#0386D9]/10 border-[#0386D9]/30",
          text: "text-[#0386D9]",
          icon: <CheckCircle className="size-3" />,
          label: "En Progreso",
        };
      case "completado":
        return {
          bg: "bg-green-500/10 border-green-500/30",
          text: "text-green-400",
          icon: <CheckCircle className="size-3" />,
          label: "Completado",
        };
      case "cancelado":
        return {
          bg: "bg-red-500/10 border-red-500/30",
          text: "text-red-400",
          icon: <XCircle className="size-3" />,
          label: "Cancelado",
        };
      default:
        return {
          bg: "bg-gray-500/10 border-gray-500/30",
          text: "text-gray-400",
          icon: <Calendar className="size-3" />,
          label: "Desconocido",
        };
    }
  };

  // Obtener iniciales del nombre completo
  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="size-12 border-4 border-[#0386D9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden p-3 pl-2">
      {/* Breadcrumb y enlace a historial */}
      <div className="flex items-center justify-between mb-3">
        <Breadcrumb>
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push("/visitor")}
          className="border-white/10 text-slate-400 hover:text-white hover:bg-white/10"
        >
          <User className="size-4 mr-2" />
          Ver Historial de Visitantes
        </Button>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex overflow-hidden gap-3">
        {/* Lista de citas - Más pequeña */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="w-80 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-3 border-b border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-white flex items-center gap-2">
                <Calendar className="size-4 text-[#0386D9]" />
                Citas
              </h2>
              <span className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded">
                {appointments.length}
              </span>
            </div>

            {/* Solo mostrar activas */}
            <div className="flex gap-2">
              <div className="flex-1 h-8 text-xs bg-[#0386D9]/10 text-[#0386D9] border border-[#0386D9]/30 rounded-lg flex items-center justify-center font-medium">
                Activas
              </div>
            </div>

            {/* Barra de búsqueda */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-gray-500" />
              <Input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-white/5 border-white/10 text-white placeholder-gray-500 focus:border-[#0386D9] h-8 text-xs"
              />
            </div>

            {/* Botón de filtros */}
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-[#0386D9]/50 transition-colors w-full"
              >
                <div className="flex flex-col gap-0.5">
                  <div className="w-3 h-0.5 bg-[#0386D9] rounded"></div>
                  <div className="w-3 h-0.5 bg-[#0386D9] rounded"></div>
                  <div className="w-3 h-0.5 bg-[#0386D9] rounded"></div>
                </div>
                <span className="text-[10px] text-gray-400">Filtros</span>
                {(statusFilter !== "all" || timeFilter !== "all") && (
                  <span className="ml-auto size-1.5 rounded-full bg-[#0386D9]"></span>
                )}
              </button>

              {showFilters && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden">
                  <div className="p-3 border-b border-white/10">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
                      Estado
                    </p>
                    <div className="space-y-1">
                      {[
                        { value: "all", label: "Todas" },
                        { value: "pendiente", label: "Pendientes" },
                        { value: "en_progreso", label: "En Progreso" },
                        { value: "completado", label: "Completadas" },
                        { value: "cancelado", label: "Canceladas" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => {
                            setStatusFilter(value as typeof statusFilter);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors font-medium ${
                            statusFilter === value
                              ? "bg-[#0386D9]/10 text-[#0386D9] border border-[#0386D9]/30"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {statusFilter === value && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0386D9] mr-2"></span>
                          )}
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3">
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mb-2">
                      Tiempo
                    </p>
                    <div className="space-y-1">
                      {[
                        { value: "all", label: "Todos" },
                        { value: "today", label: "Hoy" },
                        { value: "week", label: "Esta Semana" },
                        { value: "month", label: "Este Mes" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => {
                            setTimeFilter(value as typeof timeFilter);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors font-medium ${
                            timeFilter === value
                              ? "bg-[#0386D9]/10 text-[#0386D9] border border-[#0386D9]/30"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {timeFilter === value && (
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#0386D9] mr-2"></span>
                          )}
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
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
                <p className="text-gray-400">
                  {viewMode === "active"
                    ? "No hay citas activas"
                    : "No hay citas archivadas"}
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  {searchQuery
                    ? "Intenta con otros términos de búsqueda"
                    : viewMode === "active"
                    ? "Agenda una nueva cita"
                    : "Las citas se archivan 12 horas después del check-out"}
                </p>
              </div>
            ) : (
              filteredAppointments.map((appointment) => {
                const statusStyle = getStatusColor(appointment.status);
                const scheduledDateTime = formatDateTime(
                  appointment.scheduled_time
                );

                return (
                  <button
                    key={appointment.id}
                    onClick={() => setSelectedAppointment(appointment)}
                    className={`w-full p-2 rounded transition-all text-left ${
                      selectedAppointment?.id === appointment.id
                        ? "bg-[#0386D9]/10 border border-[#0386D9]/30"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="size-8">
                        <AvatarImage
                          src={appointment.visitor?.profile_image_url}
                        />
                        <AvatarFallback className="bg-linear-to-br from-[#0386D9] to-[#0596A6] text-black text-xs font-semibold">
                          {getInitials(appointment.visitor?.name || "?")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white text-xs truncate">
                          {appointment.visitor?.name}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                          <Clock className="size-3" />
                          <span>
                            {scheduledDateTime.date} • {scheduledDateTime.time}
                          </span>
                        </div>
                        <span
                          className={`mt-1 inline-block px-1.5 py-0.5 rounded text-[9px] ${
                            appointment.status === "pendiente"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : appointment.status === "en_progreso"
                              ? "bg-[#0386D9]/10 text-[#0386D9]"
                              : appointment.status === "completado"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                          }`}
                        >
                          {statusStyle.label}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Panel derecho - Mapa o Detalles */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden flex flex-col"
        >
          {/* Información básica del usuario - Arriba del switch */}
          {selectedAppointment && (
            <div className="p-4 border-b border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-12 border-2 border-[#0386D9]/20">
                  <AvatarImage
                    src={selectedAppointment.visitor?.profile_image_url}
                  />
                  <AvatarFallback className="bg-linear-to-br from-[#0386D9] to-[#0596A6] text-black text-sm font-bold">
                    {getInitials(selectedAppointment.visitor?.name || "?")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-semibold text-white truncate">
                    {selectedAppointment.visitor?.name}
                  </h2>
                  <p className="text-xs text-gray-400 truncate">
                    {selectedAppointment.visitor?.email}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {selectedAppointment.visitor?.phone}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-[10px] font-medium ${
                    selectedAppointment.status === "pendiente"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : selectedAppointment.status === "en_progreso"
                      ? "bg-[#0386D9]/10 text-[#0386D9]"
                      : selectedAppointment.status === "completado"
                      ? "bg-green-500/10 text-green-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {getStatusColor(selectedAppointment.status).label}
                </span>
              </div>

              {/* Botones de acción - Debajo del status */}
              <div className="flex gap-2">
                {selectedAppointment.status === "pendiente" && (
                  <Button
                    onClick={() => handleCheckIn(selectedAppointment.id)}
                    className="flex-1 bg-gradient-to-r from-[#0386D9] to-[#0596A6] hover:from-[#0270BE] hover:to-[#0386D9] text-black font-semibold text-xs h-9"
                  >
                    <CheckCircle className="size-3 mr-1.5" />
                    Check-in
                  </Button>
                )}

                {selectedAppointment.status === "en_progreso" && (
                  <Button
                    onClick={() => handleCheckOut(selectedAppointment.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs h-9"
                  >
                    <XCircle className="size-3 mr-1.5" />
                    Check-out
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Mini menú switch */}
          <div className="p-3 border-b border-white/10">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveView("mapa")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === "mapa"
                    ? "bg-[#0386D9]/10 text-[#0386D9] border border-[#0386D9]/30"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <MapPin className="size-4 inline-block mr-2" />
                Mapa
              </button>
              <button
                onClick={() => setActiveView("detalles")}
                className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeView === "detalles"
                    ? "bg-[#0386D9]/10 text-[#0386D9] border border-[#0386D9]/30"
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <User className="size-4 inline-block mr-2" />
                Detalles
              </button>
            </div>
          </div>

          {/* Vista de Mapa */}
          {activeView === "mapa" && (
            <div className="flex-1 p-4">
              {selectedAppointment &&
               selectedAppointment.status === "en_progreso" &&
               selectedAppointment.visitor?.card ? (
                <div className="h-full rounded-lg overflow-hidden border border-white/10">
                  <MapUser
                    lat={9.890120003476955 + (Math.random() - 0.5) * 0.01}
                    lng={-84.08738029648394 + (Math.random() - 0.5) * 0.01}
                    userName={selectedAppointment.visitor?.name || "Visitante"}
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="p-6 rounded-full bg-white/5 border border-white/10 mb-4">
                    {selectedAppointment ? (
                      <Calendar className="size-16 text-gray-600" />
                    ) : (
                      <MapPin className="size-16 text-gray-600" />
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {!selectedAppointment
                      ? "Selecciona una cita"
                      : selectedAppointment.status === "pendiente"
                      ? "Cita Pendiente"
                      : selectedAppointment.status === "completado"
                      ? "Cita Completada"
                      : "Sin Tarjeta Asignada"
                    }
                  </h3>
                  <p className="text-gray-400">
                    {!selectedAppointment
                      ? "Elige una cita de la lista para ver su ubicación en el mapa"
                      : selectedAppointment.status === "pendiente"
                      ? "La cita aún no ha comenzado. Haz check-in para ver la ubicación."
                      : selectedAppointment.status === "completado"
                      ? "La cita ha finalizado."
                      : "La ubicación se mostrará cuando el visitante tenga una tarjeta asignada."
                    }
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Vista de Detalles */}
          {activeView === "detalles" && selectedAppointment ? (
            <div className="h-full overflow-y-auto p-4">
              <div className="space-y-3">
                {/* Información de contacto */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-lg bg-linear-to-br from-white/5 to-white/2 border border-white/10 hover:border-[#0386D9]/30 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-[#0386D9]/10">
                        <Mail className="size-4 text-[#0386D9]" />
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        Email
                      </span>
                    </div>
                    <p className="text-sm text-white font-medium break-all">
                      {selectedAppointment.visitor?.email}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-linear-to-br from-white/5 to-white/2 border border-white/10 hover:border-[#0386D9]/30 transition-all">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-[#0386D9]/10">
                        <Phone className="size-4 text-[#0386D9]" />
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        Teléfono
                      </span>
                    </div>
                    <p className="text-sm text-white font-medium">
                      {selectedAppointment.visitor?.phone}
                    </p>
                  </div>
                </div>

                {/* Detalles de la cita */}
                <div className="space-y-3">
                  <div className="p-4 rounded-lg bg-linear-to-br from-white/5 to-white/2 border border-white/10">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-lg bg-[#0386D9]/10">
                        <Calendar className="size-4 text-[#0386D9]" />
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                        Propósito de la visita
                      </span>
                    </div>
                    <p className="text-sm text-white font-semibold">
                      {selectedAppointment.title || "Sin título"}
                    </p>
                  </div>

                  {selectedAppointment.description && (
                    <div className="p-4 rounded-lg bg-linear-to-br from-white/5 to-white/2 border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-[#0386D9]/10">
                          <Filter className="size-4 text-[#0386D9]" />
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                          Detalles
                        </span>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">
                        {selectedAppointment.description}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 rounded-lg bg-linear-to-br from-[#0386D9]/5 to-[#0386D9]/2 border border-[#0386D9]/20">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-[#0386D9]/10">
                          <Clock className="size-4 text-[#0386D9]" />
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                          Programada
                        </span>
                      </div>
                      <p className="text-white text-xs font-medium mb-1">
                        {
                          formatDateTime(selectedAppointment.scheduled_time)
                            .date
                        }
                      </p>
                      <p className="text-[#0386D9] text-sm font-bold">
                        {
                          formatDateTime(selectedAppointment.scheduled_time)
                            .time
                        }
                      </p>
                    </div>

                    {selectedAppointment.check_in_time && (
                      <div className="p-4 rounded-lg bg-linear-to-br from-green-500/10 to-green-500/2 border border-green-500/30">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-green-500/10">
                            <CheckCircle className="size-4 text-green-400" />
                          </div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                            Check-in
                          </span>
                        </div>
                        <p className="text-white text-xs font-medium mb-1">
                          {
                            formatDateTime(selectedAppointment.check_in_time)
                              .date
                          }
                        </p>
                        <p className="text-green-400 text-sm font-bold">
                          {
                            formatDateTime(selectedAppointment.check_in_time)
                              .time
                          }
                        </p>
                      </div>
                    )}

                    {selectedAppointment.check_out_time && (
                      <div className="p-4 rounded-lg bg-linear-to-br from-white/5 to-white/2 border border-white/10">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 rounded-lg bg-white/5">
                            <XCircle className="size-4 text-gray-400" />
                          </div>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                            Check-out
                          </span>
                        </div>
                        <p className="text-white text-xs font-medium mb-1">
                          {
                            formatDateTime(selectedAppointment.check_out_time)
                              .date
                          }
                        </p>
                        <p className="text-gray-400 text-sm font-bold">
                          {
                            formatDateTime(selectedAppointment.check_out_time)
                              .time
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  {selectedAppointment.location && (
                    <div className="p-4 rounded-lg bg-linear-to-br from-white/5 to-white/2 border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-[#0386D9]/10">
                          <MapPin className="size-4 text-[#0386D9]" />
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                          Ubicación
                        </span>
                      </div>
                      <p className="text-white text-xs font-medium">
                        {selectedAppointment.location}
                      </p>
                    </div>
                  )}

                  {selectedAppointment.host_employee && (
                    <div className="p-4 rounded-lg bg-linear-to-br from-white/5 to-white/2 border border-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-lg bg-[#0386D9]/10">
                          <User className="size-4 text-[#0386D9]" />
                        </div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                          Anfitrión Asignado
                        </span>
                      </div>
                      <p className="text-white text-xs font-semibold mb-1">
                        {selectedAppointment.host_employee.first_name}{" "}
                        {selectedAppointment.host_employee.last_name}
                      </p>
                      <p className="text-gray-400 text-[10px]">
                        {selectedAppointment.host_employee.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : null}

          {/* Mensaje cuando no hay cita seleccionada en vista detalles */}
          {activeView === "detalles" && !selectedAppointment && (
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
