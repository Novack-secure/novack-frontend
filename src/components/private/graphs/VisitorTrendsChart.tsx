"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { VisitorTrend } from "@/lib/services/dashboard.service";

interface VisitorTrendsChartProps {
  data: VisitorTrend[];
}

const chartConfig = {
  checkIns: {
    label: "Check-ins",
    color: "#0386D9",
  },
  checkOuts: {
    label: "Check-outs",
    color: "#F59E0B",
  },
  activeVisitors: {
    label: "Activos",
    color: "#34D399",
  },
};

export function VisitorTrendsChart({ data }: VisitorTrendsChartProps) {
  // Formatear las fechas para mostrar solo el día
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
    }),
  }));

  // Verificar si todos los valores son 0
  const hasData = formattedData.some(
    (item) => item.checkIns > 0 || item.checkOuts > 0 || item.activeVisitors > 0
  );

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <CartesianGrid strokeDasharray="3 3" className="stroke-white/10" />
        <XAxis
          dataKey="date"
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
        <Line
          type="monotone"
          dataKey="checkIns"
          stroke="var(--color-checkIns)"
          strokeWidth={2}
          dot={{ fill: "var(--color-checkIns)", r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="checkOuts"
          stroke="var(--color-checkOuts)"
          strokeWidth={2}
          dot={{ fill: "var(--color-checkOuts)", r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="activeVisitors"
          stroke="var(--color-activeVisitors)"
          strokeWidth={2}
          dot={{ fill: "var(--color-activeVisitors)", r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
