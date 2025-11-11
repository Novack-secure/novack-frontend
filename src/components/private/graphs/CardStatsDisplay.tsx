"use client";

import { CardStats } from "@/lib/services/dashboard.service";
import {
  Battery,
  CreditCard,
  Activity,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

interface CardStatsDisplayProps {
  stats: CardStats;
}

export function CardStatsDisplay({ stats }: CardStatsDisplayProps) {
  const cardData = [
    {
      title: "Total",
      value: stats.total,
      icon: CreditCard,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Activas",
      value: stats.active,
      icon: Activity,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Asignadas",
      value: stats.assigned,
      icon: UserCheck,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Disponibles",
      value: stats.available,
      icon: CheckCircle2,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      title: "Batería Prom.",
      value: `${stats.averageBattery}%`,
      icon: Battery,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
    },
    {
      title: "Crítica",
      value: stats.criticalBattery,
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      borderColor: "border-red-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 h-full content-start">
      {cardData.map((item, index) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className={`relative p-3 rounded-lg ${item.bgColor} border ${item.borderColor} hover:border-opacity-70 transition-all duration-300 group`}
        >
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                {item.title}
              </span>
              <item.icon className={`w-3.5 h-3.5 ${item.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </div>
            <div className={`text-xl font-bold ${item.color}`}>
              {item.value}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
