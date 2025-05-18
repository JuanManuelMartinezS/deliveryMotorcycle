"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"

// Datos simulados de tipos de incidencias
const chartData = [
  { type: "Mantenimiento", count: 27, fill: "var(--color-maintenance)" },
  { type: "Accidente", count: 15, fill: "var(--color-accident)" },
  { type: "Técnica", count: 32, fill: "var(--color-technical)" },
  { type: "Otros", count: 8, fill: "var(--color-other)" },
]

const chartConfig = {
  count: {
    label: "Cantidad",
  },
  maintenance: {
    label: "Mantenimiento",
    color: "hsl(var(--chart-1))",
  },
  accident: {
    label: "Accidente",
    color: "hsl(var(--chart-2))",
  },
  technical: {
    label: "Técnica",
    color: "hsl(var(--chart-3))",
  },
  other: {
    label: "Otros",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

export function BarChartMixed() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tipos de Incidencias</CardTitle>
        <CardDescription>Enero - Junio 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="type"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}