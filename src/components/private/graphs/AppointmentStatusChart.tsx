"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { AppointmentStatus } from "@/lib/services/dashboard.service";

interface AppointmentStatusChartProps {
  data: AppointmentStatus[];
}

const STATUS_COLORS: Record<string, string> = {
  pendiente: "#FCD34D",
  en_progreso: "#60A5FA",
  completado: "#34D399",
  cancelado: "#F87171",
};

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  en_progreso: "En Progreso",
  completado: "Completado",
  cancelado: "Cancelado",
};

export function AppointmentStatusChart({ data }: AppointmentStatusChartProps) {
  const chartData = data.map((item) => ({
    name: STATUS_LABELS[item.status] || item.status,
    value: item.count,
    percentage: item.percentage,
    fill: STATUS_COLORS[item.status] || "#94A3B8",
  }));

  const chartConfig = data.reduce((config, item) => {
    config[item.status] = {
      label: STATUS_LABELS[item.status] || item.status,
      color: STATUS_COLORS[item.status] || "#94A3B8",
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  // Verificar si hay datos
  const hasData = chartData.some((item) => item.value > 0);

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        {hasData ? (
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={90}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} stroke="rgba(0,0,0,0.1)" strokeWidth={2} />
            ))}
          </Pie>
        ) : (
          <Pie
            data={[{ name: "Sin datos", value: 1, fill: "#374151" }]}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={() => "Sin datos disponibles"}
            outerRadius={90}
            dataKey="value"
          >
            <Cell fill="#374151" />
          </Pie>
        )}
      </PieChart>
    </ChartContainer>
  );
}
