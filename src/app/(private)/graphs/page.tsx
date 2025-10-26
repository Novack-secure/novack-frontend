"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
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
  Battery,
  Users,
  MapPin,
  AlertTriangle,
  History,
  Activity,
  Zap,
  Home,
  ChartArea,
} from "lucide-react";
import { motion } from "framer-motion";

export default function MetricsDashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

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

  const batteryCards = [
    { id: 1, percentage: 75, status: "active" },
    { id: 2, percentage: 10, status: "low" },
    { id: 3, percentage: 45, status: "active" },
    { id: 4, percentage: 0, status: "disconnected" },
  ];

  const metrics = [
    {
      category: "Cards",
      items: [
        {
          title: "Active Cards",
          value: "24",
          icon: Activity,
          color: "text-green-400",
        },
        {
          title: "Battery Percentage",
          value: "62%",
          icon: Battery,
          color: "text-yellow-400",
        },
        {
          title: "Disconnected Cards",
          value: "3",
          icon: Zap,
          color: "text-red-400",
        },
      ],
    },
    {
      category: "Zones",
      items: [
        {
          title: "Most transitted zones",
          value: "Zone B",
          icon: MapPin,
          color: "text-blue-400",
        },
        {
          title: "People per zone",
          value: "48",
          icon: Users,
          color: "text-purple-400",
        },
      ],
    },
    {
      category: "Events",
      items: [
        {
          title: "Alerts for active cards",
          value: "12",
          icon: AlertTriangle,
          color: "text-orange-400",
        },
        {
          title: "Number of events",
          value: "156",
          icon: Activity,
          color: "text-cyan-400",
        },
      ],
    },
    {
      category: "History",
      items: [
        {
          title: "Movement history",
          value: "1.2K",
          icon: History,
          color: "text-indigo-400",
        },
        {
          title: "Day comparison",
          value: "+15%",
          icon: Activity,
          color: "text-green-400",
        },
      ],
    },
  ];

  const getBatteryColor = (percentage: number) => {
    if (percentage >= 50) return "text-green-400";
    if (percentage >= 20) return "text-yellow-400";
    return "text-red-400";
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 50) return "bg-green-400";
    if (percentage >= 20) return "bg-yellow-400";
    return "bg-red-400";
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
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/home">
                <Home className="h-4 w-4" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Métricas</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="space-y-8">
          {/* Battery Cards Section */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {batteryCards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-md hover:border-[#07D9D9]/20 transition-all duration-300">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm font-medium">
                        <span className="text-gray-400">Card #{card.id}</span>
                        <Battery
                          className={`w-5 h-5 ${getBatteryColor(
                            card.percentage
                          )}`}
                        />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center">
                        <div
                          className={`text-3xl font-bold mb-3 ${getBatteryColor(
                            card.percentage
                          )}`}
                        >
                          {card.percentage}%
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {card.status}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Metrics Grid */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Estadísticas del Sistema
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              {metrics.map((metricGroup, groupIndex) => (
                <motion.div
                  key={metricGroup.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + groupIndex * 0.1 }}
                >
                  <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-md h-full">
                    <CardHeader>
                      <CardTitle className="text-lg font-semibold text-[#07D9D9]">
                        {metricGroup.category}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {metricGroup.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 group cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#07D9D9]/20 transition-colors duration-200">
                              <item.icon className={`w-4 h-4 ${item.color}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-white group-hover:text-[#07D9D9] transition-colors">
                                {item.title}
                              </p>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-white">
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Additional Stats */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-green-500/20 border border-green-500/30">
                  <Activity className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Sistema Activo
                  </h3>
                  <p className="text-2xl font-bold text-green-400">98%</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Usuarios Activos
                  </h3>
                  <p className="text-2xl font-bold text-blue-400">156</p>
                </div>
              </div>
            </Card>

            <Card className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-md p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
                  <MapPin className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Zonas Monitoreadas
                  </h3>
                  <p className="text-2xl font-bold text-purple-400">24</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
