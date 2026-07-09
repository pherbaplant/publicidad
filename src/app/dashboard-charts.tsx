"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
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
  const total = data.verde + data.amarillo + data.rojo;

  if (total === 0) {
    return <EmptyState />;
  }

  const chartData = [{ nombre: "Campañas", ...data }];

  return (
    <div className="flex flex-col gap-4">
      <ChartContainer config={chartConfigSemaforo} className="h-16 w-full">
        <BarChart data={chartData} layout="vertical" barSize={40}>
          <XAxis type="number" hide domain={[0, total]} />
          <YAxis type="category" dataKey="nombre" hide />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="verde" stackId="a" fill={COLOR_SEMAFORO.verde} radius={[6, 0, 0, 6]} />
          <Bar dataKey="amarillo" stackId="a" fill={COLOR_SEMAFORO.amarillo} />
          <Bar dataKey="rojo" stackId="a" fill={COLOR_SEMAFORO.rojo} radius={[0, 6, 6, 0]} />
        </BarChart>
      </ChartContainer>
      <div className="flex justify-center gap-6 text-sm">
        <LeyendaSemaforo color={COLOR_SEMAFORO.verde} label="Verde" valor={data.verde} />
        <LeyendaSemaforo color={COLOR_SEMAFORO.amarillo} label="Amarillo" valor={data.amarillo} />
        <LeyendaSemaforo color={COLOR_SEMAFORO.rojo} label="Rojo" valor={data.rojo} />
      </div>
    </div>
  );
}

function LeyendaSemaforo({
  color,
  label,
  valor,
}: {
  color: string;
  label: string;
  valor: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-muted-foreground">
        {label} · {valor}
      </span>
    </div>
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
