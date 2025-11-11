"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import {
  dashboardService,
  DashboardStats,
  UpcomingAppointment,
  RecentActivity,
} from "@/lib/services/dashboard.service";
import {
  Users,
  UserCheck,
  Calendar,
  MessageSquare,
  CreditCard,
  MessagesSquare,
  CheckCircle2,
  Clock,
  MapPin,
  UserPlus,
  CalendarDays,
  Shield,
  Activity,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState<
    UpcomingAppointment[]
  >([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = useCallback(async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);

      const supplierId = user.supplier?.id;

      const [statsData, appointmentsData, activityData] = await Promise.all([
        dashboardService.getStats(supplierId),
        dashboardService.getUpcomingAppointments(5, supplierId),
        dashboardService.getRecentActivity(10, supplierId),
      ]);

      setStats(statsData);
      setUpcomingAppointments(appointmentsData);
      setRecentActivity(activityData);
    } catch (err) {
      type ErrorWithMessage = {
        message?: string;
      };
      const e = err as ErrorWithMessage;
      console.error("Error loading dashboard:", err);
      setError(e.message || "Error al cargar datos del dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
    // Refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, [loadDashboardData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    if (diffMins < 1) return "Ahora mismo";
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHours < 24) return `Hace ${diffHours} h`;
    return formatDate(dateString);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendiente":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "en_progreso":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "completado":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "cancelado":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#010440] p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-500/10 border-red-500/20">
            <CardContent className="p-6">
              <p className="text-red-500">Error: {error}</p>
              <Button onClick={loadDashboardData} className="mt-4">
                Reintentar
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010440] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Bienvenido, {user?.first_name} {user?.last_name}
            </p>
          </div>
          <Button
            onClick={loadDashboardData}
            variant="outline"
            className="border-white/10 text-gray-400 hover:text-white hover:bg-white/5"
          >
            <Activity className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Employees */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Total Empleados</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-2 bg-white/10" />
                  ) : (
                    <p className="text-3xl font-bold text-white mt-1">
                      {stats?.totalEmployees || 0}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 rounded-full bg-[#0386D9]/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#0386D9]" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Visitors Today */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Visitantes Activos</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-2 bg-white/10" />
                  ) : (
                    <p className="text-3xl font-bold text-white mt-1">
                      {stats?.activeVisitorsToday || 0}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Appointments */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Citas Pendientes</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-2 bg-white/10" />
                  ) : (
                    <p className="text-3xl font-bold text-white mt-1">
                      {stats?.pendingAppointments || 0}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Unread Messages */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Mensajes Sin Leer</p>
                  {isLoading ? (
                    <Skeleton className="h-8 w-16 mt-2 bg-white/10" />
                  ) : (
                    <p className="text-3xl font-bold text-white mt-1">
                      {stats?.unreadMessages || 0}
                    </p>
                  )}
                </div>
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Upcoming Appointments */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-[#0386D9]" />
                    Próximas Citas
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/appointment")}
                    className="text-[#0386D9] hover:text-[#0270BE] hover:bg-white/5"
                  >
                    Ver todas
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} className="h-20 bg-white/10" />
                    ))}
                  </div>
                ) : upcomingAppointments.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No hay citas próximas</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingAppointments.map((apt) => {
                      const handleClick = () => {
                        router.push("/appointment");
                      };
                      const handleKeyDown = (e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          router.push("/appointment");
                        }
                      };
                      return (
                        <div
                          key={apt.id}
                          className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                          onClick={handleClick}
                          onKeyDown={handleKeyDown}
                          role="button"
                          tabIndex={0}
                        >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-white">
                                {apt.visitorName}
                              </h3>
                              <Badge
                                variant="outline"
                                className={getStatusColor(apt.status)}
                              >
                                {apt.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 mb-2">
                              {apt.purpose}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {formatDate(apt.scheduledTime)}
                              </span>
                              {apt.location && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {apt.location}
                                </span>
                              )}
                              {apt.hostEmployee && (
                                <span className="flex items-center gap-1">
                                  <Users className="w-3 h-3" />
                                  {apt.hostEmployee.first_name}{" "}
                                  {apt.hostEmployee.last_name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#0386D9]" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-16 bg-white/10" />
                    ))}
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                    <p className="text-gray-400">No hay actividad reciente</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {recentActivity.map((activity) => (
                      <div
                        key={activity.id}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm text-white">
                              <span className="font-semibold">
                                {activity.visitorName}
                              </span>{" "}
                              <span className="text-gray-400">
                                {activity.action}
                              </span>
                            </p>
                            {activity.location && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {activity.location}
                              </p>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {getRelativeTime(activity.time)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Quick Actions & System Status */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  Acciones Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => router.push("/visitor")}
                  className="w-full bg-[#0386D9] hover:bg-[#0270BE] text-[#010440] justify-start"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Registrar Visitante
                </Button>
                <Button
                  onClick={() => router.push("/appointment")}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 justify-start"
                >
                  <CalendarDays className="w-4 h-4 mr-2" />
                  Ver Citas
                </Button>
                <Button
                  onClick={() => router.push("/card")}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 justify-start"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Gestionar Tarjetas
                </Button>
                <Button
                  onClick={() => router.push("/chat")}
                  variant="outline"
                  className="w-full border-white/10 text-white hover:bg-white/5 justify-start"
                >
                  <MessagesSquare className="w-4 h-4 mr-2" />
                  Abrir Chat
                </Button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#0386D9]" />
                  Estado del Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading ? (
                  <>
                    <Skeleton className="h-12 bg-white/10" />
                    <Skeleton className="h-12 bg-white/10" />
                    <Skeleton className="h-12 bg-white/10" />
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-[#0386D9]" />
                        <span className="text-sm text-gray-400">
                          Tarjetas Disponibles
                        </span>
                      </div>
                      <span className="text-lg font-bold text-white">
                        {stats?.availableCards || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2">
                        <MessagesSquare className="w-4 h-4 text-[#0386D9]" />
                        <span className="text-sm text-gray-400">
                          Salas de Chat Activas
                        </span>
                      </div>
                      <span className="text-lg font-bold text-white">
                        {stats?.activeChatRooms || 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0386D9]" />
                        <span className="text-sm text-gray-400">
                          Visitas Completadas Hoy
                        </span>
                      </div>
                      <span className="text-lg font-bold text-white">
                        {stats?.completedAppointmentsToday || 0}
                      </span>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
