"use client"

import { Bar, BarChart, CartesianGrid, Rectangle, XAxis } from "recharts"
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

// Datos simulados de estados de pedidos
const chartData = [
  { status: "Pendiente", count: 45, fill: "var(--color-pending)" },
  { status: "En Proceso", count: 32, fill: "var(--color-processing)" },
  { status: "En Camino", count: 28, fill: "var(--color-onway)" },
  { status: "Entregado", count: 87, fill: "var(--color-delivered)" },
  { status: "Cancelado", count: 12, fill: "var(--color-cancelled)" },
]

const chartConfig = {
  count: {
    label: "Pedidos",
  },
  pending: {
    label: "Pendiente",
    color: "hsl(var(--chart-1))",
  },
  processing: {
    label: "En Proceso",
    color: "hsl(var(--chart-2))",
  },
  onway: {
    label: "En Camino",
    color: "hsl(var(--chart-3))",
  },
  delivered: {
    label: "Entregado",
    color: "hsl(var(--chart-4))",
  },
  cancelled: {
    label: "Cancelado",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

export function BarChartActive() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estados de Pedidos</CardTitle>
        <CardDescription>Últimos 30 días</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="status"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              strokeWidth={2}
              radius={8}
              activeIndex={3} // Resaltar "Entregado"
              activeBar={({ ...props }) => (
                <Rectangle
                  {...props}
                  fillOpacity={0.8}
                  stroke={props.payload.fill}
                  strokeDasharray={4}
                  strokeDashoffset={4}
                />
              )}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}