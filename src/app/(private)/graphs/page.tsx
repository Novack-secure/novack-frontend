"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  Home,
  BarChart3,
  TrendingUp,
  CreditCard,
  PieChart,
  Calendar,
  Clock,
  GripVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  dashboardService,
  WeeklyStats,
  CardStats,
  VisitorTrend,
  AppointmentStatus,
  MonthlyTrend,
  HourlyActivity,
} from "@/lib/services/dashboard.service";
import { WeeklyStatsChart } from "@/components/private/graphs/WeeklyStatsChart";
import { VisitorTrendsChart } from "@/components/private/graphs/VisitorTrendsChart";
import { CardStatsDisplay } from "@/components/private/graphs/CardStatsDisplay";
import { AppointmentStatusChart } from "@/components/private/graphs/AppointmentStatusChart";
import { MonthlyTrendsChart } from "@/components/private/graphs/MonthlyTrendsChart";
import { HourlyActivityChart } from "@/components/private/graphs/HourlyActivityChart";
import { createSwapy } from "swapy";
import type { SlotItemMap } from "swapy";
import {
  userPreferenceService,
  PreferenceType,
} from "@/lib/services/user-preference.service";

const DEFAULT_LAYOUT = {
  "slot-1": "weekly-stats",
  "slot-2": "visitor-trends",
  "slot-3": "monthly-trends",
  "slot-4": "card-stats",
  "slot-5": "appointment-status",
  "slot-6": "hourly-activity",
};

const CHART_CONFIG = {
  "weekly-stats": {
    title: "Estadísticas Semanales",
    description: "Actividad de visitantes de los últimos 7 días",
    icon: BarChart3,
  },
  "visitor-trends": {
    title: "Tendencias de Visitantes",
    description: "Check-ins y check-outs por día",
    icon: TrendingUp,
  },
  "card-stats": {
    title: "Estado de Tarjetas",
    description: "Resumen de tarjetas activas y batería",
    icon: CreditCard,
  },
  "appointment-status": {
    title: "Estado de Citas",
    description: "Distribución por estado",
    icon: PieChart,
  },
  "monthly-trends": {
    title: "Tendencias Mensuales",
    description: "Actividad de los últimos 6 meses",
    icon: Calendar,
  },
  "hourly-activity": {
    title: "Actividad por Hora",
    description: "Picos de actividad del día",
    icon: Clock,
  },
};

