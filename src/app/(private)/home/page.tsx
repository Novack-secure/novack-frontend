"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { motion } from "framer-motion";
import { SkeletonDashboard } from "@/components/ui/skeleton";

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

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
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl flex-1 p-3 overflow-auto"
        >
          <h3 className="text-lg font-bold text-white mb-3">
            Mapa de Ubicaciones
          </h3>
          <div className="flex items-center justify-center h-[calc(100%-2.5rem)] text-gray-400">
            Mapa en desarrollo
          </div>
        </motion.div>
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl w-80 p-3 overflow-auto"
        >
          <h3 className="text-lg font-bold text-white mb-3">Notificaciones</h3>
          <div className="space-y-3">
            <div className="text-gray-400 text-sm">
              No hay notificaciones nuevas
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
