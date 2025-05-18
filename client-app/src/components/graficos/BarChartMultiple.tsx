"use client"

import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis } from "recharts"
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

// Datos simulados del estado de las motocicletas
const chartData = [
  { month: "Enero", available: 15, unavailable: 5, maintenance: 3 },
  { month: "Febrero", available: 12, unavailable: 7, maintenance: 4 },
  { month: "Marzo", available: 18, unavailable: 2, maintenance: 3 },
  { month: "Abril", available: 14, unavailable: 4, maintenance: 5 },
  { month: "Mayo", available: 16, unavailable: 3, maintenance: 4 },
  { month: "Junio", available: 20, unavailable: 1, maintenance: 2 },
]

const chartConfig = {
  available: {
    label: "Disponible",
    color: "hsl(var(--chart-1))",
  },
  unavailable: {
    label: "No disponible",
    color: "hsl(var(--chart-2))",
  },
  maintenance: {
    label: "En mantenimiento",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

export function BarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de Motocicletas</CardTitle>
        <CardDescription>Enero - Junio 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <RechartsBarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="available" fill="var(--color-available)" radius={4} />
            <Bar dataKey="unavailable" fill="var(--color-unavailable)" radius={4} />
            <Bar dataKey="maintenance" fill="var(--color-maintenance)" radius={4} />
          </RechartsBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}