export default function GraphsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [cardStats, setCardStats] = useState<CardStats | null>(null);
  const [visitorTrends, setVisitorTrends] = useState<VisitorTrend[]>([]);
  const [appointmentStatus, setAppointmentStatus] = useState<
    AppointmentStatus[]
  >([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);
  const [hourlyActivity, setHourlyActivity] = useState<HourlyActivity[]>([]);
  const [loadingWeekly, setLoadingWeekly] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingTrends, setLoadingTrends] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [loadingMonthly, setLoadingMonthly] = useState(true);
  const [loadingHourly, setLoadingHourly] = useState(true);
  const [slotItems, setSlotItems] = useState<SlotItemMap>(
    DEFAULT_LAYOUT as unknown as SlotItemMap
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const swapyRef = useRef<ReturnType<typeof createSwapy> | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Cargar layout guardado
  useEffect(() => {
    if (!user) return;

    userPreferenceService
      .getGraphsLayout()
      .then((savedLayout) => {
        if (savedLayout && savedLayout.slotItems) {
          setSlotItems(savedLayout.slotItems as unknown as SlotItemMap);
        }
      })
      .catch((error) => {
        if (error.message !== "Error loading saved layout:") {
          console.error("Error loading layout:", error);
        }
      });
  }, [user]);

  // Cargar datos
  useEffect(() => {
    if (!user?.supplier?.id) return;

    const supplierId = user.supplier.id;

    // Cargar estadísticas semanales
    setLoadingWeekly(true);
    dashboardService
      .getWeeklyStats(supplierId)
      .then(setWeeklyStats)
      .catch(() => setWeeklyStats([]))
      .finally(() => setLoadingWeekly(false));

    // Cargar estadísticas de tarjetas
    setLoadingCards(true);
    dashboardService
      .getCardStats(supplierId)
      .then(setCardStats)
      .catch(() => setCardStats(null))
      .finally(() => setLoadingCards(false));

    // Cargar tendencias de visitantes
    setLoadingTrends(true);
    dashboardService
      .getVisitorTrends(7, supplierId)
      .then(setVisitorTrends)
      .catch(() => setVisitorTrends([]))
      .finally(() => setLoadingTrends(false));

    // Cargar estado de citas
    setLoadingStatus(true);
    dashboardService
      .getAppointmentStatusBreakdown(supplierId)
      .then(setAppointmentStatus)
      .catch(() => setAppointmentStatus([]))
      .finally(() => setLoadingStatus(false));

    // Cargar tendencias mensuales
    setLoadingMonthly(true);
    dashboardService
      .getMonthlyTrends(6, supplierId)
      .then(setMonthlyTrends)
      .catch(() => setMonthlyTrends([]))
      .finally(() => setLoadingMonthly(false));

    // Cargar actividad por hora
    setLoadingHourly(true);
    dashboardService
      .getHourlyActivity(supplierId)
      .then(setHourlyActivity)
      .catch(() => setHourlyActivity([]))
      .finally(() => setLoadingHourly(false));
  }, [user?.supplier?.id]);

  // Inicializar Swapy
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      const swapy = createSwapy(containerRef.current, {
        animation: "spring",
        swapMode: "hover",
      });

      swapy.onSwap((event) => {
        try {
          if (!event) return;

          // El evento contiene el SlotItemMap, necesitamos hacer una conversión segura
          const newSlotItems = event as unknown as SlotItemMap;
          setSlotItems(newSlotItems);

          // Guardar layout en el backend
          userPreferenceService
            .create(PreferenceType.GRAPHS_LAYOUT, {
              slotItems: newSlotItems,
            })
            .catch(() => {});
        } catch {
          // Silently ignore swap errors
        }
      });

      swapyRef.current = swapy;

      return () => {
        try {
          swapy.destroy();
        } catch {
          // Ignore cleanup errors
        }
      };
    } catch {
      // Ignore initialization errors
    }
  }, []);

  // Actualizar Swapy cuando cambie el layout
  useEffect(() => {
    if (swapyRef.current) {
      swapyRef.current.update();
    }
  }, [slotItems]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-white text-lg">Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  // Función helper para obtener el itemId de un slot de forma segura
  const getSlotItemId = (slotId: string): string | undefined => {
    if (!slotItems) return undefined;

    // Si slotItems tiene asObject (es un SlotItemMap real), usarlo
    if (slotItems.asObject && typeof slotItems.asObject === "object") {
      return slotItems.asObject[slotId];
    }

    // Si slotItems es un objeto plano (como DEFAULT_LAYOUT), acceder directamente
    if (typeof slotItems === "object" && slotItems !== null) {
      const items = slotItems as unknown as Record<string, string>;
      return items[slotId];
    }

    return undefined;
  };

  const renderChart = (itemId: string) => {
    const config = CHART_CONFIG[itemId as keyof typeof CHART_CONFIG];
    if (!config) return null;

    const Icon = config.icon;

    const renderContent = () => {
      switch (itemId) {
        case "weekly-stats":
          if (loadingWeekly) return <LoadingSpinner />;
          if (weeklyStats.length === 0) return <EmptyState />;
          return <WeeklyStatsChart data={weeklyStats} />;

        case "visitor-trends":
          if (loadingTrends) return <LoadingSpinner />;
          if (visitorTrends.length === 0) return <EmptyState />;
          return <VisitorTrendsChart data={visitorTrends} />;

        case "card-stats":
          if (loadingCards) return <LoadingSpinner />;
          if (!cardStats) return <EmptyState />;
          return <CardStatsDisplay stats={cardStats} />;

        case "appointment-status":
          if (loadingStatus) return <LoadingSpinner />;
          if (appointmentStatus.length === 0) return <EmptyState />;
          return <AppointmentStatusChart data={appointmentStatus} />;

        case "monthly-trends":
          if (loadingMonthly) return <LoadingSpinner />;
          if (monthlyTrends.length === 0) return <EmptyState />;
          return <MonthlyTrendsChart data={monthlyTrends} />;

        case "hourly-activity":
          if (loadingHourly) return <LoadingSpinner />;
          if (hourlyActivity.length === 0) return <EmptyState />;
          return <HourlyActivityChart data={hourlyActivity} />;

        default:
          return <EmptyState />;
      }
    };

    return (
      <Card
        className="bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#0386D9]/40 transition-all duration-500 shadow-lg hover:shadow-[#0386D9]/20 hover:bg-white/[0.07]"
        data-swapy-item={itemId}
      >
        <CardHeader className="pb-3 space-y-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#0386D9]/10 border border-[#0386D9]/20">
                <Icon className="w-4 h-4 text-[#0386D9]" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold text-white">
                  {config.title}
                </CardTitle>
                <CardDescription className="text-[10px] text-gray-400 mt-0.5">
                  {config.description}
                </CardDescription>
              </div>
            </div>
            <GripVertical className="w-5 h-5 text-gray-500 cursor-grab active:cursor-grabbing hover:text-[#0386D9] transition-colors" />
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="h-[300px]">{renderContent()}</div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col h-full p-3 pl-2 overflow-hidden">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-3"
      >
        <Breadcrumb>
          <BreadcrumbList className="text-white">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/home"
                className="text-white hover:text-[#0386D9]"
              >
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="text-white" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white">
                Gráficas y Estadísticas
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Main Content with Swapy */}
      <main className="flex-1 overflow-auto">
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-4"
        >
          {["slot-1", "slot-2", "slot-3", "slot-4", "slot-5", "slot-6"].map(
            (slotId, index) => (
              <motion.div
                key={slotId}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.1 + index * 0.05,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                data-swapy-slot={slotId}
                className="will-change-transform"
              >
                {(() => {
                  const itemId = getSlotItemId(slotId);
                  return itemId ? renderChart(itemId) : null;
                })()}
              </motion.div>
            )
          )}
        </div>
      </main>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-700 border-t-[#0386D9]"></div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="text-gray-400 text-sm">No hay datos disponibles</div>
      </div>
    </div>
  );
}
