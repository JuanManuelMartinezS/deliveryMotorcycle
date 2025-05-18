"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

// Datos simulados de ingresos mensuales
const chartData = [
  { month: "2024-01", revenue: 12500, expenses: 8500 },
  { month: "2024-02", revenue: 14300, expenses: 9200 },
  { month: "2024-03", revenue: 11800, expenses: 7800 },
  { month: "2024-04", revenue: 15600, expenses: 10500 },
  { month: "2024-05", revenue: 17200, expenses: 11500 },
  { month: "2024-06", revenue: 16500, expenses: 10800 },
]

const chartConfig = {
  revenue: {
    label: "Ingresos",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Gastos",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function AreaChartInteractive() {
  const [timeRange, setTimeRange] = React.useState("6m")

  const filteredData = chartData.filter((item) => {
    if (timeRange === "6m") return true
    if (timeRange === "3m") return item.month >= "2024-04"
    return item.month >= "2024-06"
  })

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Ingresos y Gastos</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Últimos 6 meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="6m" className="rounded-lg">
              Últimos 6 meses
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="1m" className="rounded-lg">
              Último mes
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-expenses)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-expenses)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-ES", {
                  month: "short",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleDateString("es-ES", {
                      month: "long",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="revenue"
              type="natural"
              fill="url(#fillRevenue)"
              stroke="var(--color-revenue)"
            />
            <Area
              dataKey="expenses"
              type="natural"
              fill="url(#fillExpenses)"
              stroke="var(--color-expenses)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}