import type { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function KpiCard({
  label,
  value,
  hint,
  action,
}: {
  label: string;
  value: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <CardDescription>{label}</CardDescription>
        {action}
      </CardHeader>
      <CardContent className="space-y-1">
        <CardTitle className="text-2xl font-semibold">{value}</CardTitle>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
