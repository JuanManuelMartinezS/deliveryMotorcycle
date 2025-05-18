"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"

// Datos simulados de estados de incidencias
const openData = [
  { status: "open", count: 12, fill: "var(--color-open)" },
  { status: "in_progress", count: 8, fill: "var(--color-inprogress)" },
  { status: "resolved", count: 25, fill: "var(--color-resolved)" },
  { status: "closed", count: 15, fill: "var(--color-closed)" },
]

const lastMonthData = [
  { status: "open", count: 18, fill: "var(--color-open)" },
  { status: "in_progress", count: 12, fill: "var(--color-inprogress)" },
  { status: "resolved", count: 20, fill: "var(--color-resolved)" },
  { status: "closed", count: 10, fill: "var(--color-closed)" },
]

const chartConfig = {
  count: {
    label: "Incidencias",
  },
  open: {
    label: "Abiertas",
    color: "hsl(var(--chart-1))",
  },
  in_progress: {
    label: "En progreso",
    color: "hsl(var(--chart-2))",
  },
  resolved: {
    label: "Resueltas",
    color: "hsl(var(--chart-3))",
  },
  closed: {
    label: "Cerradas",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function PieChartStacked() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Estados de Incidencias</CardTitle>
        <CardDescription>Últimos 30 días vs mes anterior</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelKey="count"
                  nameKey="status"
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    return chartConfig[
                      payload?.[0].dataKey as keyof typeof chartConfig
                    ].label
                  }}
                />
              }
            />
            <Pie data={openData} dataKey="count" outerRadius={60} />
            <Pie
              data={lastMonthData}
              dataKey="count"
              innerRadius={70}
              outerRadius={90}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Anillo interno: mes anterior | Anillo externo: últimos 30 días
        </div>
      </CardFooter>
    </Card>
  )
}