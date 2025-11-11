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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  Users,
  Clock,
  User,
  Phone,
  Mail,
  Home,
  Calendar,
  Download,
  Eye,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { visitorService, Visitor } from "@/lib/services/visitor.service";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function VisitorHistoryPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  const loadVisitors = useCallback(async () => {
    if (!user?.supplier?.id) return;
    try {
      setLoading(true);
      const allVisitors = await visitorService.getBySupplier(user.supplier.id);

      // Process visitors and get their latest completed/archived appointment
      const visitorsWithCompletedAppointments = allVisitors
        .map((v) => {
          // Backend returns 'appointments' array, find the most recent checked out one (completed or archived)
          let latestCompletedAppointment = null;

          if (v.appointments && v.appointments.length > 0) {
            const completedAppointments = v.appointments.filter(
              (apt) =>
                apt.check_out_time &&
                apt.status === "checked_out"
            );

            if (completedAppointments.length > 0) {
              // Sort by check_out_time descending and get the most recent
              completedAppointments.sort((a, b) => {
                const dateA = new Date(a.check_out_time!).getTime();
                const dateB = new Date(b.check_out_time!).getTime();
                return dateB - dateA;
              });
              latestCompletedAppointment = completedAppointments[0];
            }
          }

          // Set appointment to the latest completed one for backward compatibility
          return {
            ...v,
            appointment: latestCompletedAppointment || undefined,
          };
        })
        .filter((v) => v.appointment !== null); // Only keep visitors with completed appointments

      // Sort by check_out_time (most recent first)
      visitorsWithCompletedAppointments.sort((a, b) => {
        if (!a.appointment?.check_out_time || !b.appointment?.check_out_time)
          return 0;
        const dateA = new Date(a.appointment.check_out_time).getTime();
        const dateB = new Date(b.appointment.check_out_time).getTime();
        return dateB - dateA;
      });

      setVisitors(visitorsWithCompletedAppointments);
    } catch (error) {
      console.error("Error al cargar visitantes:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      toast.error("Error al cargar el historial de visitantes", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }, [user?.supplier?.id]);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadVisitors();
    }
  }, [isAuthenticated, user, loadVisitors]);

  // Filtrar visitantes
  const filteredVisitors = useMemo(() => {
    if (!searchQuery) return visitors;

    const query = searchQuery.toLowerCase();
    return visitors.filter((visitor) => {
      const name = (visitor.name || "").toLowerCase();
      const email = (visitor.email || "").toLowerCase();
      const phone = (visitor.phone || "").toLowerCase();
      const location = (visitor.location || "").toLowerCase();

      return (
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        location.includes(query)
      );
    });
  }, [visitors, searchQuery]);

  // Formatear fecha y hora
  const formatDateTime = (dateString: string) => {
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
  };

  // Calcular duración de la visita
  const getVisitDuration = (checkIn: string, checkOut: string) => {
    const start = new Date(checkIn).getTime();
    const end = new Date(checkOut).getTime();
    const durationMs = end - start;

    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Exportar a CSV
  const exportToCSV = () => {
    const headers = ["Nombre", "Email", "Teléfono", "ID", "Check-in", "Check-out", "Duración", "Propósito"];
    const rows = filteredVisitors.map((v) => [
      v.name,
      v.email,
      v.phone,
      (v as { identification_number?: string }).identification_number || "",
      formatDateTime(v.appointment!.check_in_time).date + " " + formatDateTime(v.appointment!.check_in_time).time,
      formatDateTime(v.appointment!.check_out_time!).date + " " + formatDateTime(v.appointment!.check_out_time!).time,
      getVisitDuration(v.appointment!.check_in_time, v.appointment!.check_out_time!),
      v.appointment!.purpose || "-",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `visitantes_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();

    toast.success("Archivo CSV descargado exitosamente");
  };

  const handleViewDetails = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    setDetailsOpen(true);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="size-12 border-4 border-[#0386D9] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Cargando...</p>
        </div>
      </div>
    );
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
                <BreadcrumbPage>Visitantes</BreadcrumbPage>
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
                  <h2 className="text-xl font-bold text-white">Historial de Visitantes</h2>
                  <p className="text-sm text-slate-400">
                    Total de visitas completadas: {filteredVisitors.length}
                  </p>
                </div>
              </div>
              <Button
                onClick={exportToCSV}
                className="bg-[#0386D9] hover:bg-[#0270BE] text-black"
                disabled={filteredVisitors.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar CSV
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar por nombre, email, teléfono o ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-[#0386D9]"></div>
              </div>
            ) : filteredVisitors.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Users className="h-16 w-16 text-slate-600 mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {searchQuery
                    ? "No se encontraron visitantes"
                    : "No hay visitantes en el historial"}
                </h3>
                <p className="text-slate-400 mb-6">
                  {searchQuery
                    ? "Intenta con otros términos de búsqueda"
                    : "Los visitantes con check-out aparecerán aquí"}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="text-slate-400">Visitante</TableHead>
                    <TableHead className="text-slate-400">Contacto</TableHead>
                    <TableHead className="text-slate-400">Estado</TableHead>
                    <TableHead className="text-slate-400">Check-in</TableHead>
                    <TableHead className="text-slate-400">Check-out</TableHead>
                    <TableHead className="text-slate-400">Duración</TableHead>
                    <TableHead className="text-slate-400 text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVisitors.map((visitor) => {
                    if (!visitor.appointment?.check_in_time || !visitor.appointment?.check_out_time) {
                      return null;
                    }

                    const checkIn = formatDateTime(visitor.appointment.check_in_time);
                    const checkOut = formatDateTime(visitor.appointment.check_out_time);
                    const duration = getVisitDuration(
                      visitor.appointment.check_in_time,
                      visitor.appointment.check_out_time
                    );

                    return (
                      <TableRow key={visitor.id} className="border-white/10 hover:bg-white/5">
                        <TableCell className="min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10 shrink-0">
                              <AvatarImage src={visitor.profile_image_url} />
                              <AvatarFallback className="bg-[#0386D9] text-black font-semibold">
                                {visitor.name?.split(" ")[0]?.[0]?.toUpperCase() || "V"}
                                {visitor.name?.split(" ")[1]?.[0]?.toUpperCase() || ""}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-white font-medium truncate">
                                {visitor.name || "N/A"}
                              </p>
                              <p className="text-xs text-slate-400">
                                {visitor.location || "Visitante"}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Mail className="h-3 w-3 text-[#0386D9]" />
                              {visitor.email || "N/A"}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-300">
                              <Phone className="h-3 w-3 text-[#0386D9]" />
                              {visitor.phone || "N/A"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`${
                              visitor.state === "completado"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                            }`}
                          >
                            {visitor.state || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="text-white text-sm">{checkIn.date}</p>
                            <p className="text-slate-400 text-xs">{checkIn.time}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="text-white text-sm">{checkOut.date}</p>
                            <p className="text-slate-400 text-xs">{checkOut.time}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[#0386D9]/20 text-[#0386D9] border-[#0386D9]/30">
                            <Clock className="h-3 w-3 mr-1" />
                            {duration}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(visitor)}
                            className="text-slate-400 hover:text-white hover:bg-white/10"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </div>
        </motion.div>
      </div>

      {/* Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="bg-black/95 backdrop-blur-xl border border-white/10 text-white !max-w-[92vw] w-[92vw] max-h-[75vh] overflow-y-auto p-6">
          <DialogHeader className="border-b border-white/10 pb-4 mb-4">
            <DialogTitle className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-[#0386D9]/10 rounded-lg border border-[#0386D9]/30">
                <User className="h-5 w-5 text-[#0386D9]" />
              </div>
              Información Completa del Visitante
            </DialogTitle>
          </DialogHeader>
          {selectedVisitor && (
            <div className="space-y-4">
              {/* Header con Avatar y Info Principal */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden"
              >
                <div className="relative flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl">
                  <Avatar className="h-20 w-20 shrink-0 border-2 border-[#0386D9]/40">
                    <AvatarImage src={selectedVisitor.profile_image_url} className="object-cover" />
                    <AvatarFallback className="bg-gradient-to-br from-[#0386D9] to-[#05a7a7] text-black text-2xl font-bold">
                      {selectedVisitor.name?.split(" ")[0]?.[0]?.toUpperCase() || "V"}
                      {selectedVisitor.name?.split(" ")[1]?.[0]?.toUpperCase() || ""}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">
                        {selectedVisitor.name || "Sin nombre"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          className={`text-xs px-2 py-1 ${
                            selectedVisitor.state === "completado"
                              ? "bg-green-500/20 text-green-400 border-green-500/30"
                              : "bg-slate-500/20 text-slate-400 border-slate-500/30"
                          }`}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {selectedVisitor.state || "N/A"}
                        </Badge>
                        {selectedVisitor.appointment && (
                          <Badge className="bg-[#0386D9]/20 text-[#0386D9] border-[#0386D9]/30 text-xs px-2 py-1">
                            <Clock className="h-3 w-3 mr-1" />
                            {getVisitDuration(
                              selectedVisitor.appointment.check_in_time,
                              selectedVisitor.appointment.check_out_time!
                            )}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
                        <MapPin className="h-4 w-4 text-[#0386D9]" />
                        <div>
                          <p className="text-xs text-slate-400">Ubicación</p>
                          <p className="text-sm font-medium text-white">
                            {selectedVisitor.location || "Sin ubicación"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-black/30 rounded-lg">
                        <Calendar className="h-4 w-4 text-[#0386D9]" />
                        <div>
                          <p className="text-xs text-slate-400">Registrado</p>
                          <p className="text-sm font-medium text-white">
                            {formatDateTime(selectedVisitor.created_at).date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Layout de 2 columnas para Contacto y Visita */}
              <div className="grid grid-cols-2 gap-4">
                {/* Columna Izquierda: Información de Contacto */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-3"
                >
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Información de Contacto
                  </h4>

                  <div className="grid grid-cols-1 gap-2">
                  <div className="p-3 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="h-4 w-4 text-[#0386D9]" />
                      <p className="text-xs text-slate-400 font-semibold">Email</p>
                    </div>
                    <p className="text-white text-sm font-medium break-all">{selectedVisitor.email || "N/A"}</p>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Phone className="h-4 w-4 text-[#0386D9]" />
                      <p className="text-xs text-slate-400 font-semibold">Teléfono</p>
                    </div>
                    <p className="text-white text-sm font-medium">{selectedVisitor.phone || "N/A"}</p>
                  </div>

                  <div className="p-3 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-[#0386D9]" />
                      <p className="text-xs text-slate-400 font-semibold">ID del Sistema</p>
                    </div>
                    <p className="text-white text-xs font-mono break-all">{selectedVisitor.id}</p>
                  </div>
                </div>

                {/* Additional Info */}
                {selectedVisitor.additional_info && Object.keys(selectedVisitor.additional_info).length > 0 && (
                  <div className="p-3 bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Search className="h-3 w-3 text-purple-400" />
                      <p className="text-xs text-purple-400 font-semibold">Info Adicional</p>
                    </div>
                    <div className="grid grid-cols-1 gap-1">
                      {Object.entries(selectedVisitor.additional_info).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <span className="text-xs text-slate-400">{key}:</span>
                          <span className="text-xs text-white font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                </motion.div>

                {/* Columna Derecha: Información de la Visita */}
                {selectedVisitor.appointment && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-3"
                  >
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Detalles de la Visita
                    </h4>

                    {/* Check-in/Check-out Cards */}
                    <div className="grid grid-cols-2 gap-3">
                    <div className="relative overflow-hidden p-4 bg-gradient-to-br from-green-500/10 via-green-500/5 to-transparent border border-green-500/30 rounded-xl group hover:border-green-500/50 transition-all">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                      <div className="relative space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-green-500/20 rounded-lg">
                            <Calendar className="h-4 w-4 text-green-400" />
                          </div>
                          <div>
                            <p className="text-green-400 text-xs font-semibold uppercase">Entrada</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-white text-2xl font-bold">
                            {formatDateTime(selectedVisitor.appointment.check_in_time).time}
                          </p>
                          <p className="text-slate-300 text-sm">
                            {formatDateTime(selectedVisitor.appointment.check_in_time).date}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="relative overflow-hidden p-4 bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent border border-red-500/30 rounded-xl group hover:border-red-500/50 transition-all">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
                      <div className="relative space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-red-500/20 rounded-lg">
                            <Calendar className="h-4 w-4 text-red-400" />
                          </div>
                          <div>
                            <p className="text-red-400 text-xs font-semibold uppercase">Salida</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-white text-2xl font-bold">
                            {formatDateTime(selectedVisitor.appointment.check_out_time!).time}
                          </p>
                          <p className="text-slate-300 text-sm">
                            {formatDateTime(selectedVisitor.appointment.check_out_time!).date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  {(selectedVisitor.appointment as { description?: string }).description && (
                    <div className="p-3 bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Search className="h-3 w-3 text-blue-400" />
                        <p className="text-xs text-blue-400 font-semibold">Descripción</p>
                      </div>
                      <p className="text-white text-sm leading-relaxed">{(selectedVisitor.appointment as { description?: string }).description}</p>
                    </div>
                  )}

                  {selectedVisitor.appointment.host_employee && (
                    <div className="p-3 bg-gradient-to-br from-[#0386D9]/5 to-transparent border border-[#0386D9]/20 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-[#0386D9]" />
                        <div className="flex-1">
                          <p className="text-xs text-slate-400 font-semibold">Anfitrión</p>
                          <p className="text-white text-sm font-bold">
                            {selectedVisitor.appointment.host_employee?.first_name || ""}{" "}
                            {selectedVisitor.appointment.host_employee?.last_name || ""}
                          </p>
                          <p className="text-[#0386D9] text-xs">
                            {selectedVisitor.appointment.host_employee?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  </motion.div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
