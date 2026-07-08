"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { Semaforo } from "@/server/modules/calculos/motor";

const COLOR_SEMAFORO: Record<Semaforo, string> = {
  verde: "#10b981",
  amarillo: "#f59e0b",
  rojo: "#ef4444",
};

const chartConfigIndice = {
  indiceDesempeno: { label: "Índice de Desempeño" },
} satisfies ChartConfig;

const chartConfigSemaforo = {
  verde: { label: "Verde", color: COLOR_SEMAFORO.verde },
  amarillo: { label: "Amarillo", color: COLOR_SEMAFORO.amarillo },
  rojo: { label: "Rojo", color: COLOR_SEMAFORO.rojo },
} satisfies ChartConfig;

export function IndiceDesempenoChart({
  data,
}: {
  data: { nombre: string; indiceDesempeno: number; semaforo: Semaforo | null }[];
}) {
  if (data.length === 0) {
    return <EmptyState />;
  }

  return (
    <ChartContainer config={chartConfigIndice} className="h-64 w-full">
      <BarChart data={data} margin={{ left: -20 }}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="nombre"
          tickLine={false}
          axisLine={false}
          tickFormatter={(value: string) =>
            value.length > 12 ? `${value.slice(0, 12)}…` : value
          }
        />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="indiceDesempeno" radius={4}>
          {data.map((entry) => (
            <Cell
              key={entry.nombre}
              fill={entry.semaforo ? COLOR_SEMAFORO[entry.semaforo] : "#a1a1aa"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function SemaforoDonutChart({
  data,
}: {
  data: { verde: number; amarillo: number; rojo: number };
}) {
  const chartData = [
    { name: "verde", value: data.verde, fill: COLOR_SEMAFORO.verde },
    { name: "amarillo", value: data.amarillo, fill: COLOR_SEMAFORO.amarillo },
    { name: "rojo", value: data.rojo, fill: COLOR_SEMAFORO.rojo },
  ];

  if (data.verde + data.amarillo + data.rojo === 0) {
    return <EmptyState />;
  }

  return (
    <ChartContainer config={chartConfigSemaforo} className="mx-auto h-64 aspect-square">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} strokeWidth={4} />
      </PieChart>
    </ChartContainer>
  );
}

function EmptyState() {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
      Sin datos suficientes para graficar.
    </div>
  );
}

export function ChartCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
