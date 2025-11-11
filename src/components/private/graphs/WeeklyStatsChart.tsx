"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { WeeklyStats } from "@/lib/services/dashboard.service";

interface WeeklyStatsChartProps {
  data: WeeklyStats[];
}

const chartConfig = {
  visitors: {
    label: "Visitantes",
    color: "#0386D9",
  },
  appointments: {
    label: "Citas",
    color: "#60A5FA",
  },
  completedVisits: {
    label: "Completadas",
    color: "#34D399",
  },
};

export function WeeklyStatsChart({ data }: WeeklyStatsChartProps) {
  // Verificar si todos los valores son 0
  const hasData = data.some(
    (item) => item.visitors > 0 || item.appointments > 0 || item.completedVisits > 0
  );

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-white/10" />
        <XAxis
          dataKey="day"
          tick={{ fill: "#E5E7EB", fontSize: 12 }}
          axisLine={{ stroke: "#4B5563" }}
          tickLine={{ stroke: "#4B5563" }}
        />
        <YAxis
          tick={{ fill: "#E5E7EB", fontSize: 12 }}
          axisLine={{ stroke: "#4B5563" }}
          tickLine={{ stroke: "#4B5563" }}
          domain={hasData ? [0, 'auto'] : [0, 10]}
          allowDataOverflow={false}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar
          dataKey="visitors"
          fill="var(--color-visitors)"
          radius={[8, 8, 0, 0]}
        />
        <Bar
          dataKey="appointments"
          fill="var(--color-appointments)"
          radius={[8, 8, 0, 0]}
        />
        <Bar
          dataKey="completedVisits"
          fill="var(--color-completedVisits)"
          radius={[8, 8, 0, 0]}
        />
      </BarChart>
    </ChartContainer>
  );
}
