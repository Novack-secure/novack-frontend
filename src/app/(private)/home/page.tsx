"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import GlobalMap, { MapCard } from "@/components/private/map/globalMap";
import { useEffect, useState, useCallback } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home, Bell, Calendar, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { SkeletonDashboard } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  dashboardService,
  UpcomingAppointment,
} from "@/lib/services/dashboard.service";
import { cardService } from "@/lib/services/card.service";

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<UpcomingAppointment[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    UpcomingAppointment[]
  >([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [cards, setCards] = useState<MapCard[]>([]);
  const [loadingCards, setLoadingCards] = useState(true);
  const [timeFilter, setTimeFilter] = useState<"all" | "1h" | "24h" | "7d">(
    "all"
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const loadNotifications = useCallback(async () => {
    if (!user?.supplier?.id) return;
    try {
      setLoadingNotifications(true);
      const supplierId = user.supplier.id;
      const upcoming = await dashboardService.getUpcomingAppointments(
        50,
        supplierId
      );
      setNotifications(upcoming);
      setFilteredNotifications(upcoming);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [user?.supplier?.id]);

  const loadCards = useCallback(async () => {
    if (!user?.supplier?.id) {
      console.warn("No supplier ID found for user");
      setCards([]);
      return;
    }

    try {
      setLoadingCards(true);
      const supplierId = user.supplier.id;

      // Obtener solo tarjetas del supplier del usuario
      const supplierCards = await cardService.getBySupplier(supplierId);

      // Filtrar solo tarjetas con ubicación y convertir a números
      const cardsWithLocation: MapCard[] = supplierCards
        .filter((card) => card.latitude != null && card.longitude != null)
        .map((card) => {
          // Asegurar que las coordenadas son números
          const lat =
            typeof card.latitude === "string"
              ? parseFloat(card.latitude)
              : card.latitude;
          const lng =
            typeof card.longitude === "string"
              ? parseFloat(card.longitude)
              : card.longitude;

          return {
            id: card.id,
            card_number: card.card_number,
            latitude: lat!,
            longitude: lng!,
            assigned_to: card.assigned_to,
            is_active: card.is_active,
          };
        })
        .filter((card) => !isNaN(card.latitude) && !isNaN(card.longitude)); // Filtrar coordenadas inválidas

      setCards(cardsWithLocation);
    } catch (error) {
      console.error("Error loading cards:", error);
    } finally {
      setLoadingCards(false);
    }
  }, [user?.supplier?.id]);

  useEffect(() => {
    if (user) {
      loadNotifications();
      loadCards();
    }
  }, [user, loadNotifications, loadCards]);

  // Filtrar notificaciones por tiempo
  useEffect(() => {
    if (!notifications.length) return;

    const now = new Date();
    let filtered = notifications;

    switch (timeFilter) {
      case "1h":
        filtered = notifications.filter((notif) => {
          const diff = new Date(notif.scheduledTime).getTime() - now.getTime();
          return diff <= 60 * 60 * 1000; // 1 hora
        });
        break;
      case "24h":
        filtered = notifications.filter((notif) => {
          const diff = new Date(notif.scheduledTime).getTime() - now.getTime();
          return diff <= 24 * 60 * 60 * 1000; // 24 horas
        });
        break;
      case "7d":
        filtered = notifications.filter((notif) => {
          const diff = new Date(notif.scheduledTime).getTime() - now.getTime();
          return diff <= 7 * 24 * 60 * 60 * 1000; // 7 días
        });
        break;
      default:
        filtered = notifications;
    }

    setFilteredNotifications(filtered);
  }, [timeFilter, notifications]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();

    // Si la fecha es inválida o es del pasado
    if (isNaN(diffMs) || diffMs < 0) {
      return "Vencida";
    }

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Ahora";
    if (diffMins < 60) return `En ${diffMins} min`;
    if (diffHours < 24) return `En ${diffHours}h`;
    if (diffDays === 1) return "Mañana";
    return `En ${diffDays} días`;
  };

  if (isLoading) {
    return <SkeletonDashboard />;
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="flex flex-col h-full p-3 pl-2 overflow-auto">
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
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex gap-3 min-h-0">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex-1 p-3 overflow-hidden flex flex-col"
        >
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0386D9]" />
            Mapa de Ubicaciones
            {!loadingCards && cards.length > 0 && (
              <Badge
                variant="secondary"
                className="ml-auto bg-[#0386D9]/10 text-[#0386D9] border-[#0386D9]/20"
              >
                {cards.length} tarjeta{cards.length !== 1 ? "s" : ""}
              </Badge>
            )}
          </h3>
          <div className="flex-1 min-h-0">
            {loadingCards ? (
              <div className="w-full h-full bg-slate-900/50 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-[#0386D9] mx-auto mb-3"></div>
                  <p className="text-sm text-slate-300">Cargando tarjetas...</p>
                </div>
              </div>
            ) : (
              <GlobalMap cards={cards} />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl w-96 p-3 overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#0386D9]" />
              <h3 className="text-lg font-bold text-white">Notificaciones</h3>
              {filteredNotifications.length > 0 && (
                <Badge variant="destructive">
                  {filteredNotifications.length}
                </Badge>
              )}
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 mb-3 flex-wrap">
            <button
              onClick={() => setTimeFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                timeFilter === "all"
                  ? "bg-[#0386D9] text-slate-900"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setTimeFilter("1h")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                timeFilter === "1h"
                  ? "bg-[#0386D9] text-slate-900"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              1 hora
            </button>
            <button
              onClick={() => setTimeFilter("24h")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                timeFilter === "24h"
                  ? "bg-[#0386D9] text-slate-900"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              24 horas
            </button>
            <button
              onClick={() => setTimeFilter("7d")}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                timeFilter === "7d"
                  ? "bg-[#0386D9] text-slate-900"
                  : "bg-white/5 text-slate-400 hover:bg-white/10"
              }`}
            >
              7 días
            </button>
          </div>

          <div className="space-y-2 flex-1 overflow-auto">
            {loadingNotifications ? (
              <div className="text-gray-400 text-sm text-center py-8">
                Cargando notificaciones...
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="w-12 h-12 text-gray-500 mx-auto mb-3 opacity-50" />
                <p className="text-gray-400 text-sm">
                  No hay notificaciones en este rango
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
                  onClick={() => router.push("/appointment")}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#0386D9]/10 flex items-center justify-center shrink">
                      <Calendar className="w-5 h-5 text-[#0386D9]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-white truncate">
                          {notif.visitorName}
                        </p>
                        <Badge
                          variant="outline"
                          className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        >
                          Próxima
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-400 mb-2 line-clamp-2">
                        {notif.purpose}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(notif.scheduledTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
