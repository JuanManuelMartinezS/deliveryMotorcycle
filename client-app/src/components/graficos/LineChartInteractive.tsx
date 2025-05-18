"use client"

import * as React from "react"
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

// Datos simulados de pedidos por día
const chartData = [
  { date: "2024-05-01", orders: 45 },
  { date: "2024-05-02", orders: 52 },
  { date: "2024-05-03", orders: 38 },
  { date: "2024-05-04", orders: 67 },
  { date: "2024-05-05", orders: 72 },
  { date: "2024-05-06", orders: 58 },
  { date: "2024-05-07", orders: 49 },
  { date: "2024-05-08", orders: 63 },
  { date: "2024-05-09", orders: 55 },
  { date: "2024-05-10", orders: 70 },
  { date: "2024-05-11", orders: 65 },
  { date: "2024-05-12", orders: 78 },
  { date: "2024-05-13", orders: 60 },
  { date: "2024-05-14", orders: 82 },
  { date: "2024-05-15", orders: 75 },
  { date: "2024-05-16", orders: 68 },
  { date: "2024-05-17", orders: 73 },
  { date: "2024-05-18", orders: 80 },
  { date: "2024-05-19", orders: 65 },
  { date: "2024-05-20", orders: 58 },
  { date: "2024-05-21", orders: 62 },
  { date: "2024-05-22", orders: 70 },
  { date: "2024-05-23", orders: 75 },
  { date: "2024-05-24", orders: 68 },
  { date: "2024-05-25", orders: 72 },
  { date: "2024-05-26", orders: 65 },
  { date: "2024-05-27", orders: 78 },
  { date: "2024-05-28", orders: 82 },
  { date: "2024-05-29", orders: 75 },
  { date: "2024-05-30", orders: 80 },
]

const chartConfig = {
  orders: {
    label: "Pedidos",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function LineChartInteractive() {
  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.orders, 0),
    []
  )

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Pedidos Diarios</CardTitle>
          <CardDescription>Mayo 2024</CardDescription>
        </div>
        <div className="flex">
          <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Total</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">
              {total.toLocaleString()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-ES", {
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="orders"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "long",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey="orders"
              type="monotone"
              stroke="var(--color-orders)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}