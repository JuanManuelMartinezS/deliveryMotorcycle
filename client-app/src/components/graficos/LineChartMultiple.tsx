"use client"

import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
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

// Datos simulados de clientes
const chartData = [
  { month: "Enero", new: 45, returning: 32 },
  { month: "Febrero", new: 52, returning: 38 },
  { month: "Marzo", new: 38, returning: 42 },
  { month: "Abril", new: 67, returning: 55 },
  { month: "Mayo", new: 72, returning: 60 },
  { month: "Junio", new: 58, returning: 65 },
]

const chartConfig = {
  new: {
    label: "Nuevos",
    color: "hsl(var(--chart-1))",
  },
  returning: {
    label: "Recurrentes",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function LineChartMultiple() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clientes Nuevos vs Recurrentes</CardTitle>
        <CardDescription>Enero - Junio 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="new"
              type="monotone"
              stroke="var(--color-new)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="returning"
              type="monotone"
              stroke="var(--color-returning)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}